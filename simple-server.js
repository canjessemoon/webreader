// A simple HTTP server for WebReader
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import axios from 'axios';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle API proxy request
  if (req.url?.startsWith('/api/proxy')) {
    return handleProxyRequest(req, res);
  }
  
  // Extract URL path (remove query parameters)
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;
  
  // Adjust pathname for serving static files
  if (pathname === '/' || pathname === '/index.html') {
    pathname = '/index.html';
  }
  
  // Map the pathname to an absolute file path
  const filepath = path.join(__dirname, 'dist', pathname);
  
  try {
    // Check if file exists
    const fileStats = await fs.promises.stat(filepath).catch(() => null);
    
    if (fileStats && fileStats.isFile()) {
      // File exists, serve it
      const ext = path.extname(filepath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      const content = await fs.promises.readFile(filepath);
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      return;
    }
    
    // If requesting a directory without trailing slash, serve index.html
    if (pathname !== '/index.html') {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = await fs.promises.readFile(indexPath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
        return;
      }
    }
    
    // File not found
    res.writeHead(404);
    res.end('404 Not Found');
  } catch (error) {
    console.error(`Error serving ${filepath}:`, error);
    res.writeHead(500);
    res.end('Server Error');
  }
});

// Handle proxy requests to external URLs
async function handleProxyRequest(req, res) {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host}`);
  const targetUrl = parsedUrl.searchParams.get('url');
  
  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'URL parameter is required' }));
    return;
  }
  
  try {
    console.log(`Fetching content from: ${targetUrl}`);
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      responseType: 'text'
    });
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(response.data);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Failed to fetch URL', 
      message: error.message 
    }));
  }
}

// Start the server
server.listen(PORT, () => {
  console.log(`WebReader server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});
