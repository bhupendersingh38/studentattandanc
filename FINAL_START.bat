@echo off
cls
echo ============================================
echo   AttendX AI - FINAL COMPLETE SYSTEM
echo ============================================
echo.
echo Starting complete system...
echo.

cd /d "%~dp0"

:: Kill any existing processes on ports 8000 and 3000
echo Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

:: Start Backend
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python main_production.py"
timeout /t 5 /nobreak

:: Start Frontend  
echo Starting Frontend Server...
start "Frontend Server" cmd /k "python serve_app.py"
timeout /t 3 /nobreak

:: Open Browser
echo Opening browser...
start http://localhost:3000/index.html

echo.
echo ============================================
echo   System Started Successfully!
echo ============================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000/index.html
echo.
echo Login Credentials:
echo   Student: 21CS001 / Std@C001
echo   Teacher: T001 / Tech@T001
echo   Admin:   ADM001 / Adm@001
echo.
echo Keep this window open!
echo Press any key to stop all servers...
pause >nul

:: Stop all servers
echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Backend Server*" /F
taskkill /FI "WINDOWTITLE eq Frontend Server*" /F

echo Done!
timeout /t 2
