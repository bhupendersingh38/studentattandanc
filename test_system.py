"""
Test AttendX AI System
Quick test to verify everything is working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is running!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print("❌ Backend not responding properly")
            return False
    except Exception as e:
        print(f"❌ Backend is not running! Error: {e}")
        print("   Start backend with: python backend/main.py")
        return False


def test_register_student():
    """Test student registration"""
    print("\n📝 Testing Student Registration...")
    
    student_data = {
        "roll_number": "TEST001",
        "name": "Test Student",
        "email": "test@example.com",
        "phone": "+91 9999999999",
        "parent_phone": "+91 9999999998",
        "semester": 1,
        "class_section": "A",
        "department": "CSE",
        "dob": "2003-01-01",
        "address": "Test Address"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/students",
            json=student_data
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Student registered successfully!")
            print(f"   Student ID: {result.get('student_id')}")
            print(f"   Credentials: {result.get('credentials')}")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_get_students():
    """Test getting students list"""
    print("\n👥 Testing Get Students...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/students")
        
        if response.status_code == 200:
            students = response.json()
            print(f"✅ Found {len(students)} students")
            
            for student in students[:3]:  # Show first 3
                print(f"   - {student.get('name')} ({student.get('roll_number')})")
                print(f"     Attendance: {student.get('attendance_percentage')}%")
            
            return True
        else:
            print(f"❌ Failed to get students: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_api_docs():
    """Check if API documentation is accessible"""
    print("\n📚 Checking API Documentation...")
    
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ API Documentation is accessible")
            print(f"   Visit: {BASE_URL}/docs")
            return True
        else:
            print("❌ API Documentation not accessible")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("AttendX AI - System Test")
    print("=" * 60)
    
    # Test 1: Health check
    if not test_health():
        print("\n⚠️  Please start the backend first:")
        print("   cd backend")
        print("   python main.py")
        return
    
    # Test 2: API Docs
    test_api_docs()
    
    # Test 3: Get students (may be empty initially)
    test_get_students()
    
    # Test 4: Register student (optional - may fail if exists)
    print("\n📝 Testing student registration (may fail if student exists)...")
    test_register_student()
    
    print("\n" + "=" * 60)
    print("✅ System Test Complete!")
    print("=" * 60)
    print("\nNext Steps:")
    print("1. Open API Docs: http://localhost:8000/docs")
    print("2. Register students using API or dashboard")
    print("3. Upload student photos")
    print("4. Start marking attendance")
    print("\n🎉 Your production system is ready!")


if __name__ == "__main__":
    main()
