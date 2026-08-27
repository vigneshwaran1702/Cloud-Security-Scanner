@echo off
echo Starting AI Cloud Security Scanner...
echo.

echo Starting Backend API Server (Port 8000)...
start "CloudGuard Backend" cmd /k "cd /d "%~dp0backend" && pip install -r requirements.txt && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend Web App (Port 3000)...
start "CloudGuard Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"

echo.
echo Both services are starting in separate windows!
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo.
