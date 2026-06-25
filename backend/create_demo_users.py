"""
Create demo users in the database
"""
import hashlib
from database import SessionLocal, User, Student, Teacher

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_demo_users():
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing = db.query(User).filter(User.user_id.in_(['21CS001', 'T001', 'ADM001'])).all()
        if existing:
            print(f"Found {len(existing)} existing demo users")
            for user in existing:
                print(f"  - {user.user_id} ({user.role})")
        
        # Create Student User
        student_user = db.query(User).filter(User.user_id == '21CS001').first()
        if not student_user:
            student_user = User(
                user_id='21CS001',
                email='student@example.com',
                password_hash=hash_password('Std@C001'),
                role='student',
                is_active=True
            )
            db.add(student_user)
            db.commit()
            db.refresh(student_user)
            print("✓ Created student user: 21CS001")
            
            # Create Student Profile
            student_profile = Student(
                user_id=student_user.id,
                roll_number='21CS001',
                name='Demo Student',
                email='student@example.com',
                phone='+91 9876543210',
                parent_phone='+91 9876543211',
                semester=1,
                class_section='A',
                department='CSE'
            )
            db.add(student_profile)
            db.commit()
            print("✓ Created student profile")
        else:
            print("✓ Student user already exists: 21CS001")
        
        # Create Teacher User
        teacher_user = db.query(User).filter(User.user_id == 'T001').first()
        if not teacher_user:
            teacher_user = User(
                user_id='T001',
                email='teacher@example.com',
                password_hash=hash_password('Tech@T001'),
                role='teacher',
                is_active=True
            )
            db.add(teacher_user)
            db.commit()
            db.refresh(teacher_user)
            print("✓ Created teacher user: T001")
            
            # Create Teacher Profile
            teacher_profile = Teacher(
                user_id=teacher_user.id,
                teacher_id='T001',
                name='Demo Teacher',
                email='teacher@example.com',
                phone='+91 9876543212',
                department='CSE'
            )
            db.add(teacher_profile)
            db.commit()
            print("✓ Created teacher profile")
        else:
            print("✓ Teacher user already exists: T001")
        
        # Create Admin User
        admin_user = db.query(User).filter(User.user_id == 'ADM001').first()
        if not admin_user:
            admin_user = User(
                user_id='ADM001',
                email='admin@example.com',
                password_hash=hash_password('Adm@001'),
                role='admin',
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("✓ Created admin user: ADM001")
        else:
            print("✓ Admin user already exists: ADM001")
        
        print("\n" + "="*50)
        print("Demo Users Ready!")
        print("="*50)
        print("Student: 21CS001 / Std@C001")
        print("Teacher: T001 / Tech@T001")
        print("Admin:   ADM001 / Adm@001")
        print("="*50)
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_users()
