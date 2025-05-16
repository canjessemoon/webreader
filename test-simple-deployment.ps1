# Simple test script for WebReader Railway deployment
Write-Host "Testing simplified WebReader deployment..." -ForegroundColor Cyan

# Check for required files
@('server.cjs', 'start.cjs') | ForEach-Object {
    if (Test-Path $_) {
        Write-Host "[OK] Found $_" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Missing $_" -ForegroundColor Red
    }
}

# Start the server
Write-Host "`nStarting server..." -ForegroundColor Cyan
$nodeProcess = Start-Process -FilePath "node" -ArgumentList "start.cjs" -PassThru -WindowStyle Hidden

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test health endpoints
Write-Host "`nTesting health endpoints:" -ForegroundColor Cyan
@('/health', '/healthz', '/_health') | ForEach-Object {
    try {
        $result = Invoke-WebRequest -Uri "http://localhost:3000$_" -ErrorAction Stop
        Write-Host "[OK] $_`: $($result.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] $_`: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test proxy endpoint
Write-Host "`nTesting proxy endpoint:" -ForegroundColor Cyan
try {
    $result = Invoke-WebRequest -Uri "http://localhost:3000/api/proxy?url=https://example.com" -ErrorAction Stop
    $success = $result.Content -match "<title>Example Domain</title>"
    if ($success) {
        Write-Host "[OK] Proxy endpoint working correctly" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Proxy returned unexpected content" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Proxy endpoint failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Stop the server
Write-Host "`nStopping server..." -ForegroundColor Yellow
if ($nodeProcess) {
    Stop-Process -Id $nodeProcess.Id -Force
    Write-Host "[OK] Server stopped" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Could not stop server" -ForegroundColor Red
}

Write-Host "`nTest completed. Simple deployment seems: " -NoNewline
if (Test-Path "server.cjs" -and Test-Path "start.cjs") {
    Write-Host "READY FOR DEPLOYMENT" -ForegroundColor Green
} else {
    Write-Host "NOT READY (Missing files)" -ForegroundColor Red
}
