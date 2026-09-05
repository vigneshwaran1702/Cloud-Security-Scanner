from fastapi import APIRouter, HTTPException, BackgroundTasks, Header
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import asyncio
from app.mock_data import store
from app.auth.supabase_auth import (
    supabase_sign_in_with_password,
    supabase_sign_up,
    supabase_get_user
)

router = APIRouter(prefix="/api/v1")

class VerifyAccountRequest(BaseModel):
    provider: str
    account_id: str
    region: Optional[str] = None

class StartScanRequest(BaseModel):
    provider: Optional[str] = "AWS"
    account_id: Optional[str] = None
    region: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "user"

class GoogleAuthRequest(BaseModel):
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None

# In-memory user store for demo/live backend cache
backend_users = []

@router.post("/auth/login")
def auth_login(payload: LoginRequest):
    email = payload.email.strip().lower()
    password = payload.password

    # 1. Attempt authentication with Supabase Auth
    supa_ok, supa_data, supa_err = supabase_sign_in_with_password(email, password)
    if supa_ok:
        user_info = supa_data["user"]
        # Cache user in backend_users
        existing = next((u for u in backend_users if u["email"].lower() == email), None)
        if not existing:
            backend_users.append({**user_info, "password": password})
        return {
            "access_token": supa_data["access_token"],
            "refresh_token": supa_data.get("refresh_token"),
            "token_type": "bearer",
            "user": user_info
        }

    # If Supabase returned an explicit invalid credential rejection, check local cache or reject
    user = next((u for u in backend_users if u["email"].lower() == email), None)
    if user:
        if user.get("password") and user.get("password") != password:
            raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")
        user_data = {k: v for k, v in user.items() if k != "password"}
        return {
            "access_token": f"jwt_{user['id']}_{int(asyncio.get_event_loop().time() * 1000)}",
            "token_type": "bearer",
            "user": user_data
        }

    # If Supabase gave a specific rejection (e.g. invalid login credentials), return it
    if supa_err and "credentials" in supa_err.lower():
        raise HTTPException(status_code=401, detail=supa_err)

    # Seamless registration for fresh local test accounts if Supabase wasn't explicitly rejecting
    prefix = email.split("@")[0].replace(".", " ").replace("_", " ").title()
    new_user = {
        "id": len(backend_users) + 1000,
        "name": prefix or "Cloud User",
        "email": email,
        "password": password,
        "role": "user",
        "auth_provider": "local_fallback",
        "is_active": True,
        "created_at": "2026-09-03 12:00:00"
    }
    backend_users.append(new_user)
    user_data = {k: v for k, v in new_user.items() if k != "password"}
    return {
        "access_token": f"jwt_{new_user['id']}_token",
        "token_type": "bearer",
        "user": user_data
    }

@router.post("/auth/register")
def auth_register(payload: RegisterRequest):
    email = payload.email.strip().lower()
    name = payload.name.strip()
    password = payload.password
    role = payload.role or "user"

    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    if not password:
        raise HTTPException(status_code=400, detail="Password is required.")

    # 1. Register with Supabase Auth
    supa_ok, supa_data, supa_err = supabase_sign_up(email, password, name, role)
    if supa_ok:
        user_info = supa_data["user"]
        existing = next((u for u in backend_users if u["email"].lower() == email), None)
        if not existing:
            backend_users.append({**user_info, "password": password})
        return {
            "access_token": supa_data["access_token"],
            "token_type": "bearer",
            "user": user_info,
            "confirmation_required": supa_data.get("confirmation_required", False)
        }

    # If Supabase gave a user already registered or validation error
    if supa_err and ("already" in supa_err.lower() or "registered" in supa_err.lower()):
        raise HTTPException(status_code=400, detail=supa_err)

    # Local fallback registration
    existing = next((u for u in backend_users if u["email"].lower() == email), None)
    if existing:
        existing["name"] = name
        existing["password"] = password
        user_data = {k: v for k, v in existing.items() if k != "password"}
        return {
            "access_token": f"jwt_{existing['id']}_token",
            "token_type": "bearer",
            "user": user_data
        }

    new_user = {
        "id": len(backend_users) + 1000,
        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "auth_provider": "local_fallback",
        "is_active": True,
        "created_at": "2026-09-03 12:00:00"
    }
    backend_users.append(new_user)
    user_data = {k: v for k, v in new_user.items() if k != "password"}
    return {
        "access_token": f"jwt_{new_user['id']}_token",
        "token_type": "bearer",
        "user": user_data
    }

