import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            def __init__(self, **kwargs):
                for k, v in kwargs.items():
                    setattr(self, k, v)

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Cloud Security Scanner"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/cloudsec")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # LLM config
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Supabase config
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://axkfyqvwgdlptgvbonut.supabase.co"))
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_PUBLISHABLE_KEY", os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_9jZwoM-XQbBS2VL8_3fsbQ_2xuPMgMg"))))

    class Config:
        env_file = ".env"

settings = Settings()
