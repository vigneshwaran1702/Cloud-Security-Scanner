import datetime
from typing import Dict, Any, List

class SecurityStore:
    def __init__(self):
        self.reset_data()

    def reset_data(self):
        self.scan_state = {
            "is_scanning": False,
            "progress": 100,
            "status": "idle",
            "last_scan": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "scanned_resources": 356,
            "scan_duration": "42s"
        }

        self.stats = {
            "security_score": 84,
            "score_change": "+4% since last scan",
            "total_resources": 356,
            "cloud_count": 3,
            "critical_issues": 5,
            "high_issues": 12,
            "medium_issues": 28,
            "low_issues": 45,
            "posture_trend": [
                {"name": "Mon", "score": 72},
                {"name": "Tue", "score": 75},
                {"name": "Wed", "score": 71},
                {"name": "Thu", "score": 78},
                {"name": "Fri", "score": 82},
                {"name": "Sat", "score": 84},
                {"name": "Sun", "score": 84}
            ]
        }

        self.compliance = [
            {"id": "cis", "name": "CIS Benchmarks", "score": 85, "passed": 142, "total": 167, "status": "Warning"},
            {"id": "pci", "name": "PCI DSS v4.0", "score": 91, "passed": 210, "total": 230, "status": "Passed"},
            {"id": "nist", "name": "NIST SP 800-53", "score": 88, "passed": 176, "total": 200, "status": "Passed"},
            {"id": "hipaa", "name": "HIPAA Security Rule", "score": 94, "passed": 94, "total": 100, "status": "Passed"}
        ]

        self.recommendations = [
            {
                "id": "rec-1",
                "title": "Public S3 Bucket Detected",
                "severity": "critical",
                "resource": "customer-data-prod",
                "cloud": "AWS",
                "risk_analysis": "The S3 Bucket customer-data-prod is publicly accessible. Anyone on the internet can read confidential customer files.",
                "impacts": ["Customer data leakage", "Financial penalties & Compliance violations"],
                "fixes": [
                    "Disable public access block at account level",
                    "Enable default KMS encryption",
                    "Restrict bucket policy to VPC only"
                ],
                "status": "open",
                "auto_fixable": True
            },
            {
                "id": "rec-2",
                "title": "Overprivileged Azure Managed Identity",
                "severity": "high",
                "resource": "app-service-identity-prod",
                "cloud": "Azure",
                "risk_analysis": "Managed Identity has Subscription Owner permissions which allows arbitrary resource modifications.",
                "impacts": ["Privilege escalation", "Unintended deletion of cloud infrastructure"],
                "fixes": [
                    "Demote to Contributor role on specific resource group",
                    "Apply principle of least privilege RBAC permissions"
                ],
                "status": "open",
                "auto_fixable": True
            },
            {
                "id": "rec-3",
                "title": "Unencrypted GCP Cloud SQL Database",
                "severity": "critical",
                "resource": "user-db-instance-gcp",
                "cloud": "GCP",
                "risk_analysis": "Cloud SQL database instance lacks Customer-Managed Encryption Key (CMEK) protection.",
                "impacts": ["Regulatory non-compliance", "Data compromise if storage disks are exposed"],
                "fixes": [
                    "Enable Cloud KMS CMEK encryption on instance",
                    "Enforce SSL connection requirement"
                ],
                "status": "open",
                "auto_fixable": True
            },
            {
                "id": "rec-4",
                "title": "Open SSH Port (0.0.0.0/0) on EC2 Instance",
                "severity": "high",
                "resource": "i-09f8231a44c9d",
                "cloud": "AWS",
                "risk_analysis": "Security group sg-0198a allows inbound traffic on TCP port 22 from any IPv4 address.",
                "impacts": ["Brute-force SSH attacks", "Unauthorized remote command execution"],
                "fixes": [
                    "Update security group rule to restrict port 22 to VPN CIDR",
                    "Enable AWS Systems Manager Session Manager"
                ],
                "status": "open",
                "auto_fixable": True
            }
        ]

        self.resources = [
            {"id": "res-101", "name": "customer-data-prod", "type": "S3 Bucket", "cloud": "AWS", "region": "us-east-1", "severity": "critical", "status": "Non-compliant", "issue": "Public Read Access Enabled"},
            {"id": "res-102", "name": "app-service-identity-prod", "type": "Managed Identity", "cloud": "Azure", "region": "eastus2", "severity": "high", "status": "Non-compliant", "issue": "Subscription Owner Role Assigned"},
            {"id": "res-103", "name": "user-db-instance-gcp", "type": "Cloud SQL", "cloud": "GCP", "region": "us-central1", "severity": "critical", "status": "Non-compliant", "issue": "Default Encryption Key Used"},
            {"id": "res-104", "name": "i-09f8231a44c9d", "type": "EC2 Instance", "cloud": "AWS", "region": "us-west-2", "severity": "high", "status": "Non-compliant", "issue": "SSH Port open to 0.0.0.0/0"},
            {"id": "res-105", "name": "payment-vault-kv", "type": "Key Vault", "cloud": "Azure", "region": "westeurope", "severity": "medium", "status": "Compliant", "issue": "Purge Protection Enabled"},
            {"id": "res-106", "name": "prod-k8s-cluster", "type": "EKS Cluster", "cloud": "AWS", "region": "us-east-1", "severity": "low", "status": "Compliant", "issue": "Private Endpoint Active"},
            {"id": "res-107", "name": "analytics-bq-dataset", "type": "BigQuery", "cloud": "GCP", "region": "us-multiregion", "severity": "medium", "status": "Non-compliant", "issue": "IAM External Sharing Enabled"},
            {"id": "res-108", "name": "logs-archive-storage", "type": "Blob Container", "cloud": "Azure", "region": "eastus", "severity": "low", "status": "Compliant", "issue": "TLS 1.2 Enforced"}
        ]

        self.settings = {
            "aws": {
                "enabled": True,
                "access_key_id": "AKIA************",
                "secret_access_key": "********************************",
                "region": "us-east-1"
            },
            "azure": {
                "enabled": True,
                "tenant_id": "72f988bf-86f1-41af-91ab-2d7cd011db47",
                "client_id": "3b290918-a402-4a02-a16f-998811aabbcc",
                "subscription_id": "00000000-0000-0000-0000-000000000000"
            },
            "gcp": {
                "enabled": True,
                "project_id": "cloud-sec-scanner-prod",
                "service_account_email": "scanner-sa@cloud-sec-scanner-prod.iam.gserviceaccount.com"
            },
            "general": {
                "auto_remediation": False,
                "scan_frequency": "Every 6 Hours",
                "min_severity": "Medium",
                "email_notifications": True,
                "slack_webhook": "https://hooks.slack.com/services/T00/B00/XXXXX"
            }
        }

    def start_scan(self):
        self.scan_state["is_scanning"] = True
        self.scan_state["status"] = "scanning"
        self.scan_state["progress"] = 15
        self.scan_state["last_scan"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def finish_scan(self):
        self.scan_state["is_scanning"] = False
        self.scan_state["status"] = "idle"
        self.scan_state["progress"] = 100
        self.scan_state["scanned_resources"] += 4

    def apply_recommendation_fix(self, rec_id: str) -> bool:
        for rec in self.recommendations:
            if rec["id"] == rec_id:
                rec["status"] = "resolved"
                # Improve stats
                if rec["severity"] == "critical" and self.stats["critical_issues"] > 0:
                    self.stats["critical_issues"] -= 1
                    self.stats["security_score"] = min(100, self.stats["security_score"] + 3)
                elif rec["severity"] == "high" and self.stats["high_issues"] > 0:
                    self.stats["high_issues"] -= 1
                    self.stats["security_score"] = min(100, self.stats["security_score"] + 2)
                
                # Update resource status
                for res in self.resources:
                    if rec["resource"] in res["name"]:
                        res["status"] = "Compliant"
                        res["severity"] = "low"
                        res["issue"] = "Fixed via CloudGuard AI Auto-Remediation"
                return True
        return False

store = SecurityStore()
