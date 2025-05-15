# Deployment Guide for WebReader

This guide explains how to deploy WebReader to different hosting platforms.

## Important Note

WebReader requires both a frontend and a backend API to function properly. The backend API is needed to proxy requests to external websites to avoid CORS issues.

## Option 1: Deploy to Vercel, Netlify, or similar platforms

These platforms can host both your frontend and serverless backend functions.

### Step 1: Create a new project in your hosting platform

- Connect your GitHub repository to your hosting platform
- Configure the build settings:
  - Build command: `npm run build`
  - Output directory: `dist`

### Step 2: Configure the server-side functionality

Most platforms allow you to configure serverless functions:

#### For Netlify:
1. Create a `netlify.toml` file in your project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Create a serverless function in `netlify/functions/proxy.js`:
```javascript
const axios = require('axios');

exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' })
    };
  }
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: response.data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch URL', 
        message: error.message 
      })
    };
  }
};
```

#### For Vercel:
1. Create a `vercel.json` file in your project root:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

2. Create an API route in `api/proxy.js`:
```javascript
const axios = require('axios');

export default async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.setHeader('Content-Type', 'text/html');
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch URL', 
      message: error.message 
    });
  }
};
```

## Option 2: Deploy to a traditional hosting service (e.g., DigitalOcean, Heroku, etc.)

These platforms can run your Express server which handles both the static files and the API.

### Step 1: Deploy your code to the platform

- Push your code to GitHub
- Connect your repository to the hosting platform
- Set the start command to `npm start` (this will run server.js)

### Step 2: Configure environment variables

Make sure to set the `PORT` environment variable according to your hosting provider's requirements.

## Option 3: Local Deployment

If you want to run WebReader locally:

1. Build the project:
```
npm run build
```

2. Start the server:
```
npm start
```

3. Access the application at `http://localhost:3000`

## Troubleshooting

If you encounter the "No content found on this page" error, it usually means:

1. Your backend API proxy is not properly configured
2. There are CORS issues with the website you're trying to extract content from
3. The website is blocking your extraction requests

Check your server logs for more details on any errors occurring when fetching content.
