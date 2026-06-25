"""
Teachers Management APIs
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, Teacher
from typing import Optional

router = APIRouter()

# In-memory store for teacher locations (in production, use Redis)
teacher_locations = {}

class TeacherLocation(BaseModel):
    teacher_id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    enabled: bool

@router.get("/")
async def get_all_teachers(db: Session = Depends(get_db)):
    """Get all teachers"""
    teachers = db.query(Teacher).all()
    return [
        {
            "id": t.id,
            "teacher_id": t.teacher_id,
            "name": t.name,
            "email": t.email,
            "department": t.department
        }
        for t in teachers
    ]

@router.post("/location")
async def update_teacher_location(data: TeacherLocation):
    """Update teacher's location status"""
    teacher_locations[data.teacher_id] = {
        "latitude": data.latitude,
        "longitude": data.longitude,
        "enabled": data.enabled
    }
    return {"message": "Location updated successfully"}

@router.get("/location/{teacher_id}")
async def get_teacher_location(teacher_id: int):
    """Get teacher's current location"""
    location = teacher_locations.get(teacher_id)
    
    if not location or not location.get('enabled'):
        return {
            "location_enabled": False,
            "message": "Teacher location not available"
        }
    
    return {
        "location_enabled": True,
        "location": {
            "lat": location['latitude'],
            "lng": location['longitude']
        }
    }
