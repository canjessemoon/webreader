# PowerShell script to test Railway deployment locally
# This script simulates the Railway environment on Windows

Write-Host "Testing Railway deployment locally..." -ForegroundColor Cyan

# Set environment variables
$env:PORT = 3001
$env:RAILWAY_ENVIRONMENT = "production"

# Display environment information
Write-Host "Using PORT: $env:PORT" -ForegroundColor Yellow
Write-Host "Node version: $(node -v)" -ForegroundColor Yellow
Write-Host "NPM version: $(npm -v)" -ForegroundColor Yellow

# Check for build flag (skip with -NoBuild)
$buildProject = $true
foreach ($arg in $args) {
    if ($arg -eq "-NoBuild") {
        $buildProject = $false
        Write-Host "Skipping build step..." -ForegroundColor Yellow
    }
}

if ($buildProject) {
    # Build the project
    Write-Host "Building the project..." -ForegroundColor Cyan
    npm run build

    # Check if build was successful
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Check if all required files exist
Write-Host "Checking for required files..." -ForegroundColor Cyan

$requiredFiles = @(
    ".\railway-boot.cjs",
    ".\server-railway.js",
    ".\dist\index.html"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "Missing required file: $file" -ForegroundColor Red
        $allFilesExist = $false
    } else {
        Write-Host "[FOUND] $file" -ForegroundColor Green
    }
}

if (-not $allFilesExist) {
    Write-Host "Some required files are missing. Please check the errors above." -ForegroundColor Red
    exit 1
}

# Try to use the railway-boot.cjs script (recommended)
Write-Host "Starting server using railway-boot.cjs..." -ForegroundColor Green
node railway-boot.cjs

# If we get here, the server was terminated
Write-Host "Server process terminated." -ForegroundColor Yellow
