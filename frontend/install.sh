#!/bin/bash

# Installation script for Customer Sentiment Alert System Frontend
# This script automates the setup process

echo "🚨 Customer Sentiment Alert System - Frontend Setup"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed"
    echo "📥 Please install Node.js 16+ from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Node.js version is too old (found v$NODE_VERSION)"
    echo "📥 Please upgrade to Node.js 16+ from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to install dependencies"
    echo "💡 Try: rm -rf node_modules package-lock.json && npm install"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "=================================================="
echo "✅ Frontend setup complete!"
echo "=================================================="
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Start the backend server (in project root):"
echo "   cd .. && python main.py"
echo ""
echo "2. Start the frontend (in this directory):"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "🎉 You're all set! Happy analyzing!"
echo ""
