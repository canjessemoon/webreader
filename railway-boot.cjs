// railway-boot.cjs - CommonJS version of the boot script for Railway
// This avoids permission issues with shell scripts and module type incompatibilities
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Log file path
const LOG_FILE = path.join(__dirname, 'railway-server.log');

// Print environment details
console.log('=== STARTING WEBREADER SERVER ===');
console.log(`Date: ${new Date().toISOString()}`);
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);

// List files in directory
try {
  const files = fs.readdirSync(__dirname);
  console.log('Files in directory:');
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} catch (err) {
  console.error('Error listing directory:', err.message);
}

// Set the correct port
const PORT = process.env.PORT || 3000;
console.log(`Using PORT: ${PORT}`);

// Function to append to log file
function appendLog(message) {
  try {
    fs.appendFileSync(LOG_FILE, `${message}\n`);
  } catch (error) {
    console.error('Error writing to log file:', error.message);
  }
}

// Log startup info
appendLog(`=== WEBREADER SERVER STARTING ===`);
appendLog(`Date: ${new Date().toISOString()}`);
appendLog(`Node version: ${process.version}`);
appendLog(`PORT: ${PORT}`);

// Determine which server file to use
let serverFile = 'server-railway.cjs';
if (!fs.existsSync(path.join(__dirname, serverFile))) {
  console.log('server-railway.cjs not found, trying server-railway.js');
  appendLog('server-railway.cjs not found, trying server-railway.js');
  serverFile = 'server-railway.js';
}
if (!fs.existsSync(path.join(__dirname, serverFile))) {
  console.log('server-railway.js not found, falling back to server.js');
  appendLog('server-railway.js not found, falling back to server.js');
  serverFile = 'server.js';
}

console.log(`Starting server using ${serverFile}...`);
appendLog(`Starting server using ${serverFile}...`);

// Health check function - tries multiple endpoints
function checkHealth() {
  return new Promise(async (resolve) => {
    // Try multiple health check endpoints
    const endpoints = ['/healthz', '/health', '/_health'];
    
    console.log(`Trying multiple health endpoints: ${endpoints.join(', ')}`);
    appendLog(`Trying multiple health endpoints: ${endpoints.join(', ')}`);
    
    for (const endpoint of endpoints) {
      try {
        const result = await checkEndpoint(endpoint);
        if (result) {
          console.log(`Health check passed on ${endpoint}`);
          appendLog(`Health check passed on ${endpoint}`);
          return resolve(true);
        }
      } catch (err) {
        console.log(`Health check failed on ${endpoint}: ${err.message}`);
        appendLog(`Health check failed on ${endpoint}: ${err.message}`);
      }
    }
    
    // If we got here, all checks failed
    console.log('All health checks failed');
    appendLog('All health checks failed');
    resolve(false);
  });
}

// Helper function to check a specific endpoint
function checkEndpoint(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`Health check on ${path} passed: ${data}`);
          appendLog(`Health check on ${path} passed: ${data}`);
          resolve(true);
        } else {
          console.log(`Health check on ${path} failed with status ${res.statusCode}: ${data}`);
          appendLog(`Health check on ${path} failed with status ${res.statusCode}: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`Health check on ${path} error: ${err.message}`);
      appendLog(`Health check on ${path} error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`Health check on ${path} timed out`);
      appendLog(`Health check on ${path} timed out`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Start the server
try {
  // Determine the correct Node.js execution arguments
  const nodeArgs = [];
  if (serverFile === 'server.js') {
    // For ESM modules, we need experimental flags
    nodeArgs.push('--experimental-modules');
    nodeArgs.push('--experimental-specifier-resolution=node');
  }

  const serverProcess = spawn('node', [...nodeArgs, serverFile], {
    env: { ...process.env, PORT },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(output);
    appendLog(output);
  });
  
  serverProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    console.error(output);
    appendLog(`ERROR: ${output}`);
  });
  
  // Handle server exit
  serverProcess.on('close', (code) => {
    const message = `Server process exited with code ${code}`;
    console.log(message);
    appendLog(message);
    process.exit(code || 1);
  });
  
  // Handle process signals
  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down server...');
    appendLog('Received SIGINT, shutting down server...');
    serverProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down server...');
    appendLog('Received SIGTERM, shutting down server...');
    serverProcess.kill('SIGTERM');
  });
  
  // Verify server health after startup
  setTimeout(async () => {
    console.log('Verifying server health...');
    appendLog('Verifying server health...');
    let healthy = false;
    
    // Try health check multiple times with increasing delays
    const maxAttempts = 10;  // Increased from 5 to 10
    for (let i = 0; i < maxAttempts; i++) {
      console.log(`Health check attempt ${i + 1}/${maxAttempts}...`);
      appendLog(`Health check attempt ${i + 1}/${maxAttempts}...`);
      healthy = await checkHealth();
      
      if (healthy) {
        console.log('Server is healthy and ready to serve requests');
        appendLog('Server is healthy and ready to serve requests');
        break;
      }
      
      // Wait between attempts with exponential backoff (3s, 6s, 9s...)
      const delayMs = 3000 * (i + 1);
      console.log(`Waiting ${delayMs/1000}s before next attempt...`);
      appendLog(`Waiting ${delayMs/1000}s before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    if (!healthy) {
      console.log('⚠️ WARNING: Server failed health check after multiple attempts');
      appendLog('⚠️ WARNING: Server failed health check after multiple attempts');
      console.log('The server may still start correctly. Railway will retry if needed.');
      appendLog('The server may still start correctly. Railway will retry if needed.');
      
      // Try one more health check with direct HTTP request on all interfaces to log response
      try {
        console.log('Attempting direct health check to 0.0.0.0...');
        http.get(`http://0.0.0.0:${PORT}/health`, (res) => {
          console.log(`Direct health check status: ${res.statusCode}`);
          appendLog(`Direct health check status: ${res.statusCode}`);
        }).on('error', (err) => {
          console.log(`Direct health check error: ${err.message}`);
          appendLog(`Direct health check error: ${err.message}`);
        });
      } catch (err) {
        console.log(`Error during direct health check: ${err.message}`);
        appendLog(`Error during direct health check: ${err.message}`);
      }
    }
  }, 5000);
} catch (error) {
  console.error('Failed to start server:', error.message);
  appendLog(`FATAL ERROR: ${error.message}`);
  process.exit(1);
}
