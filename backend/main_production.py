"""
AttendX AI - Production FastAPI Application
With Real Database Integration
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import os

# Import new APIs with database
from api import auth_new, students_new, attendance_new, analytics_new, timetable, teachers
from database import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("=" * 60)
    logger.info("Starting AttendX AI Production Backend...")
    logger.info("=" * 60)
    
    # Initialize database
    try:
        init_db()
        logger.info("✓ Database initialized successfully")
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {e}")
    
    # Create uploads directory
    os.makedirs("uploads/student_photos", exist_ok=True)
    logger.info("✓ Uploads directory ready")
    
    logger.info("✓ AttendX AI Backend started successfully")
    logger.info(f"✓ API Documentation: http://localhost:8000/docs")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("Shutting down AttendX AI Backend...")


# Initialize FastAPI app
app = FastAPI(
    title="AttendX AI - Production API",
    description="AI-powered Smart Attendance System with Real Database",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware - Complete fix for CORS issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Specific origins
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicit methods
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add OPTIONS handler for preflight requests
@app.options("/{path:path}")
async def options_handler(path: str):
    return {}

# Mount static files for uploads
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Health check endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AttendX AI - Production Backend",
        "version": "2.0.0",
        "status": "running",
        "database": "SQLite",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AttendX AI Production API",
        "version": "2.0.0",
        "database": "connected"
    }


@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return {
        "status": "ready",
        "mode": "production",
        "database": "sqlite",
        "features": [
            "authentication",
            "student_management",
            "attendance_tracking",
            "analytics",
            "face_recognition"
        ]
    }


# Include routers with production APIs
app.include_router(
    auth_new.router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

app.include_router(
    students_new.router,
    prefix="/api/v1/students",
    tags=["Students"]
)

app.include_router(
    attendance_new.router,
    prefix="/api/v1/attendance",
    tags=["Attendance"]
)

app.include_router(
    analytics_new.router,
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)

app.include_router(
    timetable.router,
    prefix="/api/v1/timetable",
    tags=["Timetable"]
)

app.include_router(
    teachers.router,
    prefix="/api/v1/teachers",
    tags=["Teachers"]
)


# System info endpoint
@app.get("/system/info")
async def system_info():
    """Get system information"""
    import sys
    from pathlib import Path
    
    db_path = Path("attendx_ai.db")
    db_exists = db_path.exists()
    db_size = db_path.stat().st_size if db_exists else 0
    
    uploads_path = Path("uploads/student_photos")
    uploads_count = len(list(uploads_path.glob("*"))) if uploads_path.exists() else 0
    
    return {
        "python_version": sys.version,
        "database": {
            "type": "SQLite",
            "file": "attendx_ai.db",
            "exists": db_exists,
            "size_bytes": db_size,
            "size_mb": round(db_size / (1024 * 1024), 2)
        },
        "uploads": {
            "directory": "uploads/student_photos",
            "photos_count": uploads_count
        },
        "endpoints": {
            "auth": "/api/v1/auth",
            "students": "/api/v1/students",
            "attendance": "/api/v1/attendance",
            "analytics": "/api/v1/analytics"
        }
    }


if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "=" * 60)
    print("AttendX AI - Production Backend")
    print("=" * 60)
    print("\nStarting server...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("\nPress CTRL+C to stop\n")
    
    uvicorn.run(
        "main_production:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
