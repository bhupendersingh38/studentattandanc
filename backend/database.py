"""
Database setup with SQLite
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database setup
DATABASE_URL = "sqlite:///./attendx_ai.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Models
class User(Base):
    """Base user model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # student, teacher, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False)
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)


class Student(Base):
    """Student profile model"""
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    roll_number = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    parent_phone = Column(String)
    semester = Column(Integer)
    class_section = Column(String)
    department = Column(String)
    dob = Column(String)
    address = Column(Text)
    face_encoding = Column(Text)  # Stored as JSON string
    photo_path = Column(String)
    attendance_percentage = Column(Float, default=0.0)
    total_classes = Column(Integer, default=0)
    attended_classes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="student_profile")
    attendance_records = relationship("AttendanceRecord", back_populates="student")


class Teacher(Base):
    """Teacher profile model"""
    __tablename__ = "teachers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    teacher_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    department = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="teacher_profile")
    attendance_records = relationship("AttendanceRecord", back_populates="teacher", foreign_keys="AttendanceRecord.teacher_id")


class AttendanceRecord(Base):
    """Attendance record model"""
    __tablename__ = "attendance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    date = Column(String)
    time = Column(String)
    subject = Column(String)
    status = Column(String)  # present, absent
    confidence_score = Column(Float)
    liveness_passed = Column(Boolean)
    distance_verified = Column(Boolean)
    verification_status = Column(String)  # pending, approved, rejected
    verified_by = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    teacher = relationship("Teacher", foreign_keys=[teacher_id])


class Notification(Base):
    """Notification model"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    type = Column(String)  # sms, email, push
    status = Column(String)  # sent, pending, failed
    created_at = Column(DateTime, default=datetime.utcnow)


class Timetable(Base):
    """Timetable model"""
    __tablename__ = "timetables"
    
    id = Column(Integer, primary_key=True, index=True)
    semester = Column(Integer)
    class_section = Column(String)
    day = Column(String)
    time_slot = Column(String)
    subject = Column(String)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


# Database initialization
def init_db():
    """Initialize database"""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create tables on import
if __name__ == "__main__":
    init_db()
