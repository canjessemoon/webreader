# WebReader Testing Script
Write-Host "🔍 Starting WebReader testing suite..." -ForegroundColor Cyan

# Environment check
Write-Host "`n📋 Checking environment..." -ForegroundColor Magenta
$nodeVersion = node -v
Write-Host "Node.js Version: $nodeVersion" 

$npmVersion = npm -v
Write-Host "npm Version: $npmVersion"

# Check build artifacts
Write-Host "`n📋 Verifying build artifacts..." -ForegroundColor Magenta
if (Test-Path "dist" -PathType Container) {
    $filesCount = (Get-ChildItem -Path "dist" -Recurse -File | Measure-Object).Count
    Write-Host "✅ Build directory found with $filesCount files" -ForegroundColor Green
} else {
    Write-Host "❌ Build directory missing. Run 'npm run build' first." -ForegroundColor Red
}

# Verify core project files
Write-Host "`n📋 Verifying core project files..." -ForegroundColor Magenta
$requiredFiles = @(
    "index.html",
    "package.json",
    "server.simple.cjs",
    "start.cjs",
    "railway.simple.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing $file" -ForegroundColor Red
    }
}

# Check server configuration
Write-Host "`n📋 Checking server configuration..." -ForegroundColor Magenta
if (Test-Path "server.simple.cjs") {
    $serverContent = Get-Content "server.simple.cjs" -Raw
    
    # Check for essential endpoints
    if ($serverContent -match "/health") {
        Write-Host "✅ Health endpoint configured" -ForegroundColor Green
    } else {
        Write-Host "❌ Health endpoint missing" -ForegroundColor Red
    }
    
    if ($serverContent -match "/api/proxy") {
        Write-Host "✅ Proxy endpoint configured" -ForegroundColor Green
    } else {
        Write-Host "❌ Proxy endpoint missing" -ForegroundColor Red
    }
    
    # Check for fallback proxies
    if ($serverContent -match "corsproxy.io" -and $serverContent -match "allorigins.win") {
        Write-Host "✅ Fallback proxies configured" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing fallback proxies" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Server file not found" -ForegroundColor Red
}

# Check package.json configurations
Write-Host "`n📋 Checking package.json configuration..." -ForegroundColor Magenta
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    if ($packageJson.scripts.build) {
        Write-Host "✅ Build script found: $($packageJson.scripts.build)" -ForegroundColor Green
    } else {
        Write-Host "❌ Build script missing" -ForegroundColor Red
    }
    
    if ($packageJson.scripts.start) {
        Write-Host "✅ Start script found: $($packageJson.scripts.start)" -ForegroundColor Green
    } else {
        Write-Host "❌ Start script missing" -ForegroundColor Red
    }
}

# Deployment check
Write-Host "`n📋 Checking deployment configuration..." -ForegroundColor Magenta
if (Test-Path "railway.simple.json") {
    $railwayConfig = Get-Content "railway.simple.json" -Raw | ConvertFrom-Json
    
    if ($railwayConfig.deploy.startCommand) {
        Write-Host "✅ Start command: $($railwayConfig.deploy.startCommand)" -ForegroundColor Green
    }
    
    if ($railwayConfig.deploy.healthcheckPath) {
        Write-Host "✅ Health check path: $($railwayConfig.deploy.healthcheckPath)" -ForegroundColor Green
    }
}

Write-Host "`n🔍 Testing completed!" -ForegroundColor Cyan
Write-Host "Next steps:"
Write-Host "1. Run 'npm run build' if you haven't already"
Write-Host "2. Copy railway.simple.json to railway.json"
Write-Host "3. Push to GitHub for deployment on Railway"
