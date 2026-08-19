import hmac
import hashlib
import base64
import json
import time
from typing import Optional, Dict, Any
from app.config import settings

def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def _b64_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode((data + padding).encode('utf-8'))

def get_password_hash(password: str) -> str:
    salt = "cloudguard_salt_2026"
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return pwd_hash.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: Dict[str, Any], expires_delta_seconds: Optional[int] = None) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _b64_encode(json.dumps(header).encode('utf-8'))
    
    payload = data.copy()
    now = int(time.time())
    expire_time = now + (expires_delta_seconds if expires_delta_seconds else (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60))
    payload.update({"iat": now, "exp": expire_time})
    payload_b64 = _b64_encode(json.dumps(payload).encode('utf-8'))
    
    signature_raw = hmac.new(
        settings.SECRET_KEY.encode('utf-8'),
        f"{header_b64}.{payload_b64}".encode('utf-8'),
        hashlib.sha256
    ).digest()
    signature_b64 = _b64_encode(signature_raw)
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, signature_b64 = parts
        
        expected_signature = hmac.new(
            settings.SECRET_KEY.encode('utf-8'),
            f"{header_b64}.{payload_b64}".encode('utf-8'),
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(_b64_encode(expected_signature), signature_b64):
            return None
        
        payload_bytes = _b64_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        if "exp" in payload and time.time() > payload["exp"]:
            return None
            
        return payload
    except Exception:
        return None
