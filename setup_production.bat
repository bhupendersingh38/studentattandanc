@echo off
echo ========================================
echo AttendX AI - Production Setup
echo ========================================
echo.

echo Installing Python dependencies...
cd backend
pip install fastapi uvicorn sqlalchemy python-multipart pillow opencv-python numpy pydantic
echo.

echo Creating database...
python database.py
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run backend: python backend\main.py
echo 2. Run AI engine: python ai-engine\main.py  
echo 3. Open browser: http://localhost:8000/docs
echo.
echo Database created: backend\attendx_ai.db
echo All data will be stored permanently!
echo.
pause
