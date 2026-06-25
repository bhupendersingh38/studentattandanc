@echo off
color 0A
echo ============================================
echo   AttendX AI - System Status Checker
echo ============================================
echo.

cd /d "%~dp0"

echo Checking system components...
echo.

echo [1/5] Checking Python...
python --version
if errorlevel 1 (
    echo   X Python NOT found
    echo   ! Please install Python from python.org
) else (
    echo   √ Python installed
)
echo.

echo [2/5] Checking Node.js...
node --version
if errorlevel 1 (
    echo   X Node.js NOT found
    echo   ! Please install Node.js from nodejs.org
) else (
    echo   √ Node.js installed
)
echo.

echo [3/5] Checking Backend Database...
if exist "backend\attendx_ai.db" (
    echo   √ Database exists
) else (
    echo   X Database NOT found
    echo   ! Run: cd backend ^& python database.py
)
echo.

echo [4/5] Checking Frontend Dependencies...
if exist "frontend\node_modules" (
    echo   √ Frontend dependencies installed
) else (
    echo   X Frontend dependencies NOT installed
    echo   ! Run: SETUP_FRONTEND.bat
)
echo.

echo [5/5] Checking Backend Dependencies...
cd backend
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo   X Backend dependencies NOT installed
    echo   ! Run: cd backend ^& pip install -r requirements_production.txt
) else (
    echo   √ Backend dependencies installed
)
cd ..
echo.

echo ============================================
echo   System Check Complete
echo ============================================
echo.
echo To start the system:
echo   1. Run SETUP_FRONTEND.bat (if needed)
echo   2. Run START_COMPLETE_SYSTEM.bat
echo   3. Open http://localhost:3000
echo.
pause
