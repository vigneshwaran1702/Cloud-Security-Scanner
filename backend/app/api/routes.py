from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import asyncio
from app.mock_data import store

router = APIRouter(prefix="/api/v1")

class VerifyAccountRequest(BaseModel):
    provider: str
    account_id: str
    region: Optional[str] = None

class StartScanRequest(BaseModel):
    provider: Optional[str] = "AWS"
    account_id: Optional[str] = None
    region: Optional[str] = None

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
