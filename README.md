# AI Cloud Security Scanner

AI Cloud Security Scanner is a modern dashboard for analyzing and remediating cloud infrastructure security misconfigurations across AWS, Azure, and GCP.

## Backend Deployment

- **Production Backend Endpoint**: `https://cloud-security-scanner-x6rc.onrender.com`
- **API Documentation (Swagger)**: `https://cloud-security-scanner-x6rc.onrender.com/docs`

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Environment Configuration (`.env`):
   ```env
   VITE_API_BASE_URL=https://cloud-security-scanner-x6rc.onrender.com
   ```

3. Install dependencies & run development server:
   ```bash
   npm install
   npm run dev
   ```
