@echo off
REM EarthSlight Development Startup Script for Windows
REM This script starts both backend and frontend servers

echo 🌍 Starting EarthSlight Development Environment...

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION% found
echo ✅ npm %NPM_VERSION% found

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the frontend directory.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
)

REM Check if backend is running
echo 🔍 Checking backend server...
curl -s http://localhost:5000/api/health >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend server is running
) else (
    echo ⚠️  Backend server is not running
    echo    Please start the backend server first:
    echo    cd ../backend ^&^& npm start
    echo.
    echo ℹ️  Starting frontend anyway...
)

REM Start the development server
echo 🚀 Starting frontend development server...
echo    Frontend will be available at: http://localhost:3000
echo    Backend should be running at: http://localhost:5000
echo.
echo 📝 Development Features:
echo    • API Testing: Click 'Test APIs' button in Dashboard
echo    • Error Boundary: Automatic error handling
echo    • Hot Reload: Automatic refresh on file changes
echo    • Email Alerts: Toggle in Dashboard
echo.

REM Start the React development server
call npm start
