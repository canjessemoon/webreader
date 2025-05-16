# Simple test script for WebReader Railway deployment
Write-Host "Testing simplified WebReader deployment..." -ForegroundColor Cyan

# Check for required files
Write-Host "Checking required files..."
if (Test-Path "server.cjs") {
    Write-Host "[OK] Found server.cjs" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Missing server.cjs" -ForegroundColor Red
}

if (Test-Path "start.cjs") {
    Write-Host "[OK] Found start.cjs" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Missing start.cjs" -ForegroundColor Red
}

# Check Railway configuration
Write-Host "`nChecking railway.simple.json..."
if (Test-Path "railway.simple.json") {
    $railwayConfig = Get-Content "railway.simple.json" -Raw | ConvertFrom-Json
    Write-Host "[OK] Found railway.simple.json" -ForegroundColor Green
    Write-Host "  Start Command: $($railwayConfig.deploy.startCommand)"
    Write-Host "  Health Path: $($railwayConfig.deploy.healthcheckPath)"
} else {
    Write-Host "[ERROR] Missing railway.simple.json" -ForegroundColor Red
}

# No server starting to avoid antivirus concerns
Write-Host "`nSimplified deployment setup:" -ForegroundColor Cyan
Write-Host "1. Use server.cjs for a simple Express server" 
Write-Host "2. Use start.cjs for a simple startup script"
Write-Host "3. Use railway.simple.json for Railway configuration"

Write-Host "`nTo deploy:"
Write-Host "1. Copy railway.simple.json to railway.json"
Write-Host "2. Push to GitHub"
Write-Host "3. Connect to Railway and deploy"
