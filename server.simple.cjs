// Simple Express server for WebReader - combines all essential functionality
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || 
                      process.env.RAILWAY_ENVIRONMENT === 'production';

// CORS setup
app.use(cors({
  origin: IS_PRODUCTION ? '*' : true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Basic logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Multiple health endpoints for compatibility
app.get(['/health', '/healthz', '/_health'], (req, res) => {
  console.log(`[HEALTH] Health check requested at ${req.path}`);
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// CORS proxy with multiple fallback options
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  // List of public CORS proxies to try in order
  const PROXY_URLS = [
    '', // Direct request first
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/'
  ];

  console.log(`[PROXY] Fetching content from: ${url}`);
  
  // Try each proxy in sequence
  let lastError = null;
  for (const proxy of PROXY_URLS) {
    try {
      const proxyUrl = proxy + url;
      console.log(`[PROXY] Trying with ${proxy || 'direct request'}`);
      
      const response = await axios.get(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.google.com/',
          'DNT': '1'
        },
        responseType: 'text',
        timeout: 10000
      });
      
      console.log(`[PROXY] Successfully fetched content (${response.data.length} bytes)`);
      return res.status(200).send(response.data);
      
    } catch (error) {
      console.log(`[PROXY] Error with ${proxy || 'direct request'}: ${error.message}`);
      lastError = error;
    }
  }
  
  // If all proxies failed
  console.error(`[PROXY] All proxies failed for URL: ${url}`);
  res.status(500).json({ 
    error: 'Failed to fetch content from the URL using all available proxies',
    message: lastError ? lastError.message : 'Unknown error'
  });
});

// Serve the main app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] WebReader running on port ${PORT} (Env: ${IS_PRODUCTION ? 'Production' : 'Development'})`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});
