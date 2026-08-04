$base = "AI-Cloud-Security-Scanner"
$dirs = @(
    "$base/backend/app/api",
    "$base/backend/app/auth",
    "$base/backend/app/cloud/aws",
    "$base/backend/app/cloud/azure",
    "$base/backend/app/ai",
    "$base/backend/app/compliance",
    "$base/backend/app/reports",
    "$base/backend/app/models",
    "$base/backend/app/database",
    "$base/backend/app/schemas",
    "$base/backend/app/services",
    "$base/backend/app/middleware",
    "$base/backend/app/utils",
    "$base/frontend/src/pages",
    "$base/frontend/src/components",
    "$base/frontend/src/layouts",
    "$base/frontend/src/services",
    "$base/frontend/src/hooks",
    "$base/frontend/src/assets",
    "$base/terraform",
    "$base/docs",
    "$base/tests",
    "$base/screenshots"
)
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$files = @(
    "$base/backend/app/config.py",
    "$base/backend/app/main.py",
    "$base/backend/requirements.txt",
    "$base/backend/Dockerfile",
    "$base/backend/.env",
    "$base/frontend/src/App.jsx",
    "$base/frontend/package.json",
    "$base/frontend/Dockerfile",
    "$base/docker-compose.yml",
    "$base/README.md"
)
foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}
