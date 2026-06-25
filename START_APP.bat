@echo off
echo ============================================
echo   AttendX AI - Starting Application
echo ============================================
echo.

cd /d "%~dp0"

echo Starting frontend server...
echo This will open your browser automatically
echo.

python serve_app.py

pause
