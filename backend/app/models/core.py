from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True, default="User")
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False) # 'user' or 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cloud_accounts = relationship("CloudAccount", back_populates="owner")

class CloudAccount(Base):
    __tablename__ = "cloud_accounts"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, nullable=False) # 'aws' or 'azure'
    name = Column(String, nullable=False)
    # AWS specific
    aws_access_key = Column(String, nullable=True)
    aws_secret_key = Column(String, nullable=True)
    aws_region = Column(String, nullable=True)
    # Azure specific
    azure_tenant_id = Column(String, nullable=True)
    azure_client_id = Column(String, nullable=True)
    azure_client_secret = Column(String, nullable=True)
    azure_subscription_id = Column(String, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="cloud_accounts")
    
    scans = relationship("Scan", back_populates="account")

class Scan(Base):
    __tablename__ = "scans"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("cloud_accounts.id"))
    status = Column(String, default="pending") # pending, in_progress, completed, failed
    score = Column(Float, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    account = relationship("CloudAccount", back_populates="scans")
    issues = relationship("Issue", back_populates="scan")

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    resource_id = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    issue_title = Column(String, nullable=False)
    severity = Column(String, nullable=False) # Low, Medium, High, Critical
    description = Column(Text, nullable=True)
    risk_explanation = Column(Text, nullable=True)
    remediation_steps = Column(Text, nullable=True)
    
    scan = relationship("Scan", back_populates="issues")
