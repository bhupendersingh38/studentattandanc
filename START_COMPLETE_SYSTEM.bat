@echo off
echo ============================================
echo   AttendX AI - Complete System Starter
echo ============================================
echo.

cd /d "%~dp0"

echo Step 1: Starting Backend Server...
echo.
start cmd /k "cd backend && python main_production.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 2: Starting Frontend Server...
echo.
start cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo   SYSTEM STARTED SUCCESSFULLY!
echo ============================================
echo.
echo Backend API: http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo Frontend:    http://localhost:3000
echo.
echo Press any key to stop all servers...
pause

taskkill /F /FI "WINDOWTITLE eq *python main_production.py*"
taskkill /F /FI "WINDOWTITLE eq *npm run dev*"
