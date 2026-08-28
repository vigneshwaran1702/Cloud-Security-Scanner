Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting AI Cloud Security Scanner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n[1/2] Launching Backend Server on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; pip install -r requirements.txt; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "[2/2] Launching Frontend App on port 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm install; npm run dev"

Write-Host "`nApplications started!" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "Docs:     http://localhost:8000/docs`n" -ForegroundColor White
