"""
Timetable Management APIs
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, Timetable
from typing import Optional

router = APIRouter()

class TimetableCreate(BaseModel):
    semester: int
    class_section: str
    day: str
    time_slot: str
    subject: str
    teacher_id: int

class TimetableUpdate(BaseModel):
    semester: Optional[int] = None
    class_section: Optional[str] = None
    day: Optional[str] = None
    time_slot: Optional[str] = None
    subject: Optional[str] = None
    teacher_id: Optional[int] = None

@router.post("/")
async def create_timetable(data: TimetableCreate, db: Session = Depends(get_db)):
    """Create new timetable entry"""
    timetable = Timetable(**data.dict())
    db.add(timetable)
    db.commit()
    db.refresh(timetable)
    
    return {
        "message": "Timetable entry created successfully",
        "timetable_id": timetable.id
    }

@router.get("/")
async def get_timetable(
    semester: Optional[int] = None,
    class_section: Optional[str] = None,
    day: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get timetable with optional filters"""
    query = db.query(Timetable)
    
    if semester:
        query = query.filter(Timetable.semester == semester)
    if class_section:
        query = query.filter(Timetable.class_section == class_section)
    if day:
        query = query.filter(Timetable.day == day)
    
    timetables = query.order_by(Timetable.day, Timetable.time_slot).all()
    
    return [
        {
            "id": t.id,
            "semester": t.semester,
            "class_section": t.class_section,
            "day": t.day,
            "time_slot": t.time_slot,
            "subject": t.subject,
            "teacher_id": t.teacher_id,
            "created_at": t.created_at
        }
        for t in timetables
    ]

@router.get("/{id}")
async def get_timetable_by_id(id: int, db: Session = Depends(get_db)):
    """Get specific timetable entry"""
    timetable = db.query(Timetable).filter(Timetable.id == id).first()
    if not timetable:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    
    return {
        "id": timetable.id,
        "semester": timetable.semester,
        "class_section": timetable.class_section,
        "day": timetable.day,
        "time_slot": timetable.time_slot,
        "subject": timetable.subject,
        "teacher_id": timetable.teacher_id,
        "created_at": timetable.created_at
    }

@router.put("/{id}")
async def update_timetable(id: int, data: TimetableUpdate, db: Session = Depends(get_db)):
    """Update timetable entry (Admin only)"""
    timetable = db.query(Timetable).filter(Timetable.id == id).first()
    if not timetable:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(timetable, key, value)
    
    db.commit()
    return {"message": "Timetable updated successfully"}

@router.delete("/{id}")
async def delete_timetable(id: int, db: Session = Depends(get_db)):
    """Delete timetable entry (Admin only)"""
    timetable = db.query(Timetable).filter(Timetable.id == id).first()
    if not timetable:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    
    db.delete(timetable)
    db.commit()
    return {"message": "Timetable entry deleted successfully"}
