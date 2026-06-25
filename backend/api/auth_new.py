"""
Authentication API endpoints with real database
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hashlib
import sys
sys.path.append('..')

from database import get_db, User, Student, Teacher

router = APIRouter()


# Models
class LoginRequest(BaseModel):
    user_id: str
    password: str
    role: str  # student, teacher, admin


class LoginResponse(BaseModel):
    success: bool
    user_id: str
    role: str
    profile: dict


class RegisterRequest(BaseModel):
    user_id: str
    email: str
    password: str
    role: str
    name: str


def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """User login"""
    
    # Hash the provided password
    password_hash = hash_password(request.password)
    
    # Find user
    user = db.query(User).filter(
        User.user_id == request.user_id,
        User.password_hash == password_hash,
        User.role == request.role,
        User.is_active == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials or inactive account"
        )
    
    # Get profile based on role
    profile = {}
    
    if user.role == "student":
        student = db.query(Student).filter(Student.user_id == user.id).first()
        if student:
            profile = {
                "id": student.id,
                "roll_number": student.roll_number,
                "name": student.name,
                "email": student.email,
                "phone": student.phone,
                "semester": student.semester,
                "class_section": student.class_section,
                "department": student.department,
                "attendance_percentage": student.attendance_percentage
            }
    
    elif user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        if teacher:
            profile = {
                "id": teacher.id,
                "teacher_id": teacher.teacher_id,
                "name": teacher.name,
                "email": teacher.email,
                "phone": teacher.phone,
                "department": teacher.department
            }
    
    elif user.role == "admin":
        profile = {
            "user_id": user.user_id,
            "email": user.email,
            "role": "admin"
        }
    
    return LoginResponse(
        success=True,
        user_id=user.user_id,
        role=user.role,
        profile=profile
    )


@router.post("/register", response_model=dict)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register new user"""
    
    # Check if user_id already exists
    existing = db.query(User).filter(User.user_id == request.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User ID already exists")
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == request.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    password_hash = hash_password(request.password)
    
    # Create user
    user = User(
        user_id=request.user_id,
        email=request.email,
        password_hash=password_hash,
        role=request.role,
        is_active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "message": "User registered successfully",
        "user_id": user.user_id,
        "role": user.role
    }


@router.post("/change-password", response_model=dict)
async def change_password(
    user_id: str,
    old_password: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """Change user password"""
    
    # Verify old password
    old_hash = hash_password(old_password)
    user = db.query(User).filter(
        User.user_id == user_id,
        User.password_hash == old_hash
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid current password")
    
    # Update password
    user.password_hash = hash_password(new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}


@router.post("/reset-password", response_model=dict)
async def reset_password(
    email: str,
    db: Session = Depends(get_db)
):
    """Reset password (send email with reset link)"""
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Don't reveal if email exists
        return {"message": "If email exists, password reset link has been sent"}
    
    # In production, send email with reset token
    # For now, generate a new temporary password
    temp_password = f"Temp@{user.user_id[-4:]}"
    user.password_hash = hash_password(temp_password)
    db.commit()
    
    return {
        "message": "Password reset successful",
        "temporary_password": temp_password
    }


@router.get("/profile/{user_id}", response_model=dict)
async def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """Get user profile"""
    
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat()
    }
    
    # Add role-specific details
    if user.role == "student":
        student = db.query(Student).filter(Student.user_id == user.id).first()
        if student:
            profile["student_details"] = {
                "roll_number": student.roll_number,
                "name": student.name,
                "semester": student.semester,
                "class_section": student.class_section,
                "attendance_percentage": student.attendance_percentage
            }
    
    elif user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        if teacher:
            profile["teacher_details"] = {
                "teacher_id": teacher.teacher_id,
                "name": teacher.name,
                "department": teacher.department
            }
    
    return profile


@router.put("/deactivate/{user_id}", response_model=dict)
async def deactivate_user(user_id: str, db: Session = Depends(get_db)):
    """Deactivate user account"""
    
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.commit()
    
    return {"message": "User account deactivated"}


@router.put("/activate/{user_id}", response_model=dict)
async def activate_user(user_id: str, db: Session = Depends(get_db)):
    """Activate user account"""
    
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    db.commit()
    
    return {"message": "User account activated"}


@router.post("/verify-credentials", response_model=dict)
async def verify_credentials(
    user_id: str,
    password: str,
    db: Session = Depends(get_db)
):
    """Verify user credentials without full login"""
    
    password_hash = hash_password(password)
    user = db.query(User).filter(
        User.user_id == user_id,
        User.password_hash == password_hash
    ).first()
    
    return {
        "valid": user is not None,
        "active": user.is_active if user else False
    }
