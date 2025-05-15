# Railway Deployment Instructions for WebReader

## Deployment Steps

1. **Push your code to GitHub**
   - Make sure your code is pushed to a GitHub repository
   - The repository should include all the files necessary for the application

2. **Connect to Railway**
   - Go to [Railway.app](https://railway.app/)
   - Create a new project
   - Select "Deploy from GitHub repo"
   - Choose your WebReader repository

3. **Configure Environment Variables**
   - Set `NODE_ENV` to `production`
   - Set `PORT` to `3000` (or let Railway configure it automatically)

4. **Verify Build Settings**
   - Railway will automatically detect that this is a Node.js project
   - The build command should be `npm run build`
   - The start command should be `node server.js`

5. **Deploy Your Application**
   - Click "Deploy" and wait for the build to complete
   - Railway will provide you with a deployment URL

## Troubleshooting CORS Issues

If you still see "No content found on this page" when extracting content:

1. **Check Railway Logs**
   - Look for any CORS-related errors
   - Look for any proxy-related errors

2. **Add Target Website to CORS Allowlist**
   - If specific websites consistently fail, update the server.js file to explicitly allow those domains

3. **Try Another Website**
   - Some websites have strict security policies that prevent content extraction
   - Try extracting content from a different website to confirm the proxy is working

4. **Manual Fix Option**
   - If Railway still has issues with the CORS proxy, consider using a third-party CORS proxy like:
     - https://corsproxy.io/
     - https://cors-anywhere.herokuapp.com/

   To use a third-party proxy, update `contentService.ts` and change:
   ```typescript
   const API_URL = '/api/proxy?url=';
   ```
   
   To:
   ```typescript
   const API_URL = 'https://corsproxy.io/?';
   ```

## Current Status

The WebReader application deployed on Railway should handle CORS issues with the improved server configuration. The app now:

1. Has improved error handling for different HTTP status codes
2. Includes detailed logging for troubleshooting
3. Uses more robust headers when making requests
4. Has a health check endpoint for Railway monitoring
