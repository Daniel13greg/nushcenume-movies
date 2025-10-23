#!/bin/bash

echo "========================================"
echo "  Starting Movie Site with Torrents"
echo "========================================"
echo ""

echo "[1/3] Checking backend dependencies..."
cd "backend webtorrent"
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
    echo "Backend dependencies installed!"
else
    echo "Backend dependencies already installed."
fi
echo ""

echo "[2/3] Starting WebTorrent backend server on port 3001..."
# Start backend in background
node server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started (PID: $BACKEND_PID)"
echo "Backend logs: backend webtorrent/backend.log"
echo ""

cd ..
echo "[3/3] Starting Next.js frontend on port 3000..."
sleep 2
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started (PID: $FRONTEND_PID)"
echo ""

echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop both servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait