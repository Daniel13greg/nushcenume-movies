@echo off
echo ========================================
echo   Starting Movie Site with Torrents
echo ========================================
echo.

echo [1/3] Checking backend dependencies...
cd "backend webtorrent"
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo Backend dependencies installed!
) else (
    echo Backend dependencies already installed.
)
echo.

echo [2/3] Starting WebTorrent backend server on port 3001...
start "WebTorrent Backend" cmd /k "node server.js"
echo Backend server started in new window!
echo.

cd ..
echo [3/3] Starting Next.js frontend on port 3000...
timeout /t 3 /nobreak >nul
start "Frontend Dev Server" cmd /k "npm run dev"
echo Frontend server started in new window!
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to keep this window open...
pause >nul