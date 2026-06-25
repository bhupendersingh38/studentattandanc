@echo off
cls
color 0A
echo.
echo ========================================================================
echo           AttendX AI - Production System Startup
echo ========================================================================
echo.
echo [1/3] Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python first.
    pause
    exit /b 1
)
echo     OK - Python found
echo.

echo [2/3] Starting Production Backend...
echo.
cd backend
start "AttendX AI Backend" cmd /k "python main_production.py"
echo     OK - Backend started in new window
echo     URL: http://localhost:8000
echo     Docs: http://localhost:8000/docs
echo.

timeout /t 3 /nobreak >nul

echo [3/3] Opening API Documentation...
start http://localhost:8000/docs
echo     OK - Browser opening...
echo.

echo ========================================================================
echo                    SYSTEM STARTED SUCCESSFULLY!
echo ========================================================================
echo.
echo  Backend API:    http://localhost:8000
echo  Documentation:  http://localhost:8000/docs
echo  Health Check:   http://localhost:8000/health
echo  Database:       backend\attendx_ai.db
echo  Photos:         backend\uploads\student_photos\
echo.
echo  Features Available:
echo    - Student Registration
echo    - Photo Upload
echo    - Attendance Marking
echo    - Teacher Verification
echo    - Analytics & Reports
echo    - Real Database Storage
echo.
echo ========================================================================
echo.
echo  Test the system with: python test_system.py
echo  Stop backend: Close the backend window or press CTRL+C
echo.
echo ========================================================================
echo.
pause
