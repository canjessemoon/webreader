#!/bin/sh
# Railway deployment boot script

LOG_FILE="./railway-server.log"

# Print environment details and log them
{
  echo "=== STARTING WEBREADER SERVER ==="
  echo "Date: $(date)"
  echo "Node version: $(node -v)"
  echo "NPM version: $(npm -v)"
  echo "Current directory: $(pwd)"
  echo "Files in directory:"
  ls -la
  echo "Environment variables:"
  env | grep -v "SECRET\\|PASSWORD\\|KEY"
} | tee -a "$LOG_FILE"

# Set the correct port
export PORT="${PORT:-3000}"
echo "Using PORT: $PORT" | tee -a "$LOG_FILE"

# Ensure the server is killed on exit to avoid orphaned processes
cleanup() {
  echo "Received termination signal. Shutting down..." | tee -a "$LOG_FILE"
  kill -TERM "$SERVER_PID" 2>/dev/null
  exit 0
}

# Set up trap for signals
trap cleanup INT TERM

# Try running the server with different methods, logging output
echo "Attempting to start server..." | tee -a "$LOG_FILE"

# Try the CommonJS version first
if [ -f "./server-railway.js" ]; then
  echo "Starting server using server-railway.js..." | tee -a "$LOG_FILE"
  node server-railway.js > "$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo "Server started with PID: $SERVER_PID" | tee -a "$LOG_FILE"
else
  # Fall back to server.js with experimental flags
  echo "Starting server using server.js with experimental flags..." | tee -a "$LOG_FILE"
  node --experimental-modules --experimental-specifier-resolution=node server.js > "$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo "Server started with PID: $SERVER_PID" | tee -a "$LOG_FILE"
fi

# Use the healthcheck script to verify the server is running
echo "Verifying server health..." | tee -a "$LOG_FILE"
sh ./railway-healthcheck.sh | tee -a "$LOG_FILE"

# Keep the process running by checking the server periodically
echo "Monitoring server process..." | tee -a "$LOG_FILE"
while kill -0 "$SERVER_PID" 2>/dev/null; do
  sleep 5
  # Tail the log file for debugging
  tail -1 "$LOG_FILE"
done

echo "Server process has stopped. Exiting..." | tee -a "$LOG_FILE"
exit 1
