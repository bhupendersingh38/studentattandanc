"""
Analytics API endpoints with real database
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import Optional
from datetime import date, datetime, timedelta
import sys
sys.path.append('..')

from database import get_db, Student, AttendanceRecord, Teacher

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    
    # Total students
    total_students = db.query(func.count(Student.id)).scalar()
    
    # Total teachers
    total_teachers = db.query(func.count(Teacher.id)).scalar()
    
    # Today's attendance
    today = date.today().isoformat()
    today_present = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.date == today,
            AttendanceRecord.status == "present"
        )
    ).scalar()
    
    today_absent = total_students - today_present
    
    # Overall attendance percentage
    if total_students > 0:
        avg_attendance = db.query(func.avg(Student.attendance_percentage)).scalar()
        today_percentage = (today_present / total_students * 100) if total_students > 0 else 0
    else:
        avg_attendance = 0
        today_percentage = 0
    
    # At-risk students (below 75%)
    at_risk_count = db.query(func.count(Student.id)).filter(
        Student.attendance_percentage < 75
    ).scalar()
    
    # Pending verifications
    pending_verifications = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.verification_status == "pending"
    ).scalar()
    
    return {
        "total_students": total_students or 0,
        "total_teachers": total_teachers or 0,
        "today_present": today_present or 0,
        "today_absent": today_absent or 0,
        "today_percentage": round(today_percentage, 2),
        "overall_avg_attendance": round(avg_attendance or 0, 2),
        "at_risk_students": at_risk_count or 0,
        "pending_verifications": pending_verifications or 0
    }


@router.get("/at-risk-students")
async def get_at_risk_students(
    threshold: Optional[float] = 75.0,
    db: Session = Depends(get_db)
):
    """Get list of at-risk students (below threshold)"""
    
    students = db.query(Student).filter(
        Student.attendance_percentage < threshold
    ).order_by(Student.attendance_percentage).all()
    
    result = []
    for student in students:
        # Calculate classes needed to reach 75%
        current_attended = student.attended_classes
        total_classes = student.total_classes
        
        # Formula: (current + needed) / (total + needed) = 0.75
        # needed = (0.75 * total - current) / 0.25
        if total_classes > 0:
            classes_needed = max(0, int((0.75 * total_classes - current_attended) / 0.25))
        else:
            classes_needed = 0
        
        result.append({
            "id": student.id,
            "roll_number": student.roll_number,
            "name": student.name,
            "semester": student.semester,
            "class_section": student.class_section,
            "attendance_percentage": round(student.attendance_percentage, 2),
            "total_classes": student.total_classes,
            "attended_classes": student.attended_classes,
            "classes_needed": classes_needed,
            "status": "critical" if student.attendance_percentage < 60 else "at_risk"
        })
    
    return {
        "threshold": threshold,
        "count": len(result),
        "students": result
    }


@router.get("/weekly-trend")
async def get_weekly_attendance_trend(db: Session = Depends(get_db)):
    """Get attendance trend for last 7 days"""
    
    today = date.today()
    result = []
    
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_str = day.isoformat()
        
        present = db.query(func.count(AttendanceRecord.id)).filter(
            and_(
                AttendanceRecord.date == day_str,
                AttendanceRecord.status == "present"
            )
        ).scalar()
        
        total_students = db.query(func.count(Student.id)).scalar()
        percentage = (present / total_students * 100) if total_students > 0 else 0
        
        result.append({
            "date": day_str,
            "day": day.strftime("%A"),
            "present": present or 0,
            "total": total_students or 0,
            "percentage": round(percentage, 2)
        })
    
    return result


@router.get("/monthly-report")
async def get_monthly_report(
    year: Optional[int] = None,
    month: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get monthly attendance report"""
    
    if not year or not month:
        today = date.today()
        year = today.year
        month = today.month
    
    # Get date range
    first_day = date(year, month, 1).isoformat()
    if month == 12:
        last_day = date(year + 1, 1, 1).isoformat()
    else:
        last_day = date(year, month + 1, 1).isoformat()
    
    # Total attendance in month
    records = db.query(AttendanceRecord).filter(
        and_(
            AttendanceRecord.date >= first_day,
            AttendanceRecord.date < last_day
        )
    ).all()
    
    # Group by date
    daily_stats = {}
    for record in records:
        if record.date not in daily_stats:
            daily_stats[record.date] = {"present": 0, "total": 0}
        if record.status == "present":
            daily_stats[record.date]["present"] += 1
        daily_stats[record.date]["total"] += 1
    
    # Format result
    result = []
    for day_str, stats in sorted(daily_stats.items()):
        percentage = (stats["present"] / stats["total"] * 100) if stats["total"] > 0 else 0
        result.append({
            "date": day_str,
            "present": stats["present"],
            "total": stats["total"],
            "percentage": round(percentage, 2)
        })
    
    # Summary
    total_records = len(records)
    total_present = sum(1 for r in records if r.status == "present")
    avg_percentage = (total_present / total_records * 100) if total_records > 0 else 0
    
    return {
        "year": year,
        "month": month,
        "total_records": total_records,
        "total_present": total_present,
        "average_percentage": round(avg_percentage, 2),
        "daily_breakdown": result
    }


