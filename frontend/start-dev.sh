#!/bin/bash

# EarthSlight Development Startup Script
# This script starts both backend and frontend servers

echo "🌍 Starting EarthSlight Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ and try again.${NC}"
    exit 1
fi

# Check npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
echo -e "${GREEN}✅ npm $(npm --version) found${NC}"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run this script from the frontend directory.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

# Check if backend is running
echo -e "${BLUE}🔍 Checking backend server...${NC}"
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${YELLOW}⚠️  Backend server is not running${NC}"
    echo -e "${YELLOW}   Please start the backend server first:${NC}"
    echo -e "${YELLOW}   cd ../backend && npm start${NC}"
    echo ""
    echo -e "${BLUE}ℹ️  Starting frontend anyway...${NC}"
fi

# Start the development server
echo -e "${BLUE}🚀 Starting frontend development server...${NC}"
echo -e "${BLUE}   Frontend will be available at: http://localhost:3000${NC}"
echo -e "${BLUE}   Backend should be running at: http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}📝 Development Features:${NC}"
echo -e "${YELLOW}   • API Testing: Click 'Test APIs' button in Dashboard${NC}"
echo -e "${YELLOW}   • Error Boundary: Automatic error handling${NC}"
echo -e "${YELLOW}   • Hot Reload: Automatic refresh on file changes${NC}"
echo -e "${YELLOW}   • Email Alerts: Toggle in Dashboard${NC}"
echo ""

# Start the React development server
npm start
