from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional, Dict, Any, List
import asyncio
from app.mock_data import store

router = APIRouter(prefix="/api/v1")

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
def apply_fix(rec_id: str):
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
