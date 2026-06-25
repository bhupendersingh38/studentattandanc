"""
Attendance API endpoints with real database
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date
import sys
sys.path.append('..')

from database import get_db, AttendanceRecord, Student, Teacher

router = APIRouter()


# Models
class AttendanceMarkRequest(BaseModel):
    student_id: int
    teacher_id: int
    subject: str
    confidence_score: float
    liveness_passed: bool
    distance_verified: bool


class AttendanceVerifyRequest(BaseModel):
    attendance_id: int
    status: str  # approved, rejected
    notes: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    teacher_id: int
    date: str
    time: str
    subject: str
    status: str
    confidence_score: float
    liveness_passed: bool
    distance_verified: bool
    verification_status: str
    
    class Config:
        from_attributes = True


@router.post("/mark", response_model=dict)
async def mark_attendance(
    request: AttendanceMarkRequest,
    db: Session = Depends(get_db)
):
    """Mark student attendance with face recognition"""
    
    # Verify student exists
    student = db.query(Student).filter(Student.id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Verify teacher exists
    teacher = db.query(Teacher).filter(Teacher.id == request.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Check if already marked today
    today = date.today().isoformat()
    existing = db.query(AttendanceRecord).filter(
        and_(
            AttendanceRecord.student_id == request.student_id,
            AttendanceRecord.date == today,
            AttendanceRecord.subject == request.subject
        )
    ).first()
    
    if existing:
        return {
            "message": "Attendance already marked for today",
            "attendance_id": existing.id,
            "status": "duplicate"
        }
    
    # Create attendance record
    now = datetime.now()
    attendance = AttendanceRecord(
        student_id=request.student_id,
        teacher_id=request.teacher_id,
        date=today,
        time=now.strftime("%H:%M:%S"),
        subject=request.subject,
        status="present",
        confidence_score=request.confidence_score,
        liveness_passed=request.liveness_passed,
        distance_verified=request.distance_verified,
        verification_status="pending"
    )
    
    db.add(attendance)
    
    # Update student statistics
    student.total_classes += 1
    student.attended_classes += 1
    student.attendance_percentage = (student.attended_classes / student.total_classes) * 100
    
    db.commit()
    db.refresh(attendance)
    
    return {
        "message": "Attendance marked successfully",
        "attendance_id": attendance.id,
        "status": "success",
        "requires_verification": True
    }


@router.post("/verify", response_model=dict)
async def verify_attendance(
    request: AttendanceVerifyRequest,
    teacher_id: int,
    db: Session = Depends(get_db)
):
    """Teacher verifies attendance (approve/reject)"""
    
    attendance = db.query(AttendanceRecord).filter(
        AttendanceRecord.id == request.attendance_id
    ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    # Update verification status
    attendance.verification_status = request.status
    attendance.verified_by = teacher_id
    attendance.verified_at = datetime.now()
    attendance.notes = request.notes
    
    # If rejected, update student statistics
    if request.status == "rejected":
        student = db.query(Student).filter(Student.id == attendance.student_id).first()
        if student:
            student.attended_classes -= 1
            student.attendance_percentage = (student.attended_classes / student.total_classes) * 100
    
    db.commit()
    
    return {
        "message": f"Attendance {request.status}",
        "attendance_id": attendance.id,
        "status": request.status
    }


@router.get("/today", response_model=List[AttendanceResponse])
async def get_today_attendance(
    semester: Optional[int] = None,
    class_section: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get today's attendance records"""
    
    today = date.today().isoformat()
    
    query = db.query(AttendanceRecord).filter(AttendanceRecord.date == today)
    
    if semester or class_section:
        query = query.join(Student)
        
        if semester:
            query = query.filter(Student.semester == semester)
        
        if class_section:
            query = query.filter(Student.class_section == class_section)
    
    records = query.order_by(AttendanceRecord.time.desc()).all()
    
    return records


@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
async def get_student_attendance(
    student_id: int,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get attendance history for a student"""
    
    query = db.query(AttendanceRecord).filter(
        AttendanceRecord.student_id == student_id
    )
    
    if start_date:
        query = query.filter(AttendanceRecord.date >= start_date)
    
    if end_date:
        query = query.filter(AttendanceRecord.date <= end_date)
    
    records = query.order_by(AttendanceRecord.date.desc()).all()
    
    return records


@router.get("/pending-verification", response_model=List[AttendanceResponse])
async def get_pending_verification(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    """Get attendance records pending teacher verification"""
    
    records = db.query(AttendanceRecord).filter(
        and_(
            AttendanceRecord.teacher_id == teacher_id,
            AttendanceRecord.verification_status == "pending"
        )
    ).order_by(AttendanceRecord.created_at.desc()).all()
    
    return records


@router.get("/statistics/{student_id}", response_model=dict)
async def get_attendance_statistics(
    student_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed attendance statistics for a student"""
    
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Total records
    total = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.student_id == student_id
    ).scalar()
    
    # Present records
    present = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.status == "present",
            AttendanceRecord.verification_status == "approved"
        )
    ).scalar()
    
    # Pending verification
    pending = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.verification_status == "pending"
        )
    ).scalar()
    
    # Rejected
    rejected = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.verification_status == "rejected"
        )
    ).scalar()
    
    # This month
    today = date.today()
    first_day = today.replace(day=1).isoformat()
    this_month = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.date >= first_day,
            AttendanceRecord.status == "present"
        )
    ).scalar()
    
    return {
        "student_id": student_id,
        "student_name": student.name,
        "roll_number": student.roll_number,
        "total_records": total,
        "present_approved": present,
        "pending_verification": pending,
        "rejected": rejected,
        "this_month": this_month,
        "attendance_percentage": student.attendance_percentage,
        "total_classes": student.total_classes,
        "attended_classes": student.attended_classes,
        "status": "safe" if student.attendance_percentage >= 75 else "at_risk"
    }


@router.get("/subject-wise/{student_id}", response_model=dict)
async def get_subject_wise_attendance(
    student_id: int,
    db: Session = Depends(get_db)
):
    """Get subject-wise attendance for a student"""
    
    records = db.query(
        AttendanceRecord.subject,
        func.count(AttendanceRecord.id).label("total"),
        func.sum(
            func.case((AttendanceRecord.status == "present", 1), else_=0)
        ).label("present")
    ).filter(
        AttendanceRecord.student_id == student_id
    ).group_by(AttendanceRecord.subject).all()
    
    subject_data = []
    for record in records:
        percentage = (record.present / record.total * 100) if record.total > 0 else 0
        subject_data.append({
            "subject": record.subject,
            "total_classes": record.total,
            "attended": record.present,
            "percentage": round(percentage, 2)
        })
    
    return {
        "student_id": student_id,
        "subjects": subject_data
    }


@router.delete("/{attendance_id}")
async def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db)
):
    """Delete attendance record (admin only)"""
    
    attendance = db.query(AttendanceRecord).filter(
        AttendanceRecord.id == attendance_id
    ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    # Update student statistics
    student = db.query(Student).filter(Student.id == attendance.student_id).first()
    if student and attendance.status == "present":
        student.total_classes -= 1
        student.attended_classes -= 1
        if student.total_classes > 0:
            student.attendance_percentage = (student.attended_classes / student.total_classes) * 100
        else:
            student.attendance_percentage = 0
    
    db.delete(attendance)
    db.commit()
    
    return {"message": "Attendance record deleted"}
