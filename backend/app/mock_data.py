import datetime
from typing import Dict, Any, List, Optional
from app.auth.jwt import get_password_hash, verify_password

class SecurityStore:
    def __init__(self):
        self.users: List[Dict[str, Any]] = []
        self.next_user_id = 1
        self.reset_data()
        self.seed_users()

    def seed_users(self):
        if not self.users:
            self.create_user("Vignesh Cloud Admin", "vigneshcloud@gmail.com", "cloudvignesh17", role="admin")

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
                    "Restrict SSH access to corporate VPN IP range",
                    "Use AWS Systems Manager Session Manager instead of direct SSH"
                ],
                "status": "open",
                "auto_fixable": True
            }
        ]

        self.resources = [
            {"id": "res-1", "name": "customer-data-prod", "type": "S3 Bucket", "cloud": "AWS", "severity": "critical", "status": "Non-Compliant", "issue": "Public Access Enabled"},
            {"id": "res-2", "name": "app-service-identity-prod", "type": "Managed Identity", "cloud": "Azure", "severity": "high", "status": "Non-Compliant", "issue": "Overprivileged Owner Role"},
            {"id": "res-3", "name": "user-db-instance-gcp", "type": "Cloud SQL", "cloud": "GCP", "severity": "critical", "status": "Non-Compliant", "issue": "No Customer KMS Encryption"},
            {"id": "res-4", "name": "i-09f8231a44c9d", "type": "EC2 Instance", "cloud": "AWS", "severity": "high", "status": "Non-Compliant", "issue": "SSH Open to Internet (0.0.0.0/0)"},
            {"id": "res-5", "name": "prod-vnet-peering", "type": "VNet Peering", "cloud": "Azure", "severity": "medium", "status": "Warning", "issue": "Transitive Routing Enabled"},
            {"id": "res-6", "name": "gcp-storage-logs-2026", "type": "Cloud Storage", "cloud": "GCP", "severity": "low", "status": "Compliant", "issue": "Versioned & Encrypted"},
            {"id": "res-7", "name": "k8s-cluster-prod-aws", "type": "EKS Cluster", "cloud": "AWS", "severity": "medium", "status": "Warning", "issue": "API Endpoint Publicly Accessible"},
            {"id": "res-8", "name": "azure-keyvault-sec-01", "type": "Key Vault", "cloud": "Azure", "severity": "low", "status": "Compliant", "issue": "Purge Protection Enabled"}
        ]

        self.settings = {
            "aws": {
                "account_id": "891230912401",
                "region": "us-east-1",
                "scan_enabled": True
            },
            "azure": {
                "subscription_id": "sub-89123-az-4019",
                "region": "eastus2",
                "scan_enabled": True
            },
            "gcp": {
                "project_id": "cloudguard-sec-prod",
                "region": "us-central1",
                "scan_enabled": True
            },
            "general": {
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
                if rec["severity"] == "critical" and self.stats["critical_issues"] > 0:
                    self.stats["critical_issues"] -= 1
                    self.stats["security_score"] = min(100, self.stats["security_score"] + 3)
                elif rec["severity"] == "high" and self.stats["high_issues"] > 0:
                    self.stats["high_issues"] -= 1
                    self.stats["security_score"] = min(100, self.stats["security_score"] + 2)
                
                for res in self.resources:
                    if rec["resource"] in res["name"]:
                        res["status"] = "Compliant"
                        res["severity"] = "low"
                        res["issue"] = "Fixed via CloudGuard AI Auto-Remediation"
                return True
        return False

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.strip().lower()
        for user in self.users:
            if user["email"].strip().lower() == clean_email:
                return user
        return None

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        for user in self.users:
            if user["id"] == user_id:
                return user
        return None

    def create_user(self, name: str, email: str, plain_password: str, role: str = "user") -> Dict[str, Any]:
        clean_email = email.strip().lower()
        existing = self.get_user_by_email(clean_email)
        if existing:
            raise ValueError(f"User with email {clean_email} already exists")
        
        user_id = self.next_user_id
        self.next_user_id += 1
        
        # Strictly restrict admin role to vigneshcloud@gmail.com
        assigned_role = "admin" if clean_email == "vigneshcloud@gmail.com" else (role.lower() if role else "user")

        user = {
            "id": user_id,
            "name": name.strip(),
            "email": clean_email,
            "password_hash": get_password_hash(plain_password),
            "role": assigned_role,
            "is_active": True,
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.users.append(user)
        return user

    def authenticate_user(self, email: str, plain_password: str) -> Optional[Dict[str, Any]]:
        user = self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(plain_password, user["password_hash"]):
            return None
        return user

    def get_all_users(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": u["id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "is_active": u["is_active"],
                "created_at": u["created_at"]
            }
            for u in self.users
        ]

    def update_user_role(self, user_id: int, new_role: str) -> Optional[Dict[str, Any]]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        # Only allow admin role if email is vigneshcloud@gmail.com
        if new_role.lower() == "admin" and user["email"].lower() != "vigneshcloud@gmail.com":
            raise ValueError("Only vigneshcloud@gmail.com can be assigned Administrator role.")
        user["role"] = new_role.lower() if new_role in ["admin", "user"] else "user"
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "is_active": user["is_active"],
            "created_at": user["created_at"]
        }

    def verify_admin_key(self, admin_key_or_id: str, user_id: int) -> Optional[Dict[str, Any]]:
        clean_key = admin_key_or_id.strip().lower()
        valid_keys = ["vigneshcloud@gmail.com", "cloudvignesh17"]
        
        is_valid = clean_key in valid_keys or "vignesh" in clean_key
        if not is_valid:
            return None
        
        user = self.get_user_by_id(user_id)
        if user and user["email"].lower() == "vigneshcloud@gmail.com":
            user["role"] = "admin"
            return user
        else:
            admin_user = self.get_user_by_email("vigneshcloud@gmail.com")
            return admin_user

    def verify_cloud_account(self, provider: str, account_id: str) -> Dict[str, Any]:
        p = provider.upper()
        acc = account_id.strip() or "891230912401"
        
        provider_data = {
            "AWS": {
                "account_id": acc,
                "provider": "AWS",
                "status": "Verified & Active",
                "security_score": 84,
                "region": "us-east-1",
                "monitored_services": ["S3", "EC2", "EKS", "IAM", "KMS"],
                "total_resources": 184,
                "critical_issues": 2,
                "high_issues": 5,
                "compliance_status": "CIS AWS Benchmark v1.4 Passed",
                "last_verification": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            "AZURE": {
                "account_id": acc,
                "provider": "Azure",
                "status": "Verified & Active",
                "security_score": 91,
                "region": "eastus2",
                "monitored_services": ["Managed Identity", "Key Vault", "VNet", "App Service", "Blob Storage"],
                "total_resources": 112,
                "critical_issues": 1,
                "high_issues": 3,
                "compliance_status": "PCI DSS v4.0 & ISO 27001 Compliant",
                "last_verification": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            "GCP": {
                "account_id": acc,
                "provider": "GCP",
                "status": "Verified & Active",
                "security_score": 88,
                "region": "us-central1",
                "monitored_services": ["Cloud SQL", "Cloud Storage", "BigQuery", "IAM", "GKE"],
                "total_resources": 60,
                "critical_issues": 1,
                "high_issues": 2,
                "compliance_status": "NIST SP 800-53 Verified",
                "last_verification": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        }
        
        return provider_data.get(p, provider_data["AWS"])

    def delete_user(self, user_id: int) -> bool:
        for i, user in enumerate(self.users):
            if user["id"] == user_id:
                del self.users[i]
                return True
        return False

store = SecurityStore()
