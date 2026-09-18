# 🛡️ AI Cloud Security Scanner

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E.svg?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An intelligent, next-generation Cloud Security Posture Management (CSPM) and automated vulnerability assessment platform. **AI Cloud Security Scanner** audits multi-cloud environments (AWS, Azure, GCP), identifies misconfigurations and security risks, and leverages AI for automated remediation recommendations and compliance enforcement.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (Windows)](#quick-start-windows)
  - [Manual Setup](#manual-setup)
  - [Docker Compose](#running-with-docker-compose)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [API Documentation](#-api-documentation)
- [Compliance Standards](#-compliance-standards)
- [License](#-license)

---

## ✨ Key Features

- **🌐 Multi-Cloud Security Auditing**: Real-time inspection across Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).
- **🤖 AI-Driven Remediation**: Uses OpenAI to generate intelligent, context-aware remediation scripts and one-click auto-fixes for misconfigured cloud resources.
- **📊 Interactive Security Dashboard**:
  - Live Security Score & dynamic posture trend analytics powered by Recharts.
  - Severity breakdown (Critical, High, Medium, Low) with drill-down views.
  - Active scan progress monitoring with live status feedback.
- **🔍 Multi-Cloud Resource Explorer**:
  - Filter by cloud provider, severity level, and instant keyword search.
  - Detailed findings metadata, affected resource identifiers, and mitigation steps.
- **📑 Compliance Auditing**: Built-in benchmark compliance checks (CIS Benchmarks, SOC 2, HIPAA, NIST, PCI-DSS, GDPR).
- **📥 Security Finding Ingestion**: Import and upload custom scan results (JSON/CSV) with path traversal validation.
- **🔐 Hybrid Authentication & RBAC**:
  - Supabase Auth integration with local JWT token fallback.
  - Google OAuth single sign-on support.
  - Role-Based Access Control (Admin and standard User roles).
- **🌍 3D Particle Earth UI**: Interactive opening portal screen and ambient background particle animation.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    User([User Browser]) -->|HTTPS / Port 3000| Frontend[React 18 + Vite Frontend]
    Frontend -->|REST API Requests / Port 8000| Backend[FastAPI Backend Server]
    
    subgraph Frontend Services
        FE_Auth[Supabase Client & Auth Context]
        FE_Theme[Theme & 3D Earth Engine]
        FE_Dashboard[Dashboard & Analytics View]
    end

    subgraph Backend Core
        API[API Router /api/v1]
        AuthService[Supabase Auth / JWT Fallback]
        Scanner[Cloud Scanning Engine]
        AI_Engine[OpenAI Remediation Engine]
        Store[Security Store & In-Memory / DB State]
    end

    subgraph Cloud Providers & External Services
        AWS[(AWS APIs - boto3)]
        Azure[(Azure Management SDKs)]
        GCP[(GCP Cloud Resources)]
        OpenAI[(OpenAI API)]
        Supabase[(Supabase Auth & PostgreSQL)]
    end

    Backend --> API
    API --> AuthService --> Supabase
    API --> Scanner
    Scanner --> AWS
    Scanner --> Azure
    Scanner --> GCP
    API --> AI_Engine --> OpenAI
    API --> Store
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM (v7)
- **Charts & Visualization**: Recharts, Canvas 2D/3D Particle Globe
- **Icons**: Lucide React
- **Auth Client**: Supabase JS SDK (`@supabase/supabase-js`, `@supabase/ssr`)
- **Styling**: Vanilla CSS design system with Dark/Light theme switching

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn (ASGI)
- **Database & ORM**: SQLAlchemy 2.0, PostgreSQL (`psycopg2-binary`)
- **Authentication**: Supabase Auth REST, PyJWT, Cryptography, Bcrypt
- **Cloud SDKs**: Boto3 (AWS), Azure Management SDKs (`azure-mgmt-compute`, `azure-mgmt-network`, `azure-mgmt-storage`, `azure-mgmt-resource`, `azure-identity`)
- **AI Integration**: OpenAI Python Client
- **Data Validation**: Pydantic v2 & Pydantic-Settings

### DevOps & Infrastructure
- **Containers**: Docker & Docker Compose
- **PaaS Deployment**: Render (`render.yaml`)
- **IaC**: Terraform configuration templates

---

## 📁 Repository Structure

```plaintext
AI-Cloud-Security-Scanner/
├── backend/
│   ├── app/
│   │   ├── ai/                 # AI prompt generation and LLM analysis
│   │   ├── api/                # FastAPI routes and endpoint handlers
│   │   ├── auth/               # Supabase and JWT authentication logic
│   │   ├── cloud/              # AWS and Azure inspection modules
│   │   ├── compliance/         # Benchmark definitions (CIS, SOC2, etc.)
│   │   ├── database/           # DB session and connection configuration
│   │   ├── models/             # SQLAlchemy ORM database models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Scan ingestion and data processors
│   │   ├── config.py           # Application settings and environment parser
│   │   ├── main.py             # FastAPI entrypoint and middleware setup
│   │   └── mock_data.py        # Demo security posture data and scan store
│   ├── Dockerfile              # Backend container definition
│   ├── requirements.txt        # Python package dependencies
│   └── .env                    # Backend environment configuration
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components and visualizers
│   │   ├── context/            # Auth, Theme, EarthPortal, and Notification contexts
│   │   ├── layouts/            # Navigation bar and page layouts
│   │   ├── pages/              # Dashboard, Resources, Settings, Auth, Admin
│   │   ├── services/           # Axios / Fetch API wrappers
│   │   ├── App.jsx             # Route definitions and application shell
│   │   ├── index.css           # Global design system and animations
│   │   └── main.jsx            # React root DOM hydration
│   ├── Dockerfile              # Frontend container definition
│   └── package.json            # Node.js dependencies and scripts
├── terraform/                  # Infrastructure as Code templates
├── docker-compose.yml          # Multi-container orchestration (DB, API, Frontend)
├── render.yaml                 # Render cloud deployment blueprint
├── run.ps1                     # PowerShell one-click development launcher
├── start-all.bat               # Windows batch one-click development launcher
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher & `npm`
- **Python**: `3.10` or higher & `pip`
- **Git**
- *(Optional)* **Docker Desktop** for containerized execution

---

### Quick Start (Windows)

Launch both Frontend and Backend concurrently with one click:

**Option 1: Using Batch Script**
```cmd
start-all.bat
```

**Option 2: Using PowerShell Script**
```powershell
.\run.ps1
```

Both services will start in independent terminals:
- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Manual Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/vigneshwaran1702/Cloud-Security-Scanner.git
cd Cloud-Security-Scanner
```

#### 2. Backend Setup

```bash
cd backend

# Create and activate a Python virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be accessible at: `http://localhost:8000`

#### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Frontend will be accessible at: `http://localhost:3000`

---

### Running with Docker Compose

Run the complete stack including PostgreSQL database:

```bash
docker-compose up --build
```

To stop containers:
```bash
docker-compose down
```

---

## ⚙️ Configuration & Environment Variables

### Backend (`backend/.env`)

```ini
# Security & JWT
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cloudsec

# Supabase Auth Integration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-publishable-key

# OpenAI Integration (Optional for AI Remediation)
OPENAI_API_KEY=your-openai-api-key

# Cloud Provider Credentials (Optional)
AWS_ACCESS_KEY_ID=your-aws-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1
```

### Frontend (`frontend/.env`)

```ini
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

---

## 📡 API Documentation

FastAPI provides automated interactive API documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check and Supabase connectivity status |
| `POST` | `/api/v1/auth/login` | User login (Supabase or local JWT fallback) |
| `POST` | `/api/v1/auth/register` | New user account registration |
| `POST` | `/api/v1/auth/google` | Google SSO authentication |
| `GET` | `/api/v1/auth/me` | Current authenticated user profile |
| `GET` | `/api/v1/dashboard/stats` | Security score, issue counts, and posture trend |
| `POST` | `/api/v1/scan/start` | Trigger a cloud scan across AWS/Azure/GCP |
| `GET` | `/api/v1/scan/status` | Real-time scan progress and status |
| `POST` | `/api/v1/scan/upload-results` | Ingest external vulnerability scan files |
| `GET` | `/api/v1/resources` | Query discovered resources by cloud, severity, or search |
| `GET` | `/api/v1/recommendations` | List AI-driven remediation recommendations |
| `POST` | `/api/v1/recommendations/{id}/apply` | Apply auto-remediation for a specific finding |
| `POST` | `/api/v1/recommendations/clear-all` | Resolve and dismiss all open risks |
| `GET` | `/api/v1/compliance` | Benchmark compliance audit reports |
| `GET` | `/api/v1/settings` | Retrieve active cloud integration configurations |
| `POST` | `/api/v1/settings` | Update cloud provider API credentials and options |

---

## 📜 Compliance Standards

The scanner verifies infrastructure configurations against recognized security frameworks:
- **CIS Benchmarks** (AWS Foundations, Azure Foundations)
- **NIST SP 800-53**
- **SOC 2 Type II** (Trust Services Criteria)
- **PCI-DSS v4.0**
- **HIPAA Security Rule**
- **ISO/IEC 27001**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
