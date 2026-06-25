"""
AI Engine Configuration
"""
import os

class Settings:
    MODEL_PATH = os.getenv("MODEL_PATH", "./models")
    GPU_ENABLED = os.getenv("GPU_ENABLED", "false").lower() == "true"
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    FACE_RECOGNITION_THRESHOLD = 0.85
    LIVENESS_THRESHOLD = 0.90

settings = Settings()
