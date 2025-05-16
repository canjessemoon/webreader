# WebReader Deployment Checklist

Use this checklist to ensure your WebReader application is properly configured for deployment.

## Pre-Deploy Checklist

### Project Configuration

- [ ] `package.json` has correct build and start scripts
- [ ] `railway.json` is configured with proper start command and health check
- [ ] Node.js version is specified (in package.json "engines" field)
- [ ] All environment variables are documented and set

### Code Quality

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] No console warnings in the compiled code
- [ ] All features are working in local environment

### Server Configuration

- [ ] Server has health check endpoints (`/health`, `/healthz`, `/_health`)
- [ ] CORS is properly configured
- [ ] Proxy service has fallback options
- [ ] Error handling is implemented for all API routes

### Frontend Configuration

- [ ] API URLs are configured correctly for production
- [ ] Dark mode works properly
- [ ] Text-to-speech functionality is tested
- [ ] Responsive design works on all screen sizes

## Deployment Steps

1. Run the test script: `./test-webreader.ps1`
2. Build the application: `npm run build`
3. Verify the dist folder contains all necessary files
4. Copy railway configuration: `cp railway.simple.json railway.json`
5. Commit all changes: `git commit -am "Ready for deployment"`
6. Push to GitHub: `git push`
7. Deploy on Railway:
   - Connect to GitHub repository
   - Set environment variables (PORT, NODE_ENV)
   - Deploy the application

## Post-Deploy Verification

- [ ] Application loads at the provided URL
- [ ] Health check endpoint returns 200 OK
- [ ] API proxy works with a test URL
- [ ] Text-to-speech functions correctly
- [ ] Dark mode toggle works
- [ ] Content is properly formatted

## Common Issues and Solutions

### Health Check Fails

- Verify health check path in railway.json matches server implementation
- Check server logs for startup errors
- Ensure PORT environment variable is being used correctly

### CORS Issues

- Check that CORS is configured properly in server
- Verify proxy service is handling requests correctly
- Try using a different CORS proxy in the fallback list

### Content Extraction Fails

- Verify the website doesn't block web scrapers
- Try adding more request headers to mimic a real browser
- Check if the site requires JavaScript to render content

### Build Issues

- Clear node_modules and reinstall dependencies
- Update Node.js to the latest LTS version
- Check for TypeScript errors and fix them

## Monitoring

- Check Railway dashboard for service health
- Monitor error logs for any recurring issues
- Set up alerts for service downtime if available
