#!/bin/bash
# Script to start the FastAPI backend for ML operations

cd /app/backend

# Kill any existing FastAPI process
pkill -f "uvicorn main:app" 2>/dev/null

# Start FastAPI in the background
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > /var/log/fastapi.log 2>&1 &

echo "FastAPI backend started on port 8000"
echo "Logs: /var/log/fastapi.log"
