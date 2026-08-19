from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, status
from typing import Optional, Dict, Any, List
import asyncio
from app.mock_data import store
from app.schemas.auth import UserLogin, UserRegister, UserResponse, TokenResponse, RoleUpdateRequest
from app.auth.jwt import create_access_token
from app.auth.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/api/v1")

# --- AUTH ENDPOINTS ---

@router.post("/auth/login", response_model=TokenResponse)
def login(payload: UserLogin):
    user = store.authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    token = create_access_token(data={"sub": str(user["id"]), "email": user["email"], "role": user["role"]})
    user_resp = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=user.get("created_at")
    )
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)

@router.post("/auth/register", response_model=TokenResponse)
def register(payload: UserRegister):
    existing = store.get_user_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )
    
    user = store.create_user(
        name=payload.name,
        email=payload.email,
        plain_password=payload.password,
        role=payload.role or "user"
    )
    
    token = create_access_token(data={"sub": str(user["id"]), "email": user["email"], "role": user["role"]})
    user_resp = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=user.get("created_at")
    )
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)

@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        is_active=current_user["is_active"],
        created_at=current_user.get("created_at")
    )

@router.post("/auth/verify-admin-id", response_model=TokenResponse)
def verify_admin_id(payload: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    admin_key = payload.get("admin_key") or payload.get("admin_id") or ""
    elevated_user = store.verify_admin_key(admin_key, current_user["id"])
    if not elevated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Admin ID or Access Key. Verification failed.",
        )
    
    token = create_access_token(data={"sub": str(elevated_user["id"]), "email": elevated_user["email"], "role": elevated_user["role"]})
    user_resp = UserResponse(
        id=elevated_user["id"],
        name=elevated_user["name"],
        email=elevated_user["email"],
        role=elevated_user["role"],
        is_active=elevated_user["is_active"],
        created_at=elevated_user.get("created_at")
    )
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)

@router.post("/cloud/verify-account")
def verify_cloud_account(payload: Dict[str, Any]):
    provider = payload.get("provider", "AWS")
    account_id = payload.get("account_id", "891230912401")
    result = store.verify_cloud_account(provider, account_id)
    return {"success": True, "account_status": result}

# --- ADMIN USER MANAGEMENT ENDPOINTS ---

@router.get("/users", response_model=List[UserResponse])
def get_all_users(admin_user: dict = Depends(get_current_admin)):
    users = store.get_all_users()
    return [UserResponse(**u) for u in users]

@router.patch("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(user_id: int, payload: RoleUpdateRequest, admin_user: dict = Depends(get_current_admin)):
    if payload.role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'admin' or 'user'.")
    
    updated = store.update_user_role(user_id, payload.role)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**updated)

@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin_user: dict = Depends(get_current_admin)):
    if admin_user["id"] == user_id:
        raise HTTPException(status_code=400, detail="You cannot delete your own admin account")
    
    success = store.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "message": f"User {user_id} deleted successfully"}

# --- APPLICATION DATA ENDPOINTS ---

@router.get("/dashboard/stats")
def get_dashboard_stats():
    return {
        "success": True,
        "data": store.stats,
        "scan_info": store.scan_state
    }

async def simulate_scan_task():
    store.start_scan()
    for progress in range(20, 101, 20):
        await asyncio.sleep(0.5)
        store.scan_state["progress"] = progress
    store.finish_scan()

@router.post("/scan/start")
async def start_scan(background_tasks: BackgroundTasks):
    if store.scan_state["is_scanning"]:
        return {"success": False, "message": "Scan already in progress", "scan_info": store.scan_state}
    
    background_tasks.add_task(simulate_scan_task)
    return {"success": True, "message": "Cloud scan initiated successfully", "scan_info": store.scan_state}

@router.get("/scan/status")
def get_scan_status():
    return {"success": True, "scan_info": store.scan_state}

@router.get("/resources")
def get_resources(cloud: Optional[str] = None, severity: Optional[str] = None, search: Optional[str] = None):
    results = store.resources
    if cloud and cloud.lower() != "all":
        results = [r for r in results if r["cloud"].lower() == cloud.lower()]
    if severity and severity.lower() != "all":
        results = [r for r in results if r["severity"].lower() == severity.lower()]
    if search:
        s = search.lower()
        results = [r for r in results if s in r["name"].lower() or s in r["type"].lower() or s in r["issue"].lower()]
    
    return {"success": True, "total": len(results), "data": results}

@router.get("/recommendations")
def get_recommendations():
    return {"success": True, "data": store.recommendations}

@router.post("/recommendations/{rec_id}/apply")
def apply_fix(rec_id: str, current_user: dict = Depends(get_current_user)):
    success = store.apply_recommendation_fix(rec_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return {
        "success": True,
        "message": f"Auto-remediation applied successfully for {rec_id}",
        "stats": store.stats,
        "recommendations": store.recommendations
    }

@router.get("/compliance")
def get_compliance():
    return {"success": True, "data": store.compliance}

@router.get("/settings")
def get_settings():
    return {"success": True, "data": store.settings}

@router.post("/settings")
def update_settings(payload: Dict[str, Any], current_admin: dict = Depends(get_current_admin)):
    if "aws" in payload:
        store.settings["aws"].update(payload["aws"])
    if "azure" in payload:
        store.settings["azure"].update(payload["azure"])
    if "gcp" in payload:
        store.settings["gcp"].update(payload["gcp"])
    if "general" in payload:
        store.settings["general"].update(payload["general"])
        
    return {"success": True, "message": "Settings updated successfully", "data": store.settings}

