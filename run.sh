#!/bin/bash

# Rido: Ultimate Run Script
# This script starts all three components of the Ridesharing system.

# Function to handle termination
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting Rido System..."

# 1. Start C++ Engine
echo "----------------------------------------"
echo "🛠 1/3: Starting C++ Engine (Port 8082)..."
if [ -f "./backend/rideshare_server" ]; then
    ./backend/rideshare_server > cpp_server.log 2>&1 &
    echo "✅ C++ Engine backgrounded (Logs: backend/cpp_server.log)"
else
    echo "❌ Error: C++ binary not found at ./backend/rideshare_server"
fi

# 2. Start Node.js API Bridge
echo "----------------------------------------"
echo "🌐 2/3: Starting Node.js API Bridge (Port 8080)..."
if [ -f "server.js" ]; then
    node server.js &
    echo "✅ API Bridge backgrounded"
else
    echo "❌ Error: server.js not found in root"
fi

# 3. Start Frontend
echo "----------------------------------------"
echo "💻 3/3: Starting Frontend Dev Server..."
if [ -d "frontend" ]; then
    cd frontend
    npm run dev &
    cd ..
    echo "✅ Frontend backgrounded"
else
    echo "❌ Error: frontend directory not found"
fi

echo "----------------------------------------"
echo "✨ Rido is running!"
echo "📡 Bridge API: http://localhost:8080"
echo "⚙️  C++ Engine: http://localhost:8082"
echo "🖥  Frontend: Check terminal for Vite URL"
echo "----------------------------------------"
echo "Press Ctrl+C to stop all services."

# Keep script running
wait
