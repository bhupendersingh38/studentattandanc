@echo off
echo ============================================
echo   Installing Frontend Dependencies
echo ============================================
echo.

cd /d "%~dp0\frontend"

echo Installing npm packages...
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please make sure Node.js is installed
    pause
    exit /b 1
)

echo.
echo ============================================
echo   SUCCESS! Dependencies installed
echo ============================================
echo.
echo You can now start the frontend with:
echo    cd frontend
echo    npm run dev
echo.
echo Or use START_COMPLETE_SYSTEM.bat to start everything
echo.
pause