@router.get("/class-wise")
async def get_class_wise_statistics(db: Session = Depends(get_db)):
    """Get class-wise attendance statistics"""
    
    # Group by semester and class
    students = db.query(Student).all()
    
    class_stats = {}
    for student in students:
        key = f"Sem {student.semester} - Class {student.class_section}"
        
        if key not in class_stats:
            class_stats[key] = {
                "semester": student.semester,
                "class_section": student.class_section,
                "total_students": 0,
                "avg_attendance": 0,
                "sum_attendance": 0
            }
        
        class_stats[key]["total_students"] += 1
        class_stats[key]["sum_attendance"] += student.attendance_percentage
    
    # Calculate averages
    result = []
    for key, stats in class_stats.items():
        if stats["total_students"] > 0:
            stats["avg_attendance"] = stats["sum_attendance"] / stats["total_students"]
        
        result.append({
            "class": key,
            "semester": stats["semester"],
            "class_section": stats["class_section"],
            "total_students": stats["total_students"],
            "average_attendance": round(stats["avg_attendance"], 2)
        })
    
    return sorted(result, key=lambda x: (x["semester"], x["class_section"]))


@router.get("/subject-wise")
async def get_subject_wise_statistics(
    semester: Optional[int] = None,
    class_section: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get subject-wise attendance statistics"""
    
    query = db.query(
        AttendanceRecord.subject,
        func.count(AttendanceRecord.id).label("total"),
        func.sum(
            func.case((AttendanceRecord.status == "present", 1), else_=0)
        ).label("present")
    )
    
    if semester or class_section:
        query = query.join(Student)
        
        if semester:
            query = query.filter(Student.semester == semester)
        
        if class_section:
            query = query.filter(Student.class_section == class_section)
    
    records = query.group_by(AttendanceRecord.subject).all()
    
    result = []
    for record in records:
        percentage = (record.present / record.total * 100) if record.total > 0 else 0
        result.append({
            "subject": record.subject,
            "total_classes": record.total,
            "total_present": record.present,
            "attendance_percentage": round(percentage, 2)
        })
    
    return sorted(result, key=lambda x: x["subject"])


@router.get("/teacher-summary/{teacher_id}")
async def get_teacher_summary(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    """Get summary for a specific teacher"""
    
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        return {"error": "Teacher not found"}
    
    # Total classes conducted
    total_classes = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.teacher_id == teacher_id
    ).scalar()
    
    # Total students taught (unique)
    unique_students = db.query(func.count(func.distinct(AttendanceRecord.student_id))).filter(
        AttendanceRecord.teacher_id == teacher_id
    ).scalar()
    
    # Pending verifications
    pending = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.teacher_id == teacher_id,
            AttendanceRecord.verification_status == "pending"
        )
    ).scalar()
    
    # Today's classes
    today = date.today().isoformat()
    today_classes = db.query(func.count(AttendanceRecord.id)).filter(
        and_(
            AttendanceRecord.teacher_id == teacher_id,
            AttendanceRecord.date == today
        )
    ).scalar()
    
    return {
        "teacher_id": teacher_id,
        "teacher_name": teacher.name,
        "department": teacher.department,
        "total_classes_conducted": total_classes or 0,
        "unique_students_taught": unique_students or 0,
        "pending_verifications": pending or 0,
        "today_classes": today_classes or 0
    }


@router.get("/generate-report")
async def generate_report(
    report_type: str,  # daily, weekly, monthly, custom
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    semester: Optional[int] = None,
    class_section: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Generate attendance report"""
    
    # Determine date range
    if report_type == "daily":
        start_date = end_date = date.today().isoformat()
    elif report_type == "weekly":
        end_date = date.today().isoformat()
        start_date = (date.today() - timedelta(days=7)).isoformat()
    elif report_type == "monthly":
        today = date.today()
        start_date = today.replace(day=1).isoformat()
        end_date = today.isoformat()
    
    # Query attendance records
    query = db.query(AttendanceRecord).filter(
        AttendanceRecord.date >= start_date,
        AttendanceRecord.date <= end_date
    )
    
    if semester or class_section:
        query = query.join(Student)
        
        if semester:
            query = query.filter(Student.semester == semester)
        
        if class_section:
            query = query.filter(Student.class_section == class_section)
    
    records = query.all()
    
    # Calculate statistics
    total_records = len(records)
    present_count = sum(1 for r in records if r.status == "present")
    absent_count = total_records - present_count
    
    avg_confidence = sum(r.confidence_score for r in records) / total_records if total_records > 0 else 0
    liveness_pass_rate = sum(1 for r in records if r.liveness_passed) / total_records * 100 if total_records > 0 else 0
    distance_verify_rate = sum(1 for r in records if r.distance_verified) / total_records * 100 if total_records > 0 else 0
    
    return {
        "report_type": report_type,
        "date_range": {
            "start": start_date,
            "end": end_date
        },
        "filters": {
            "semester": semester,
            "class_section": class_section
        },
        "summary": {
            "total_records": total_records,
            "present": present_count,
            "absent": absent_count,
            "attendance_rate": round(present_count / total_records * 100, 2) if total_records > 0 else 0
        },
        "quality_metrics": {
            "avg_confidence_score": round(avg_confidence, 2),
            "liveness_pass_rate": round(liveness_pass_rate, 2),
            "distance_verify_rate": round(distance_verify_rate, 2)
        },
        "generated_at": datetime.now().isoformat()
    }
