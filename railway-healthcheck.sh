#!/bin/sh
# Script to verify the server is running correctly

PORT="${PORT:-3000}"
HEALTH_URL="http://localhost:$PORT/healthz"
MAX_RETRIES=10
RETRY_DELAY=5

echo "Starting health check on $HEALTH_URL"

for i in $(seq 1 $MAX_RETRIES); do
  echo "Health check attempt $i of $MAX_RETRIES..."
  
  # Check if the health endpoint responds
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL || echo "000")
  
  if [ "$RESPONSE" = "200" ]; then
    echo "Health check succeeded! Server is running correctly."
    exit 0
  else
    echo "Health check failed with response code: $RESPONSE"
    echo "Retrying in $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
  fi
done

echo "Health check failed after $MAX_RETRIES attempts. Server is not running correctly."
echo "Checking server process..."

# See if the server process is running
ps aux | grep node

# Check logs
echo "Last 20 lines of logs:"
tail -20 ./railway-server.log

exit 1
