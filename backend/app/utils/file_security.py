import os
import re
import uuid
from pathlib import Path
from typing import Set, Union

ALLOWED_SCAN_EXTENSIONS: Set[str] = {".json", ".sarif", ".csv", ".xml", ".txt"}
MAX_SCAN_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

# Regular expression to remove unsafe characters from filenames
SAFE_FILENAME_REGEX = re.compile(r"[^a-zA-Z0-9_\-\.]")

def sanitize_filename(filename: str) -> str:
    """
    Sanitize an untrusted user-supplied filename to prevent path traversal
    and directory injection attacks.
    """
    if not filename or not isinstance(filename, str):
        return f"import_{uuid.uuid4().hex[:8]}.json"

    # 1. Strip null bytes
    cleaned = filename.replace("\x00", "")

    # 2. Strip Windows drive prefixes (e.g., C:, D:)
    cleaned = re.sub(r"^[a-zA-Z]:", "", cleaned)

    # 3. Strip directory separators and extract basename only
    cleaned = Path(cleaned).name

    # 4. Strip any leading/trailing dots or whitespace
    cleaned = cleaned.strip(". \t\r\n")

    # 5. Filter out non-whitelisted characters
    cleaned = SAFE_FILENAME_REGEX.sub("_", cleaned)

    # 6. Fallback if filename becomes empty
    if not cleaned or cleaned.replace("_", "").replace(".", "") == "":
        cleaned = f"import_{uuid.uuid4().hex[:8]}.json"

    return cleaned

def validate_extension(filename: str, allowed_extensions: Set[str] = ALLOWED_SCAN_EXTENSIONS) -> bool:
    """
    Check if the file extension matches the allowlist of safe scanner import extensions.
    """
    if not filename or "." not in filename:
        return False
    ext = os.path.splitext(filename.lower())[1]
    return ext in allowed_extensions

def is_safe_path(base_dir: Union[str, Path], target_path: Union[str, Path]) -> bool:
    """
    Verify that target_path resolves strictly within base_dir, preventing directory escape.
    """
    try:
        base = Path(base_dir).resolve()
        target = Path(target_path).resolve()
        return base == target or base in target.parents
    except Exception:
        return False

def get_secure_upload_path(base_dir: Union[str, Path], user_filename: str) -> Path:
    """
    Generate a safe, canonical destination path inside the sandbox directory.
    Raises ValueError if path traversal is detected.
    """
    base = Path(base_dir).resolve()
    base.mkdir(parents=True, exist_ok=True)

    # Sanitize and assign safe storage key
    safe_name = sanitize_filename(user_filename)
    unique_name = f"{uuid.uuid4().hex[:10]}_{safe_name}"
    destination = (base / unique_name).resolve()

    if not is_safe_path(base, destination):
        raise ValueError("Invalid target path: directory traversal attempt detected.")

    return destination
