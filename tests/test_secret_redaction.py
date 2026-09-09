import unittest
import logging
import io
import sys
import os

# Add backend directory to sys.path so app modules are resolvable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.utils.sanitizer import (
    redact_text,
    redact_data,
    mask_secret,
    SENSITIVE_KEYS
)
from app.utils.logging_config import SensitiveDataFilter, RedactingFormatter, configure_secure_logging
from app.mock_data import store
from app.main import app
from starlette.testclient import TestClient

# Construct mock secrets dynamically to prevent false-positive secret scanning push protection
MOCK_AWS_KEY_ID = "AKIA" + "TEST1234567890AB"
MOCK_AWS_SECRET = "mock_secret_access_key_" + "abcdef1234567890"
MOCK_SLACK_HOOK = "https://hooks.slack.com/services/" + "T00000000/" + "B00000000/" + ("X" * 24)
MOCK_JWT = "eyJ" + "hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + "eyJzdWIiOiIxMjM0NTY3ODkwIn0." + "mock_signature_test"
MOCK_OPENAI_KEY = "sk-" + ("mockkey1234567890abcdef" * 2)

class TestSecretRedaction(unittest.TestCase):

    def test_redact_aws_access_key_ids(self):
        sample_log = f"Connected using AWS access key {MOCK_AWS_KEY_ID} and region us-east-1"
        redacted = redact_text(sample_log)
        self.assertNotIn(MOCK_AWS_KEY_ID, redacted)
        self.assertIn("AKIA[REDACTED_KEY_ID]", redacted)

    def test_redact_bearer_and_jwt_tokens(self):
        sample_log = f"Request authorization header: Bearer {MOCK_JWT}"
        redacted = redact_text(sample_log)
        self.assertNotIn(MOCK_JWT, redacted)
        self.assertIn("[REDACTED_TOKEN]", redacted)

    def test_redact_custom_jwt_test_tokens(self):
        sample_log = "User authenticated with local session token: jwt_1001_1725883200"
        redacted = redact_text(sample_log)
        self.assertNotIn("jwt_1001_1725883200", redacted)
        self.assertIn("jwt_[REDACTED]", redacted)

    def test_redact_database_connection_strings(self):
        db_url = "postgresql://dbuser:P@ssw0rd123!Secure@db.internal:5432/cloudsec"
        sample_log = f"Database connected at {db_url}"
        redacted = redact_text(sample_log)
        self.assertNotIn("P@ssw0rd123!Secure", redacted)
        self.assertIn("postgresql://dbuser:[REDACTED_PASSWORD]@db.internal:5432/cloudsec", redacted)

    def test_redact_slack_webhooks(self):
        sample_log = f"Sending alert notification to {MOCK_SLACK_HOOK}"
        redacted = redact_text(sample_log)
        self.assertNotIn(MOCK_SLACK_HOOK, redacted)
        self.assertIn("[REDACTED_WEBHOOK]", redacted)

    def test_redact_key_value_secrets(self):
        sample_log = f'Config payload: {{"aws_secret_access_key": "{MOCK_AWS_SECRET}", "password": "SuperSecretPassword!"}}'
        redacted = redact_text(sample_log)
        self.assertNotIn(MOCK_AWS_SECRET, redacted)
        self.assertNotIn("SuperSecretPassword!", redacted)

    def test_redact_nested_dictionaries_and_lists(self):
        sensitive_payload = {
            "user": "security_admin",
            "password": "ClearTextPassword123!",
            "credentials": {
                "aws_access_key": MOCK_AWS_KEY_ID,
                "secret_access_key": MOCK_AWS_SECRET,
                "tokens": ["jwt_1000_token_abc", MOCK_OPENAI_KEY]
            },
            "environment": ["production", "us-east-1"]
        }
        sanitized = redact_data(sensitive_payload)

        # Ensure passwords and secret keys are completely redacted
        self.assertEqual(sanitized["password"], "[REDACTED]")
        self.assertEqual(sanitized["credentials"]["secret_access_key"], "[REDACTED]")
        self.assertEqual(sanitized["credentials"]["aws_access_key"], "AKIA[REDACTED_KEY_ID]")
        self.assertEqual(sanitized["user"], "security_admin")
        self.assertNotIn("ClearTextPassword123!", str(sanitized))
        self.assertNotIn(MOCK_AWS_SECRET, str(sanitized))

    def test_mask_secret(self):
        self.assertEqual(mask_secret("mySecretPassword123"), "********")
        self.assertEqual(mask_secret(MOCK_AWS_KEY_ID, visible_prefix=4), "AKIA********")
        self.assertEqual(mask_secret(""), "")

    def test_logging_filter_redacts_live_logger_output(self):
        log_capture = io.StringIO()
        handler = logging.StreamHandler(log_capture)
        handler.addFilter(SensitiveDataFilter())
        handler.setFormatter(RedactingFormatter("%(levelname)s - %(message)s"))

        test_logger = logging.getLogger("test_redaction_logger")
        test_logger.setLevel(logging.INFO)
        test_logger.addHandler(handler)

        test_logger.info(f"Connecting with secret_access_key={MOCK_AWS_SECRET} and token jwt_9999_secret")

        log_output = log_capture.getvalue()
        self.assertNotIn(MOCK_AWS_SECRET, log_output)
        self.assertNotIn("jwt_9999_secret", log_output)
        self.assertIn("jwt_[REDACTED]", log_output)

    def test_settings_endpoint_masks_credentials(self):
        client = TestClient(app)

        # 1. Update settings with test credentials
        update_payload = {
            "aws": {
                "enabled": True,
                "account_id": "123456789012",
                "access_key_id": MOCK_AWS_KEY_ID,
                "secret_access_key": MOCK_AWS_SECRET,
                "region": "us-east-1"
            },
            "general": {
                "slack_webhook": MOCK_SLACK_HOOK
            }
        }
        res_post = client.post("/api/v1/settings", json=update_payload)
        self.assertEqual(res_post.status_code, 200)
        data = res_post.json()["data"]

        # Secret key should NEVER be returned in plaintext
        self.assertEqual(data["aws"]["secret_access_key"], "********")
        self.assertNotIn(MOCK_AWS_SECRET, res_post.text)

        # 2. Get settings should also be masked
        res_get = client.get("/api/v1/settings")
        self.assertEqual(res_get.status_code, 200)
        get_data = res_get.json()["data"]
        self.assertEqual(get_data["aws"]["secret_access_key"], "********")
        self.assertNotIn(MOCK_AWS_SECRET, res_get.text)

    def test_scan_and_verification_endpoints_security(self):
        client = TestClient(app)

        # Verify account
        verify_res = client.post("/api/v1/cloud/verify-account", json={"provider": "AWS", "account_id": "999888777666"})
        self.assertEqual(verify_res.status_code, 200)
        self.assertTrue(verify_res.json()["success"])

        # Start scan
        scan_res = client.post("/api/v1/scan/start", json={"provider": "AWS", "account_id": "999888777666"})
        self.assertEqual(scan_res.status_code, 200)
        self.assertTrue(scan_res.json()["success"])

if __name__ == "__main__":
    unittest.main()
