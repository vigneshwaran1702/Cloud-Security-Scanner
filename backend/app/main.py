from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Cloud Security Scanner API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
