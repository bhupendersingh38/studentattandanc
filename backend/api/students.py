"""
Students API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class Student(BaseModel):
    id: str
    student_code: str
    first_name: str
    last_name: str
    email: str
    department: str
    year: int
    attendance_percentage: Optional[float] = 0.0


@router.get("/", response_model=List[Student])
async def get_students():
    """Get all students"""
    # Demo data
    return [
        {
            "id": "1",
            "student_code": "CS001",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@university.edu",
            "department": "Computer Science",
            "year": 3,
            "attendance_percentage": 85.5
        },
        {
            "id": "2",
            "student_code": "CS002",
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@university.edu",
            "department": "Computer Science",
            "year": 3,
            "attendance_percentage": 92.3
        }
    ]


@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: str):
    """Get student by ID"""
    return {
        "id": student_id,
        "student_code": "CS001",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@university.edu",
        "department": "Computer Science",
        "year": 3,
        "attendance_percentage": 85.5
    }


@router.post("/")
async def create_student(student: Student):
    """Create new student"""
    return {"status": "success", "student_id": "new_id"}


@router.get("/{student_id}/attendance")
async def get_student_attendance(student_id: str):
    """Get student attendance records"""
    return {
        "student_id": student_id,
        "total_classes": 100,
        "attended": 85,
        "percentage": 85.0,
        "recent_records": []
    }
