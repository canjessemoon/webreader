# Railway Redeployment Guide (Updated May 15, 2025)

Follow these steps to redeploy your WebReader application on Railway with the enhanced fixes for content extraction issues, health check failures, and server boot reliability.

## Key Improvements in This Update

1. **Enhanced Health Check System**
   - Multiple fallback health check endpoints (`/healthz`, `/health`, `/_health`)
   - More resilient health check verification in the boot script
   - Exponential backoff for health check retries

2. **Improved Boot Process**
   - JavaScript-based boot script that avoids shell permission issues
   - Better error handling and logging
   - Direct server process management

3. **Validation Tools**
   - Added `validate-railway-deployment.ps1` to check your configuration
   - Enhanced `test-railway-local.ps1` for local testing

## 1. Update Your Deployment on Railway

### Automatic Deployment (If connected to GitHub)

If you've connected your GitHub repository to Railway, simply pushing the latest changes should trigger an automatic redeploy. You can verify this by:

1. Go to your [Railway dashboard](https://railway.app/dashboard)
2. Select your WebReader project
3. Check the "Deployments" tab to see if a new deployment is in progress

### Manual Redeployment

If automatic deployment isn't set up:

1. Go to your [Railway dashboard](https://railway.app/dashboard)
2. Select your WebReader project
3. Click the "Deploy" button to manually trigger a new deployment
4. Select the latest commit from your GitHub repository

## 2. Verify the Deployment

After deployment is complete:

1. Open your Railway app URL (https://webreader-production.up.railway.app/)
2. Try extracting content from a simple website, such as:
   - https://example.com
   - https://developer.mozilla.org
   - https://reactjs.org

## 3. What's Fixed in This Deployment

The latest changes include several improvements for Railway deployment:

1. **Dynamic Proxy System**:
   - The app now automatically tries multiple CORS proxies if the internal one fails
   - Includes 4 different public proxies as fallbacks

2. **Enhanced Error Handling**:
   - Better error messages for different types of failures
   - Automatic retry with different proxies when a request fails

3. **Railway-Specific Configuration**:
   - Added Railway configuration files
   - Set up environment detection to use appropriate settings on Railway

4. **Healthcheck Fixes**:
   - Added multiple health check endpoints at `/health`, `/healthz`, `/readiness`, and `/liveness`
   - Created boot script (`railway-boot.sh`) to handle startup issues
   - Added CommonJS server version for better compatibility
   - Updated server port binding to listen on all interfaces

5. **Improved Logging**:
   - Server now logs to a file for better debugging
   - Added healthcheck verification script

## 4. If Issues Persist

If you still see "No content found on this page" after deploying:

1. Open the browser developer tools (F12)
2. Check the console for error messages
3. Try a different URL - some websites may have strict security that blocks all proxies
4. Verify that the public proxies are available (they occasionally have usage limits)

## 5. Monitoring and Logs

Railway provides excellent logging capabilities:

1. Go to your Railway project
2. Click on the "Deployments" tab
3. Select the current deployment
4. Click "View Logs" to see runtime logs
5. Look for "[PROXY]" prefixed messages which show the content extraction process
6. Look for "[HEALTH]" messages showing health check activity

## 6. Testing Locally Before Deployment

You should test your Railway configuration locally before deploying to catch any issues:

### Validate Your Configuration 

First, validate your deployment configuration:

1. Run the validation script:
   ```powershell
   .\validate-railway-deployment.ps1
   ```

2. This will check all required files, configuration settings, and server setup.
3. Fix any issues identified by the validation script before proceeding.

### Test Local Deployment

Next, test the actual boot process and server startup:

1. Run the test script:
   ```powershell
   .\test-railway-local.ps1
   ```
   
   Or, if you've already built the project:
   ```powershell
   .\test-railway-local.ps1 -NoBuild
   ```

2. This will:
   - Simulate the Railway environment
   - Build the project
   - Start the server using the Railway-compatible configuration
   - Test the health endpoints

3. Access the health check endpoint at http://localhost:3001/healthz

## Next Steps

Consider the following to further improve your deployment:

1. **Custom Domain**: Set up a custom domain in Railway settings 
2. **Environment Variables**: Add a `CORS_PROXY_LIST` environment variable to specify additional proxies
3. **Monitoring**: Set up Railway alerts to notify you of any issues
