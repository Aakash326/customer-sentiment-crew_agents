@echo off
REM Installation script for Customer Sentiment Alert System Frontend (Windows)

echo 🚨 Customer Sentiment Alert System - Frontend Setup
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo 📥 Please install Node.js 16+ from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node -v
echo ✅ npm detected
call npm -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Failed to install dependencies
    echo 💡 Try: rmdir /s /q node_modules ^&^& del package-lock.json ^&^& npm install
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ==================================================
echo ✅ Frontend setup complete!
echo ==================================================
echo.
echo 📋 Next steps:
echo.
echo 1. Start the backend server (in project root):
echo    cd .. ^&^& python main.py
echo.
echo 2. Start the frontend (in this directory):
echo    npm run dev
echo.
echo 3. Open your browser to:
echo    http://localhost:3000
echo.
echo 🎉 You're all set! Happy analyzing!
echo.
pause
