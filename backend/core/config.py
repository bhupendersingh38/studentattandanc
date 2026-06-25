"""
Configuration settings for AttendX AI
"""
import os
from typing import List


class Settings:
    """Application settings"""
    
    # App
    APP_NAME: str = "AttendX AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "*"  # Allow all for demo
    ]
    
    # Allowed Hosts
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # AI Engine
    AI_ENGINE_URL: str = "http://localhost:8001"
    
    # Face Recognition
    FACE_RECOGNITION_THRESHOLD: float = 0.85
    LIVENESS_DETECTION_ENABLED: bool = True
    MAX_FACES_PER_FRAME: int = 50
    
    # Attendance
    LATE_ENTRY_THRESHOLD_MINUTES: int = 10
    AUTO_MARK_ABSENT_ENABLED: bool = True
    
    # Prediction
    ATTENDANCE_RISK_THRESHOLD: float = 0.70
    PREDICTION_DAYS_AHEAD: int = 30
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100


settings = Settings()
