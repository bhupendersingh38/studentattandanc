@echo off
echo ============================================
echo   AttendX AI - Frontend Starter
echo ============================================
echo.

cd /d "%~dp0"

echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting Next.js frontend...
echo Frontend will be available at: http://localhost:3000
echo.

call npm run dev

pause
