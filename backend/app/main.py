from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="AI Cloud Security Scanner",
    description="API for scanning and analyzing cloud infrastructure security",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Cloud Security Scanner API"}

@app.get("/health")
def health_check():
    import urllib.request
    from app.config import settings

    supabase_status = "unconfigured"
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/health"
            req = urllib.request.Request(url, headers={"apikey": settings.SUPABASE_KEY})
            with urllib.request.urlopen(req, timeout=4) as response:
                supabase_status = "connected (online)" if response.status == 200 else f"HTTP {response.status}"
        except Exception as e:
            supabase_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "services": {
            "api_server": "online",
            "supabase_auth": supabase_status,
            "supabase_url": settings.SUPABASE_URL,
            "database_driver": "postgresql/sqlite/in-memory",
            "database_url_configured": bool(settings.DATABASE_URL)
        }
    }

