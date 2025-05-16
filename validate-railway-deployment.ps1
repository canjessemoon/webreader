# Railway Deployment Validation Script
# This script checks if all components required for Railway deployment are correctly set up
# It validates configuration files, server setup, and health endpoints

Write-Host "Railway Deployment Validation" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Function to check if a file exists
function Test-FileExists {
    param (
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        Write-Host "[PASS] $Description found: $FilePath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[FAIL] $Description not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Function to check JSON file content
function Test-JsonContent {
    param (
        [string]$FilePath,
        [string]$PropertyPath,
        [string]$ExpectedValue,
        [string]$Description
    )
      try {
        $json = Get-Content $FilePath -Raw | ConvertFrom-Json
        $value = Invoke-Expression "`$json.$PropertyPath"
        
        if ($value -eq $ExpectedValue) {
            Write-Host "[PASS] $Description is correctly set to '$ExpectedValue'" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[FAIL] $Description is set to '$value', expected '$ExpectedValue'" -ForegroundColor Red
            return $false
        }
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "[ERROR] Checking $Description in $FilePath - $errorMsg" -ForegroundColor Red
        return $false
    }
}

# Function to check if a string exists in a file
function Test-StringInFile {
    param (
        [string]$FilePath,
        [string]$SearchString,
        [string]$Description
    )
      try {
        $content = Get-Content $FilePath -Raw
        if ($content -match [regex]::Escape($SearchString)) {
            Write-Host "[PASS] $Description found in $FilePath" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[FAIL] $Description not found in $FilePath" -ForegroundColor Red
            return $false
        }
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "[ERROR] Checking for $Description in $FilePath - $errorMsg" -ForegroundColor Red
        return $false
    }
}

# Check for required files
$requiredFiles = @{
    "railway.json" = "Railway configuration file"
    "railway-boot.cjs" = "Railway boot script (CommonJS)"
    "server-railway.js" = "Railway server file"
    "package.json" = "Package configuration file"
}

$filesExist = $true
foreach ($file in $requiredFiles.Keys) {
    $filesExist = $filesExist -and (Test-FileExists -FilePath ".\$file" -Description $requiredFiles[$file])
}

# Check railway.json configuration
Write-Host "`nChecking Railway configuration..." -ForegroundColor Cyan
$railwayJsonValid = $true
$railwayJsonValid = $railwayJsonValid -and (Test-JsonContent -FilePath ".\railway.json" -PropertyPath "deploy.startCommand" -ExpectedValue "node railway-boot.cjs" -Description "Railway start command")
$railwayJsonValid = $railwayJsonValid -and (Test-JsonContent -FilePath ".\railway.json" -PropertyPath "deploy.healthcheckPath" -ExpectedValue "/healthz" -Description "Railway healthcheck path")

# Check server-railway.js for health endpoints
Write-Host "`nChecking server health endpoints..." -ForegroundColor Cyan
$serverHealthEndpoints = $true
$serverHealthEndpoints = $serverHealthEndpoints -and (Test-StringInFile -FilePath ".\server-railway.js" -SearchString "/healthz" -Description "Kubernetes health endpoint")
$serverHealthEndpoints = $serverHealthEndpoints -and (Test-StringInFile -FilePath ".\server-railway.js" -SearchString "/_health" -Description "Railway default health endpoint")
$serverHealthEndpoints = $serverHealthEndpoints -and (Test-StringInFile -FilePath ".\server-railway.js" -SearchString "/health" -Description "Standard health endpoint")

# Check server binding
Write-Host "`nChecking server configuration..." -ForegroundColor Cyan
$serverConfig = $true
$serverConfig = $serverConfig -and (Test-StringInFile -FilePath ".\server-railway.js" -SearchString "app.listen(PORT" -Description "Server binding to PORT")
$serverConfig = $serverConfig -and (Test-StringInFile -FilePath ".\server-railway.js" -SearchString "0.0.0.0" -Description "Server binding to all interfaces")

# Check boot script
Write-Host "`nChecking boot script..." -ForegroundColor Cyan
$bootScriptValid = $true
$bootScriptValid = $bootScriptValid -and (Test-StringInFile -FilePath ".\railway-boot.cjs" -SearchString "function checkHealth" -Description "Health check function")
$bootScriptValid = $bootScriptValid -and (Test-StringInFile -FilePath ".\railway-boot.cjs" -SearchString "spawn" -Description "Server process spawning")

# Check package.json scripts
Write-Host "`nChecking package.json scripts..." -ForegroundColor Cyan
$packageJsonValid = $true
$packageJsonValid = $packageJsonValid -and (Test-StringInFile -FilePath ".\package.json" -SearchString "build" -Description "Build script")
$packageJsonValid = $packageJsonValid -and (Test-StringInFile -FilePath ".\package.json" -SearchString "start:railway" -Description "Railway start script")

# Summary
Write-Host "`nValidation Summary:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

function Write-ValidationResult {
    param (
        [bool]$Result,
        [string]$Category
    )
    
    if ($Result) {
        Write-Host "[PASS] $Category - Passed" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $Category - Failed" -ForegroundColor Red
    }
}

Write-ValidationResult -Result $filesExist -Category "Required Files"
Write-ValidationResult -Result $railwayJsonValid -Category "Railway Configuration"
Write-ValidationResult -Result $serverHealthEndpoints -Category "Health Endpoints"
Write-ValidationResult -Result $serverConfig -Category "Server Configuration" 
Write-ValidationResult -Result $bootScriptValid -Category "Boot Script"
Write-ValidationResult -Result $packageJsonValid -Category "Package Configuration"

$overallResult = $filesExist -and $railwayJsonValid -and $serverHealthEndpoints -and $serverConfig -and $bootScriptValid -and $packageJsonValid

if ($overallResult) {
    Write-Host "`n[SUCCESS] Your Railway deployment configuration looks VALID!" -ForegroundColor Green
    Write-Host "Run ./test-railway-local.ps1 to test the deployment locally." -ForegroundColor Yellow
} else {
    Write-Host "`n[ERROR] Your Railway deployment configuration has issues that need to be fixed." -ForegroundColor Red
    Write-Host "Please address the errors listed above before deploying." -ForegroundColor Yellow
}
