@echo off
echo ========================================
echo Earth-Sight Backend Startup
echo ========================================
echo.

cd /d "%~dp0backend"

echo Checking if backend folder exists...
if not exist "node_modules" (
    echo node_modules not found! Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting backend server on port 5000...
echo.
echo Backend will be accessible at: http://localhost:5000
echo Frontend on Render can connect to this backend
echo.
echo Allowed Origins:
echo   - http://localhost:5173 (Local Dev)
echo   - https://earth-sight.onrender.com (Render)
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause
