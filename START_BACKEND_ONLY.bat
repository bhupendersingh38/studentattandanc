@echo off
echo ============================================
echo   Starting Backend Server
echo ============================================
echo.

cd /d "%~dp0\backend"

echo Checking database...
if not exist "attendx_ai.db" (
    echo Creating database...
    python database.py
)

echo.
echo Starting backend on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop
echo.

python main_production.py

pause
