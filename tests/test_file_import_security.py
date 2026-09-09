import unittest
import io
import sys
import os
import json
from pathlib import Path

# Add backend directory to sys.path so app modules are resolvable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.utils.file_security import (
    sanitize_filename,
    validate_extension,
    is_safe_path,
    get_secure_upload_path,
    ALLOWED_SCAN_EXTENSIONS,
    MAX_SCAN_FILE_SIZE_BYTES
)
from app.services.import_service import UPLOAD_DIR
from app.mock_data import store
from app.main import app
from starlette.testclient import TestClient

class TestFileImportSecurity(unittest.TestCase):

    def test_sanitize_filename_strips_path_traversal(self):
        # 1. Unix directory traversal
        self.assertEqual(sanitize_filename("../../etc/passwd.json"), "passwd.json")
        self.assertEqual(sanitize_filename("../../../var/log/audit.json"), "audit.json")

        # 2. Windows directory traversal and drive letters
        self.assertEqual(sanitize_filename(r"..\..\windows\system32\calc.exe.json"), "calc.exe.json")
        self.assertEqual(sanitize_filename(r"C:\Windows\System32\drivers\scan.json"), "scan.json")

        # 3. Path with special dangerous characters
        self.assertEqual(sanitize_filename("scan_report;rm -rf.json"), "scan_report_rm_-rf.json")

        # 4. Dangerous empty / dot-only names
        sanitized = sanitize_filename("../../../")
        self.assertTrue(sanitized.startswith("import_") and sanitized.endswith(".json"))

    def test_validate_extension_allowlist(self):
        # Allowed scanner extensions
        for ext in [".json", ".sarif", ".csv", ".xml", ".txt"]:
            self.assertTrue(validate_extension(f"results{ext}"))

        # Dangerous or disallowed extensions
        for bad_file in ["script.py", "malware.exe", "exploit.sh", "server.php", "config.bat", "run.cmd"]:
            self.assertFalse(validate_extension(bad_file))
            self.assertFalse(validate_extension(bad_file.upper()))

    def test_is_safe_path_containment(self):
        base = Path(__file__).resolve().parent
        safe_child = base / "safe_file.json"
        unsafe_escape = base / ".." / "outside_file.json"

        self.assertTrue(is_safe_path(base, safe_child))
        self.assertFalse(is_safe_path(base, unsafe_escape))

    def test_get_secure_upload_path_sandboxing(self):
        dest = get_secure_upload_path(UPLOAD_DIR, "../../../etc/shadow.json")
        # Ensure final resolved path is strictly inside UPLOAD_DIR
        self.assertTrue(is_safe_path(UPLOAD_DIR, dest))
        self.assertTrue(dest.name.endswith("_shadow.json"))

    def test_upload_scan_results_rejects_disallowed_extension(self):
        client = TestClient(app)
        fake_payload = io.BytesIO(b"import os; os.system('calc')")
        
        response = client.post(
            "/api/v1/scan/upload-results",
            files={"file": ("exploit.py", fake_payload, "text/x-python")}
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid file extension", response.json()["detail"])

    def test_upload_scan_results_rejects_null_byte_injection(self):
        client = TestClient(app)
        fake_payload = io.BytesIO(b'{"status": "ok"}')
        
        response = client.post(
            "/api/v1/scan/upload-results",
            files={"file": ("scan_results.json\x00.exe", fake_payload, "application/json")}
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("null byte", response.json()["detail"].lower())

    def test_upload_scan_results_sanitizes_path_traversal_filename(self):
        client = TestClient(app)
        scan_data = {
            "resources": [
                {"id": "res-imp-1", "name": "imported-s3-prod", "type": "S3 Bucket", "cloud": "AWS", "region": "us-east-1", "severity": "high", "status": "Non-compliant", "issue": "Public Bucket"}
            ],
            "recommendations": [
                {"id": "rec-imp-1", "title": "Imported S3 Risk", "severity": "high", "resource": "imported-s3-prod", "cloud": "AWS", "risk_contribution": 30, "blast_radius": "Data Exposure", "risk_analysis": "Public access", "impacts": ["Leak"], "fixes": ["Block public access"], "status": "open", "auto_fixable": True}
            ]
        }
        json_bytes = io.BytesIO(json.dumps(scan_data).encode("utf-8"))

        response = client.post(
            "/api/v1/scan/upload-results",
            files={"file": ("../../etc/shadow.json", json_bytes, "application/json")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        # Filename was sanitized to shadow.json without directory traversal
        self.assertEqual(data["filename"], "shadow.json")
        self.assertEqual(data["imported_resources"], 1)
        self.assertEqual(data["imported_findings"], 1)

    def test_import_endpoint_parity(self):
        client = TestClient(app)
        scan_data = {"resources": [], "recommendations": []}
        json_bytes = io.BytesIO(json.dumps(scan_data).encode("utf-8"))

        response = client.post(
            "/api/v1/scan/import",
            files={"file": ("valid_scan_summary.sarif", json_bytes, "application/json")}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

if __name__ == "__main__":
    unittest.main()
