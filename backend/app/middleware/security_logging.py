import time
import logging
import json
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.utils.sanitizer import redact_data, redact_text

logger = logging.getLogger("app.security.audit")

class SecurityLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that records audit logs for API requests and responses
    with automatic secret and token redaction.
    """
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        # 1. Sanitize request path and query parameters
        client_ip = request.client.host if request.client else "unknown"
        method = request.method
        raw_url = str(request.url)
        sanitized_url = redact_text(raw_url)

        # 2. Sanitize sensitive headers
        sanitized_headers = {}
        for key, value in request.headers.items():
            k_lower = key.lower()
            if any(s in k_lower for s in ("auth", "cookie", "key", "token", "secret", "credential")):
                sanitized_headers[key] = "[REDACTED]"
            else:
                sanitized_headers[key] = redact_text(value)

        # Process the request
        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)
            status_code = response.status_code

            # Emit sanitized structured audit log
            logger.info(
                f"{method} {sanitized_url} - Status: {status_code} - Duration: {duration_ms}ms - IP: {client_ip}"
            )
            return response

        except Exception as exc:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            safe_exc = redact_text(str(exc))
            logger.error(
                f"{method} {sanitized_url} - Exception: {safe_exc} - Duration: {duration_ms}ms - IP: {client_ip}"
            )
            raise exc
