"""
Students API endpoints with real database
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import hashlib
import os
import shutil
import sys
sys.path.append('..')

from database import get_db, Student, User

router = APIRouter()


# Models
class StudentCreate(BaseModel):
    roll_number: str
    name: str
    email: str
    phone: str
    parent_phone: str
    semester: int
    class_section: str
    department: str
    dob: str
    address: str


class StudentResponse(BaseModel):
    id: int
    roll_number: str
    name: str
    email: str
    phone: str
    parent_phone: str
    semester: int
    class_section: str
    department: str
    attendance_percentage: float
    total_classes: int
    attended_classes: int
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[StudentResponse])
async def get_students(
    semester: Optional[int] = None,
    class_section: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all students with filters"""
    query = db.query(Student)
    
    if semester:
        query = query.filter(Student.semester == semester)
    
    if class_section:
        query = query.filter(Student.class_section == class_section)
    
    if search:
        query = query.filter(
            (Student.name.contains(search)) | 
            (Student.roll_number.contains(search))
        )
    
    students = query.order_by(Student.name).all()
    return students


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: int, db: Session = Depends(get_db)):
    """Get student by ID"""
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return student


@router.post("/", response_model=dict)
async def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    """Register new student"""
    
    # Check if roll number exists
    existing = db.query(Student).filter(Student.roll_number == student.roll_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Roll number already exists")
    
    # Generate credentials
    user_id = student.roll_number
    password = f"Std@{student.roll_number[-4:]}"
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    # Create user account
    user = User(
        user_id=user_id,
        email=student.email,
        password_hash=password_hash,
        role="student",
        is_active=True
    )
    db.add(user)
    db.flush()
    
    # Create student profile
    new_student = Student(
        user_id=user.id,
        roll_number=student.roll_number,
        name=student.name,
        email=student.email,
        phone=student.phone,
        parent_phone=student.parent_phone,
        semester=student.semester,
        class_section=student.class_section,
        department=student.department,
        dob=student.dob,
        address=student.address
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {
        "message": "Student registered successfully",
        "student_id": new_student.id,
        "credentials": {
            "user_id": user_id,
            "password": password
        }
    }


@router.post("/{student_id}/photo")
async def upload_student_photo(
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload student photo"""
    
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    os.makedirs("uploads/student_photos", exist_ok=True)
    
    file_path = f"uploads/student_photos/{student.roll_number}.jpg"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    student.photo_path = file_path
    db.commit()
    
    return {"message": "Photo uploaded", "path": file_path}
