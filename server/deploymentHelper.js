// Railways deployment helper endpoints
// This file adds API endpoints to the server to assist with Railway deployment

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = function(app) {
  // Endpoint to copy railway.simple.json to railway.json
  app.post('/api/copy-railway-config', (req, res) => {
    try {
      const simplePath = path.join(__dirname, '../railway.simple.json');
      const destPath = path.join(__dirname, '../railway.json');
      
      // Check if the source file exists
      if (!fs.existsSync(simplePath)) {
        return res.status(404).json({ 
          success: false, 
          error: 'Source file railway.simple.json not found' 
        });
      }
      
      // Copy the file
      fs.copyFileSync(simplePath, destPath);
      
      console.log('Railway config successfully copied');
      res.json({ 
        success: true, 
        message: 'Railway configuration copied successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error copying railway config:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to copy railway configuration',
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Endpoint to run the build task
  app.post('/api/run-build', (req, res) => {
    console.log('Starting build process...');
    
    // Start the build process but don't wait for it to finish
    const buildProcess = exec('npm run build', { cwd: path.join(__dirname, '..') });
    
    // Send an immediate response to avoid timeouts
    res.json({ 
      success: true, 
      message: 'Build process started',
      timestamp: new Date().toISOString()
    });
    
    // Log output for debugging
    buildProcess.stdout.on('data', (data) => {
      console.log(`Build output: ${data}`);
    });
    
    buildProcess.stderr.on('data', (data) => {
      console.error(`Build error: ${data}`);
    });
    
    buildProcess.on('close', (code) => {
      console.log(`Build process exited with code ${code}`);
    });
  });
  
  // Endpoint to check build status
  app.get('/api/build-status', (req, res) => {
    // Check if the dist folder exists and has files
    const distPath = path.join(__dirname, '../dist');
    
    if (fs.existsSync(distPath)) {
      try {
        const files = fs.readdirSync(distPath);
        
        if (files.length > 0) {
          // Check when the most recent file was modified
          const stats = fs.statSync(path.join(distPath, files[0]));
          const lastModified = stats.mtime;
          
          // If modified in the last 5 minutes, consider the build recent
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const isBuildRecent = lastModified > fiveMinutesAgo;
          
          res.json({
            success: true,
            built: true,
            fileCount: files.length,
            lastModified: lastModified.toISOString(),
            isRecent: isBuildRecent
          });
        } else {
          res.json({
            success: true,
            built: false,
            reason: 'dist folder is empty'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Error checking build status: ' + error.message
        });
      }
    } else {
      res.json({
        success: true,
        built: false,
        reason: 'dist folder does not exist'
      });
    }
  });
};
