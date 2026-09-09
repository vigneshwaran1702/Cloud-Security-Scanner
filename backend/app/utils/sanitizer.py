import re
from typing import Any, Dict, List, Set, Union

# Set of sensitive dictionary leaf keys to redact (case-insensitive check)
SENSITIVE_LEAF_KEYS: Set[str] = {
    "password",
    "hashed_password",
    "secret",
    "secret_key",
    "secret_access_key",
    "aws_secret_key",
    "aws_secret_access_key",
    "azure_client_secret",
    "client_secret",
    "access_token",
    "refresh_token",
    "api_key",
    "apikey",
    "private_key",
    "token",
    "authorization",
    "cookie",
    "set-cookie",
    "session",
    "slack_webhook",
}

SENSITIVE_KEYS = SENSITIVE_LEAF_KEYS

# Regex patterns for matching sensitive strings within arbitrary text
REDACTION_RULES = [
    # Authorization / Bearer tokens
    (re.compile(r"(Bearer\s+)[A-Za-z0-9_\-\.+=]+", re.IGNORECASE), r"\1[REDACTED_TOKEN]"),
    
    # Standard JWT tokens (header.payload.signature)
    (re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_\-+=]*"), "[REDACTED_JWT]"),
    
    # Custom / local test tokens (e.g. jwt_1000_123456)
    (re.compile(r"jwt_[A-Za-z0-9_\-]+"), "jwt_[REDACTED]"),
    
    # AWS Access Key IDs (AKIA, ASIA, AROA + 16 chars)
    (re.compile(r"(?<![A-Z0-9])(AKIA|ASIA|AROA)[A-Z0-9]{16}(?![A-Z0-9])"), r"\1[REDACTED_KEY_ID]"),
    
    # OpenAI & generic sk- API keys
    (re.compile(r"sk-[A-Za-z0-9_\-]{20,}"), "sk-[REDACTED_KEY]"),
    
    # Supabase keys
    (re.compile(r"sb_(?:publishable|secret)_[A-Za-z0-9_\-]+"), "sb_[REDACTED_KEY]"),
    
    # Database connection URIs with embedded passwords (postgresql://user:pass@host)
    (re.compile(r"((?:postgres|postgresql|mysql|mongodb|redis|amqp)://[^:/?#\s]+:)(.+)(@[\w\.\-]+(?::\d+)?(?:/[^\s]*)?)", re.IGNORECASE), r"\1[REDACTED_PASSWORD]\3"),
    
    # Slack Incoming Webhooks
    (re.compile(r"https://hooks\.slack\.com/services/[A-Za-z0-9/_\-]+"), "https://hooks.slack.com/services/[REDACTED_WEBHOOK]"),
    
    # Key-value secret patterns in logs / text / JSON (e.g., password="...", secret_access_key=xyz, "client_secret": "...")
    (re.compile(r"""(?i)(["']?(?:password|secret|secret_key|secret_access_key|aws_secret_access_key|azure_client_secret|client_secret|api_key|apikey|access_token|refresh_token)["']?\s*[:=]\s*["']?)([^"',\s\r\n}]+)(["']?)"""), r"\1[REDACTED]\3"),
]

def redact_text(text: str) -> str:
    """
    Sanitize arbitrary text string by replacing known secret patterns with redaction placeholders.
    """
    if not isinstance(text, str):
        return text
    
    result = text
    for pattern, replacement in REDACTION_RULES:
        result = pattern.sub(replacement, result)
    return result

def redact_data(data: Any, max_depth: int = 10) -> Any:
    """
    Recursively sanitize dictionaries, lists, sets, and primitives.
    Redacts both known sensitive keys and sensitive string patterns.
    """
    if max_depth <= 0:
        return "[MAX_DEPTH_EXCEEDED]"

    if isinstance(data, dict):
        sanitized = {}
        for k, v in data.items():
            key_str = str(k).lower()
            if isinstance(v, (dict, list, tuple, set)):
                sanitized[k] = redact_data(v, max_depth - 1)
            elif any(s_key == key_str or f"_{s_key}" in key_str or f"{s_key}_" in key_str for s_key in SENSITIVE_LEAF_KEYS):
                sanitized[k] = "[REDACTED]"
            else:
                sanitized[k] = redact_data(v, max_depth - 1)
        return sanitized

    elif isinstance(data, (list, tuple, set)):
        items = [redact_data(item, max_depth - 1) for item in data]
        if isinstance(data, list):
            return items
        elif isinstance(data, tuple):
            return tuple(items)
        return set(items)

    elif isinstance(data, str):
        return redact_text(data)

    return data

def mask_secret(value: str, visible_prefix: int = 0) -> str:
    """
    Mask a secret string (e.g. for displaying in settings UI safely).
    """
    if not value or not isinstance(value, str):
        return ""
    if visible_prefix > 0 and len(value) > visible_prefix:
        return f"{value[:visible_prefix]}{'*' * 8}"
    return "********"
