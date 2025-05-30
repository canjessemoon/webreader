import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production';

// Enable CORS with more permissive settings for Railway production environment
app.use(cors({
  origin: IS_PRODUCTION ? '*' : true, // Allow all origins in production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Add basic request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for content extraction
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    console.log(`[PROXY] Fetching content from: ${url}`);
    console.log(`[PROXY] Environment: ${IS_PRODUCTION ? 'Production' : 'Development'}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'DNT': '1'
      },
      responseType: 'text',
      timeout: 10000 // 10 second timeout
    });
    
    console.log(`[PROXY] Response received: ${response.status} ${response.statusText}`);
    console.log(`[PROXY] Content type: ${response.headers['content-type']}`);
    
    res.set('Content-Type', 'text/html');
    res.send(response.data);  } catch (error) {
    console.error('[PROXY] Error fetching URL:', error.message);
    
    // More detailed error logging to help with debugging
    if (axios.isAxiosError(error)) {
      console.error('[PROXY] Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data ? '[data available]' : '[no data]',
        url: error.config?.url
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch URL', 
      message: error.message,
      url: url,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER] Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Running on port ${PORT}`);
  console.log(`[SERVER] Listening on all interfaces (0.0.0.0)`);
  console.log(`[SERVER] Environment: ${IS_PRODUCTION ? 'Production' : 'Development'}`);
  console.log(`[SERVER] Started at: ${new Date().toISOString()}`);
});
