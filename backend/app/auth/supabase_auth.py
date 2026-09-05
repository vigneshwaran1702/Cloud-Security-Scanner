import json
import logging
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, Tuple
from app.config import settings

logger = logging.getLogger(__name__)

def _get_headers(token: Optional[str] = None) -> Dict[str, str]:
    headers = {
        "Content-Type": "application/json",
        "apikey": settings.SUPABASE_KEY,
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    else:
        headers["Authorization"] = f"Bearer {settings.SUPABASE_KEY}"
    return headers

def supabase_sign_in_with_password(email: str, password: str) -> Tuple[bool, Dict[str, Any], Optional[str]]:
    """
    Sign in user using Supabase Auth REST API (grant_type=password).
    Returns (success, data_or_user, error_message).
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        return False, {}, "Supabase credentials not configured"

    url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/token?grant_type=password"
    payload = json.dumps({"email": email, "password": password}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=_get_headers(), method="POST")

    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            user_obj = res_data.get("user", {})
            user_meta = user_obj.get("user_metadata", {}) or {}

            formatted_user = {
                "id": user_obj.get("id"),
                "name": user_meta.get("name") or user_meta.get("full_name") or email.split("@")[0].title(),
                "email": user_obj.get("email", email),
                "role": user_meta.get("role", "user"),
                "auth_provider": "supabase",
                "is_active": True,
                "created_at": user_obj.get("created_at", "2026-09-03 12:00:00"),
                "app_metadata": user_obj.get("app_metadata", {}),
            }

            return True, {
                "access_token": res_data.get("access_token"),
                "refresh_token": res_data.get("refresh_token"),
                "token_type": "bearer",
                "user": formatted_user
            }, None

    except urllib.error.HTTPError as e:
        error_body = ""
        try:
            error_body = json.loads(e.read().decode("utf-8"))
        except Exception:
            error_body = {}

        error_msg = error_body.get("error_description") or error_body.get("msg") or error_body.get("message") or f"Supabase auth error (HTTP {e.code})"
        logger.warning(f"Supabase login HTTP error {e.code}: {error_msg}")
        return False, {}, error_msg

    except Exception as e:
        logger.error(f"Supabase connection exception: {str(e)}")
        return False, {}, f"Unable to reach Supabase authentication server: {str(e)}"

def supabase_sign_up(email: str, password: str, name: str, role: str = "user") -> Tuple[bool, Dict[str, Any], Optional[str]]:
    """
    Sign up new user using Supabase Auth REST API.
    Returns (success, data_or_user, error_message).
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        return False, {}, "Supabase credentials not configured"

    url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/signup"
    payload = json.dumps({
        "email": email,
        "password": password,
        "data": {
            "name": name,
            "role": role,
            "full_name": name
        }
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers=_get_headers(), method="POST")

    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            user_obj = res_data.get("user") or res_data
            user_meta = user_obj.get("user_metadata", {}) or {}

            # Supabase anti-enumeration check: if email confirmation is enabled and user already exists, identities is empty list []
            identities = res_data.get("identities")
            if identities is not None and isinstance(identities, list) and len(identities) == 0:
                return False, {}, "An account with this email already exists. Please sign in instead."

            formatted_user = {
                "id": user_obj.get("id"),
                "name": user_meta.get("name") or name,
                "email": user_obj.get("email", email),
                "role": user_meta.get("role", role),
                "auth_provider": "supabase",
                "is_active": True,
                "created_at": user_obj.get("created_at", "2026-09-03 12:00:00")
            }

            token = res_data.get("access_token")
            return True, {
                "access_token": token or f"jwt_supabase_{user_obj.get('id', 'new')}",
                "refresh_token": res_data.get("refresh_token"),
                "token_type": "bearer",
                "user": formatted_user,
                "confirmation_required": token is None
            }, None

    except urllib.error.HTTPError as e:
        error_body = ""
        try:
            error_body = json.loads(e.read().decode("utf-8"))
        except Exception:
            error_body = {}

        raw_msg = error_body.get("error_description") or error_body.get("msg") or error_body.get("message") or f"Supabase registration error (HTTP {e.code})"
        if any(keyword in raw_msg.lower() for keyword in ["already", "registered", "exists", "duplicate", "conflict"]):
            error_msg = "An account with this email already exists. Please sign in instead."
        else:
            error_msg = raw_msg
        logger.warning(f"Supabase signup HTTP error {e.code}: {error_msg}")
        return False, {}, error_msg

    except Exception as e:
        logger.error(f"Supabase connection exception: {str(e)}")
        return False, {}, f"Unable to reach Supabase authentication server: {str(e)}"

def supabase_get_user(access_token: str) -> Tuple[bool, Dict[str, Any], Optional[str]]:
    """
    Get current user info from Supabase using access_token.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY or not access_token:
        return False, {}, "Missing token or config"

    url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user"
    req = urllib.request.Request(url, headers=_get_headers(token=access_token), method="GET")

    try:
        with urllib.request.urlopen(req, timeout=6) as response:
            user_obj = json.loads(response.read().decode("utf-8"))
            user_meta = user_obj.get("user_metadata", {}) or {}
            formatted_user = {
                "id": user_obj.get("id"),
                "name": user_meta.get("name") or user_meta.get("full_name") or user_obj.get("email", "").split("@")[0].title(),
                "email": user_obj.get("email"),
                "role": user_meta.get("role", "user"),
                "auth_provider": "supabase",
                "is_active": True,
            }
            return True, formatted_user, None
    except Exception as e:
        return False, {}, str(e)
