import json
import logging
from pathlib import Path
from typing import Dict, Any, Tuple
from fastapi import UploadFile, HTTPException
from app.utils.file_security import (
    sanitize_filename,
    validate_extension,
    get_secure_upload_path,
    MAX_SCAN_FILE_SIZE_BYTES,
    ALLOWED_SCAN_EXTENSIONS
)
from app.mock_data import store

logger = logging.getLogger("app.import")

# Isolated sandbox directory for uploaded scan results
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "storage" / "imports"

async def process_scan_upload(file: UploadFile) -> Dict[str, Any]:
    """
    Securely process, validate, and parse uploaded scan results file.
    Guarantees strict path containment, size limits, and format verification.
    """
    original_filename = file.filename or "unknown.json"
    
    # 1. Null-byte / illegal character validation
    if "\x00" in original_filename or "%00" in original_filename:
        logger.warning("Upload rejected: Null byte injection detected in filename")
        raise HTTPException(status_code=400, detail="Invalid filename: null byte injection detected.")

    # 2. Extension validation
    if not validate_extension(original_filename):
        logger.warning(f"Upload rejected: Disallowed extension in '{original_filename}'")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Allowed extensions are: {', '.join(sorted(ALLOWED_SCAN_EXTENSIONS))}"
        )

    # 3. Path resolution & containment check
    try:
        dest_path = get_secure_upload_path(UPLOAD_DIR, original_filename)
    except ValueError as e:
        logger.warning(f"Upload rejected: Path traversal attempt '{original_filename}': {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid file path: path traversal detected.")

    # 4. Stream and size check
    total_bytes = 0
    content_chunks = []
    
    while True:
        chunk = await file.read(64 * 1024)
        if not chunk:
            break
        total_bytes += len(chunk)
        if total_bytes > MAX_SCAN_FILE_SIZE_BYTES:
            logger.warning(f"Upload rejected: File size {total_bytes} exceeded limit")
            raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 10 MB.")
        content_chunks.append(chunk)

    raw_bytes = b"".join(content_chunks)

    # 5. Write to secure destination
    try:
        with open(dest_path, "wb") as f:
            f.write(raw_bytes)
    except Exception as e:
        logger.error(f"Failed to write uploaded file safely: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to store uploaded scan results securely.")

    # 6. Parse and validate scan payload content
    parsed_data = {}
    try:
        text_content = raw_bytes.decode("utf-8")
        parsed_data = json.loads(text_content)
    except Exception as e:
        logger.warning(f"Failed to parse scan file JSON: {str(e)}")
        # If not JSON, check if it's text/csv summary
        return {
            "success": True,
            "filename": sanitize_filename(original_filename),
            "stored_path": str(dest_path.name),
            "size_bytes": total_bytes,
            "message": "Scan file imported and stored safely.",
            "imported_resources": 0,
            "imported_findings": 0
        }

    # 7. Ingest scan findings into store if valid scan format
    imported_resources_count = 0
    imported_recs_count = 0

    if isinstance(parsed_data, dict):
        if "resources" in parsed_data and isinstance(parsed_data["resources"], list):
            store.resources.extend(parsed_data["resources"])
            imported_resources_count = len(parsed_data["resources"])
        if "recommendations" in parsed_data and isinstance(parsed_data["recommendations"], list):
            store.recommendations.extend(parsed_data["recommendations"])
            imported_recs_count = len(parsed_data["recommendations"])
        if "stats" in parsed_data and isinstance(parsed_data["stats"], dict):
            store.stats.update(parsed_data["stats"])

    logger.info(
        f"Scan results imported successfully from '{dest_path.name}' "
        f"({imported_resources_count} resources, {imported_recs_count} findings)"
    )

    return {
        "success": True,
        "filename": sanitize_filename(original_filename),
        "storage_key": dest_path.name,
        "size_bytes": total_bytes,
        "message": f"Successfully imported {imported_resources_count} resource(s) and {imported_recs_count} finding(s).",
        "imported_resources": imported_resources_count,
        "imported_findings": imported_recs_count,
        "stats": store.stats
    }
