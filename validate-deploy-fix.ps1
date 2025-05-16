# PowerShell script to validate the Railway deployment fix
# This script checks if the server can start properly and pass health checks

Write-Host "Validating Railway deployment fix..." -ForegroundColor Cyan

# Set environment variables
$env:PORT = 3002
$env:RAILWAY_ENVIRONMENT = "production"

# Function to check health endpoint
function Test-HealthEndpoint {
    param (
        [string]$Path
    )
    
    try {
        $url = "http://localhost:$env:PORT$Path"
        Write-Host "Testing health endpoint: $url" -ForegroundColor Yellow
        
        # Try to connect to the endpoint
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        
        # Check if the response is OK (200)
        if ($response.StatusCode -eq 200) {
            Write-Host "Health check SUCCESS! Status: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "Response: $($response.Content)" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "Health check FAILED! Status: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Health check ERROR: $_" -ForegroundColor Red
        return $false
    }
}

# Clean up any existing node processes on this port (helpful for testing)
$existingProcess = Get-NetTCPConnection -LocalPort $env:PORT -ErrorAction SilentlyContinue | 
                   Where-Object State -eq Listen | 
                   Select-Object -ExpandProperty OwningProcess
                   
if ($existingProcess) {
    Write-Host "Stopping existing process on port $env:PORT..." -ForegroundColor Yellow
    Stop-Process -Id $existingProcess -Force -ErrorAction SilentlyContinue
}

# Start the JavaScript boot script in the background
Write-Host "Starting railway-boot.js in the background..." -ForegroundColor Cyan
Start-Process node -ArgumentList "railway-boot.js" -NoNewWindow

# Wait for the server to start (5 seconds)
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check each health endpoint
$endpoints = @("/healthz", "/_health", "/health")
$success = $false

foreach ($endpoint in $endpoints) {
    if (Test-HealthEndpoint -Path $endpoint) {
        $success = $true
        break
    }
    
    # Wait a bit between checks
    Start-Sleep -Seconds 2
}

# Try the root path as a last resort
if (-not $success) {
    Write-Host "Trying root path as a last resort..." -ForegroundColor Yellow
    $success = Test-HealthEndpoint -Path "/"
}

# Display final result
if ($success) {
    Write-Host "`nVALIDATION SUCCESSFUL!" -ForegroundColor Green
    Write-Host "The railway-boot.js script works correctly and health checks are passing." -ForegroundColor Green
} else {
    Write-Host "`nVALIDATION FAILED!" -ForegroundColor Red
    Write-Host "The health checks are still not passing. Check server logs for more details." -ForegroundColor Red
}

# Clean up the node process
$nodeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
              Where-Object { $_.CommandLine -like "*railway-boot.js*" }
              
if ($nodeProcess) {
    Write-Host "`nStopping server process..." -ForegroundColor Yellow
    Stop-Process -Id $nodeProcess.Id -Force
}

Write-Host "`nValidation complete." -ForegroundColor Cyan
