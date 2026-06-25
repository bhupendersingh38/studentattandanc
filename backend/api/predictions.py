"""
ML Predictions API endpoints
"""
from fastapi import APIRouter
from typing import List

router = APIRouter()


@router.get("/at-risk")
async def get_at_risk_students():
    """Get students at risk of low attendance"""
    return {
        "at_risk_students": [
            {
                "student_id": "1",
                "student_name": "John Doe",
                "current_percentage": 72.5,
                "predicted_percentage": 68.3,
                "risk_probability": 0.85,
                "recommendation": "Immediate intervention required"
            }
        ]
    }


@router.get("/student/{student_id}")
async def predict_student_attendance(student_id: str):
    """Predict attendance for a specific student"""
    return {
        "student_id": student_id,
        "current_percentage": 75.0,
        "predicted_30_days": 72.5,
        "risk_level": "medium",
        "confidence": 0.82
    }
