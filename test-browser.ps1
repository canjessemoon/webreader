# WebReader Browser Test Script
# This script runs various tests to ensure WebReader's frontend components work correctly

# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "🧪 WebReader Browser Testing Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Set up variables
$projectDir = $PSScriptRoot
$serverUrl = "http://localhost:3001"
$frontendUrl = "http://localhost:5173"
$testUrls = @(
    "https://en.wikipedia.org/wiki/Speech_synthesis",
    "https://example.com",
    "https://nodejs.org/en/about"
)

# Check project structure
Write-Host "🔍 Checking project structure..." -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "src/App.tsx",
    "src/components/ContentDisplay.tsx",
    "src/services/contentService.ts",
    "src/services/proxyService.ts",
    "src/components/StatusPage.tsx",
    "src/components/DeploymentHelper.tsx",
    "server/index.js",
    "server/deploymentHelper.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    $filePath = Join-Path -Path $projectDir -ChildPath $file
    if (Test-Path $filePath) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Missing file: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (!$allFilesExist) {
    Write-Host "❌ Some required files are missing. Please check your project structure." -ForegroundColor Red
    exit 1
}

# Check node_modules
if (!(Test-Path (Join-Path -Path $projectDir -ChildPath "node_modules"))) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "📦 Dependencies already installed." -ForegroundColor Green
}

# Function to check if a port is in use
function Test-PortInUse {
    param(
        [int]$Port
    )
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connections.Count -gt 0
}

# Start the server if not running
if (!(Test-PortInUse -Port 3001)) {
    Write-Host "🌐 Starting server..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "server/index.js" -NoNewWindow
    Start-Sleep -Seconds 3
    
    # Verify server is running
    try {
        $healthCheck = Invoke-WebRequest -Uri "$serverUrl/api/health" -UseBasicParsing -TimeoutSec 5
        if ($healthCheck.StatusCode -eq 200) {
            Write-Host "  ✅ Server is running and health endpoint responded." -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Server started but health endpoint returned status code $($healthCheck.StatusCode)." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Server may not be running properly. Health check failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "🌐 Server appears to be already running on port 3001." -ForegroundColor Green
}

# Start the development server if not running
if (!(Test-PortInUse -Port 5173)) {
    Write-Host "⚡ Starting development server..." -ForegroundColor Yellow
    $devServer = Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow -PassThru
    Start-Sleep -Seconds 5
} else {
    Write-Host "⚡ Development server appears to be already running on port 5173." -ForegroundColor Green
}

# Instruct user to test components
Write-Host "`n📋 Manual Browser Testing Checklist" -ForegroundColor Magenta
Write-Host "---------------------------" -ForegroundColor Magenta
Write-Host "1. Open the application at: $frontendUrl" -ForegroundColor White
Write-Host "2. Test the URL input with these sample URLs:" -ForegroundColor White
foreach ($url in $testUrls) {
    Write-Host "   - $url" -ForegroundColor Cyan
}

Write-Host "`n3. Verify these features work correctly:" -ForegroundColor White
$features = @(
    "Content extraction and display",
    "Text-to-speech playback",
    "Voice settings (rate, pitch, language)",
    "Appearance settings (font size, dark mode)",
    "Status page visibility toggle",
    "Deployment Assistant interface"
)

foreach ($feature in $features) {
    Write-Host "   [ ] $feature" -ForegroundColor Yellow
}

Write-Host "`n4. Test error handling with these scenarios:" -ForegroundColor White
$errorScenarios = @(
    "Empty URL",
    "Malformed URL (e.g., 'notaurl')",
    "Non-existent domain (e.g., 'https://this-domain-does-not-exist-123456789.com')",
    "Site that blocks scraping (try 'https://www.nytimes.com')"
)

foreach ($scenario in $errorScenarios) {
    Write-Host "   [ ] $scenario" -ForegroundColor Yellow
}

Write-Host "`n5. Test the 'Try Different Proxy' functionality:" -ForegroundColor White
Write-Host "   [ ] Click 'Try Different Proxy' on a failed content extraction" -ForegroundColor Yellow

Write-Host "`n🔍 Once testing is complete:" -ForegroundColor Magenta
Write-Host "1. Press Ctrl+C in the terminal window to stop the servers" -ForegroundColor White
Write-Host "2. Record any issues found in the project's issue tracker" -ForegroundColor White

Write-Host "`n✅ Test script completed! The application is now ready for manual testing." -ForegroundColor Green