@router.post("/auth/google")
def auth_google(payload: GoogleAuthRequest):
    email = payload.email.strip().lower()
    name = payload.name or email.split("@")[0].replace(".", " ").title()
    
    existing = next((u for u in backend_users if u["email"].lower() == email), None)
    if existing:
        user_data = {k: v for k, v in existing.items() if k != "password"}
        return {
            "access_token": f"jwt_google_{existing['id']}",
            "token_type": "bearer",
            "user": user_data
        }

    new_user = {
        "id": len(backend_users) + 1000,
        "name": name,
        "email": email,
        "role": "user",
        "auth_provider": "google",
        "picture": payload.picture,
        "is_active": True,
        "created_at": "2026-09-03 12:00:00"
    }
    backend_users.append(new_user)
    return {
        "access_token": f"jwt_google_{new_user['id']}",
        "token_type": "bearer",
        "user": new_user
    }

@router.get("/auth/me")
def auth_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "").strip()
    if not token or token == "null" or token == "undefined":
        raise HTTPException(status_code=401, detail="Invalid token")

    # Verify with Supabase if token looks like a Supabase JWT
    if len(token) > 50 and "." in token:
        supa_ok, user_data, _ = supabase_get_user(token)
        if supa_ok:
            return user_data

    if backend_users:
        user_data = {k: v for k, v in backend_users[0].items() if k != "password"}
        return user_data
    raise HTTPException(status_code=401, detail="User not found")

@router.get("/dashboard/stats")
def get_dashboard_stats():
    return {
        "success": True,
        "data": store.stats,
        "scan_info": store.scan_state
    }

async def simulate_scan_task(provider: str, account_id: str, region: Optional[str]):
    store.start_scan(provider=provider, account_id=account_id)
    for progress in range(20, 101, 20):
        await asyncio.sleep(0.4)
        store.scan_state["progress"] = progress
    store.finish_scan(provider=provider, account_id=account_id)

@router.post("/scan/start")
async def start_scan(payload: Optional[StartScanRequest] = None, background_tasks: BackgroundTasks = None):
    if store.scan_state["is_scanning"]:
        return {"success": False, "message": "Scan already in progress", "scan_info": store.scan_state}
    
    provider = payload.provider if payload and payload.provider else (store.active_provider or "AWS")
    account_id = payload.account_id if payload and payload.account_id else (store.active_cloud_id or "default-account")
    region = payload.region if payload else None

    if background_tasks:
        background_tasks.add_task(simulate_scan_task, provider, account_id, region)
    else:
        await simulate_scan_task(provider, account_id, region)

    return {
        "success": True,
        "message": f"Cloud scan initiated for {provider} Cloud ID: {account_id}",
        "scan_info": store.scan_state
    }

@router.post("/cloud/verify-account")
def verify_cloud_account(payload: VerifyAccountRequest):
    if not payload.account_id or not payload.account_id.strip():
        raise HTTPException(status_code=400, detail="Cloud Account ID / Subscription ID is required.")
    
    result = store.verify_account(payload.provider, payload.account_id, payload.region)
    return {
        "success": True,
        "account_status": result
    }

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

@router.post("/recommendations/clear-all")
def clear_all_risks():
    result = store.clear_all_risks_and_failures()
    return result

@router.post("/resources/clear-failures")
def clear_resource_failures():
    result = store.clear_all_risks_and_failures()
    return result

@router.post("/recommendations/{rec_id}/apply")
def apply_fix(rec_id: str):
    success = store.apply_recommendation_fix(rec_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return {
        "success": True,
        "message": f"Auto-remediation applied successfully for {rec_id}",
        "stats": store.stats,
        "recommendations": store.recommendations,
        "resources": store.resources
    }

@router.get("/compliance")
def get_compliance():
    return {"success": True, "data": store.compliance}

@router.get("/settings")
def get_settings():
    return {"success": True, "data": store.settings}

@router.post("/settings")
def update_settings(payload: Dict[str, Any]):
    if "aws" in payload:
        store.settings["aws"].update(payload["aws"])
    if "azure" in payload:
        store.settings["azure"].update(payload["azure"])
    if "gcp" in payload:
        store.settings["gcp"].update(payload["gcp"])
    if "general" in payload:
        store.settings["general"].update(payload["general"])
        
    return {"success": True, "message": "Settings updated successfully", "data": store.settings}
