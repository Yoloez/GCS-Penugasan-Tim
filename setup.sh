#!/bin/bash

# Ground Control System - Testing & Demo Script
# Usage: bash test-gcs.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Ground Control System (GCS) - Setup & Testing Script     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}[1/5]${NC} Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo ""

# Check if npm is installed
echo -e "${BLUE}[2/5]${NC} Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}[3/5]${NC} Installing dependencies..."
if npm install > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Build project
echo -e "${BLUE}[4/5]${NC} Building project..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Check if db.json exists
echo -e "${BLUE}[5/5]${NC} Checking database file..."
if [ -f "db.json" ]; then
    echo -e "${GREEN}✓ Database file exists${NC}"
else
    echo -e "${YELLOW}⚠ Database file not found${NC}"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   SETUP COMPLETE ✓                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "  1. Open Terminal 1 and run:"
echo "     ${GREEN}npm run dev${NC}"
echo "     (Frontend on http://localhost:5173)"
echo ""
echo "  2. Open Terminal 2 and run:"
echo "     ${GREEN}npm run server${NC}"
echo "     (Backend API on http://localhost:3001)"
echo ""
echo "  3. Open your browser and go to:"
echo "     ${BLUE}http://localhost:5173${NC}"
echo ""

echo -e "${YELLOW}Features to test:${NC}"
echo "  • Create plans with 4 shape types"
echo "  • Save plans with custom names"
echo "  • View all plans"
echo "  • Delete plans"
echo "  • Responsive design"
echo ""

echo "Happy testing! 🚀"
