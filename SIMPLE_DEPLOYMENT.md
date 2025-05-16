# Simple Railway Deployment Guide for WebReader

This guide provides a simplified approach to deploying WebReader on Railway.

## Simplified Files

This simplified approach uses just three essential files:

1. `server.simple.cjs` - A simplified server that handles all requests and CORS proxying
2. `start.cjs` - A simple startup script that manages the server process
3. `railway.simple.json` - A simplified Railway configuration

## Deployment Steps

### 1. Rename the simplified files

```bash
# Remove the '.simple' suffix from filenames
mv server.simple.cjs server.cjs
mv railway.simple.json railway.json
```

### 2. Update package.json

Make sure your package.json has the following script:

```json
"scripts": {
  "build": "tsc -b && vite build",
  "start": "node start.cjs"
}
```

### 3. Deploy to Railway

1. Push your changes to GitHub
2. Connect your repository to Railway
3. Deploy the application

## How This Simplified Approach Works

1. **Single Server File**: All server functionality including health checks and CORS proxying is in one file.
2. **Simple Startup**: The startup script just needs to run the server.
3. **Multiple Health Endpoints**: The server responds to all common health check paths.
4. **Automatic Proxy Fallback**: The server tries multiple CORS proxies automatically.

## Testing Locally

To test locally, run:

```bash
npm run build
node start.cjs
```

This should start your server and you can access it at http://localhost:3000.

## Troubleshooting

- **Build Fails**: Make sure you have all dependencies installed with `npm install`
- **Server Won't Start**: Check for errors in the console output
- **Health Check Fails**: The server has endpoints at `/health`, `/healthz`, and `/_health`
- **Content Extraction Fails**: The server tries multiple CORS proxies automatically
