#!/bin/sh
# Railway deployment boot script

# Print environment details
echo "Starting WebReader server..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Set the correct port
export PORT="${PORT:-3000}"
echo "Using PORT: $PORT"

# Try to start the server using CommonJS version if available
if [ -f "./server-railway.js" ]; then
  echo "Starting server using server-railway.js..."
  node server-railway.js
else
  # Fall back to server.js with experimental flags
  echo "Starting server using server.js with experimental flags..."
  node --experimental-modules --experimental-specifier-resolution=node server.js
fi
