// Simple Railway startup script for WebReader
// This handles both ESM and CommonJS environments
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Set port from environment or default to 3000
const PORT = process.env.PORT || 3000;
console.log(`Starting WebReader on port: ${PORT}`);

// Check for server-railway.js first, then fall back to server.js
const serverFile = fs.existsSync('./server-railway.js') ? 'server-railway.js' : 'server.js';
console.log(`Using server file: ${serverFile}`);

// Start the server
console.log(`Starting server at ${new Date().toISOString()}`);
const serverProcess = spawn('node', [serverFile], {
  env: { ...process.env, PORT },
  stdio: 'inherit' // Direct output to parent process
});

// Handle exit
serverProcess.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code || 0);
});

// Handle signals
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...');
  serverProcess.kill();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  serverProcess.kill();
});
