"""
AttendX AI - AI Engine Main Application
Face Recognition, Liveness Detection, and ML Predictions
"""
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import logging
from datetime import datetime

from services.face_recognition_service import FaceRecognitionService
from services.liveness_detection_service import LivenessDetectionService
from services.prediction_service import PredictionService
from services.engagement_analyzer import EngagementAnalyzer
from core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AttendX AI Engine",
    description="AI/ML Services for Face Recognition and Analytics",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
face_recognition_service = FaceRecognitionService()
liveness_detection_service = LivenessDetectionService()
prediction_service = PredictionService()
engagement_analyzer = EngagementAnalyzer()


# Request/Response Models
class FaceDetectionRequest(BaseModel):
    image_base64: str


class FaceRecognitionRequest(BaseModel):
    image_base64: str
    class_id: Optional[str] = None


class LivenessCheckRequest(BaseModel):
    frames_base64: List[str]  # Multiple frames for liveness


class RecognitionResult(BaseModel):
    student_id: Optional[str]
    student_name: Optional[str]
    confidence: float
    bbox: List[int]
    liveness_verified: bool


class PredictionRequest(BaseModel):
    student_id: str


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AttendX AI Engine",
        "version": "1.0.0",
        "gpu_available": face_recognition_service.gpu_available
    }


# Face Detection
@app.post("/api/v1/detect-faces")
async def detect_faces(request: FaceDetectionRequest):
    """
    Detect all faces in an image
    """
    try:
        import base64
        
        # Decode base64 image
        image_data = base64.b64decode(request.image_base64)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        # Detect faces
        start_time = datetime.now()
        faces = await face_recognition_service.detect_faces(image)
        detection_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "faces_detected": len(faces),
            "faces": [
                {
                    "bbox": face["bbox"],
                    "confidence": face["confidence"],
                    "landmarks": face.get("landmarks", {})
                }
                for face in faces
            ],
            "detection_time_ms": detection_time
        }
    
    except Exception as e:
        logger.error(f"Face detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Face Recognition
@app.post("/api/v1/recognize", response_model=List[RecognitionResult])
async def recognize_faces(request: FaceRecognitionRequest):
    """
    Recognize students from image
    """
    try:
        import base64
        
        # Decode base64 image
        image_data = base64.b64decode(request.image_base64)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        # Recognize faces
        start_time = datetime.now()
        results = await face_recognition_service.recognize(image, request.class_id)
        recognition_time = (datetime.now() - start_time).total_seconds() * 1000
        
        logger.info(f"Recognized {len(results)} faces in {recognition_time:.2f}ms")
        
        return results
    
    except Exception as e:
        logger.error(f"Face recognition error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Liveness Detection
@app.post("/api/v1/verify-liveness")
async def verify_liveness(request: LivenessCheckRequest):
    """
    Verify liveness using multiple frames
    """
    try:
        import base64
        
        # Decode frames
        frames = []
        for frame_base64 in request.frames_base64:
            image_data = base64.b64decode(frame_base64)
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if image is not None:
                frames.append(image)
        
        if len(frames) < 3:
            raise HTTPException(
                status_code=400,
                detail="At least 3 frames required for liveness detection"
            )
        
        # Check liveness
        start_time = datetime.now()
        result = await liveness_detection_service.verify_liveness(frames)
        liveness_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "is_live": result["is_live"],
            "confidence": result["confidence"],
            "checks": result["checks"],
            "liveness_time_ms": liveness_time
        }
    
    except Exception as e:
        logger.error(f"Liveness detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Enroll Face
@app.post("/api/v1/enroll")
async def enroll_face(
    student_id: str,
    student_name: str,
    file: UploadFile = File(...)
):
    """
    Enroll a new student face
    """
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        # Enroll face
        success = await face_recognition_service.enroll_face(
            student_id=student_id,
            student_name=student_name,
            image=image
        )
        
        if success:
            return {
                "status": "success",
                "message": f"Student {student_name} enrolled successfully"
            }
        else:
            raise HTTPException(
                status_code=400,
                detail="Failed to enroll face. Ensure face is clearly visible."
            )
    
    except Exception as e:
        logger.error(f"Face enrollment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Attendance Prediction
@app.post("/api/v1/predict-attendance")
async def predict_attendance(request: PredictionRequest):
    """
    Predict attendance risk for a student
    """
    try:
        prediction = await prediction_service.predict_attendance_risk(
            request.student_id
        )
        
        return prediction
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Engagement Analysis
@app.post("/api/v1/analyze-engagement")
async def analyze_engagement(request: FaceDetectionRequest):
    """
    Analyze student engagement and emotions
    """
    try:
        import base64
        
        # Decode image
        image_data = base64.b64decode(request.image_base64)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        # Analyze engagement
        result = await engagement_analyzer.analyze(image)
        
        return result
    
    except Exception as e:
        logger.error(f"Engagement analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
