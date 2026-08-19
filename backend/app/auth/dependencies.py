from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import decode_access_token
from app.mock_data import store

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    user = store.get_user_by_id(int(user_id))
    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    return user

def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin" or current_user.get("email", "").lower() != "vigneshcloud@gmail.com":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admin portal is restricted exclusively to vigneshcloud@gmail.com",
        )
    return current_user
