# 🚀 AttendX AI - Production Setup Guide

## यह Real Production Project है!

### ✅ Features:
- SQLite Database (सारा data store होगा)
- Real Backend APIs
- Face Recognition
- SMS Notifications
- Complete Data Management
- Production Ready

---

## 📦 Installation Steps

### Step 1: Backend Setup

```bash
# Go to backend folder
cd backend

# Install dependencies
pip install fastapi uvicorn sqlalchemy python-multipart pillow opencv-python numpy

# Initialize database
python database.py

# Run backend server
python main.py
```

Backend चलेगा: `http://localhost:8000`

---

### Step 2: AI Engine Setup

```bash
# Go to ai-engine folder
cd ai-engine

# Install AI dependencies
pip install opencv-python numpy pillow tensorflow

# Run AI engine
python main.py
```

AI Engine चलेगा: `http://localhost:8001`

---

### Step 3: Frontend Options

#### Option A: React Frontend (Recommended)

```bash
# Create React app
npx create-react-app attendx-frontend
cd attendx-frontend

# Install dependencies
npm install axios react-router-dom recharts framer-motion

# Start development server
npm start
```

Frontend चलेगा: `http://localhost:3000`

#### Option B: Use HTML Dashboards (Already Created)

Simply open:
- `login.html` - Login page
- `admin-dashboard.html` - Admin
- `teacher-dashboard.html` - Teacher  
- `student-dashboard.html` - Student

---

## 🗄️ Database Structure

### Tables Created:
1. **users** - Login accounts (admin, teacher, student)
2. **students** - Student profiles with photos
3. **teachers** - Teacher profiles
4. **attendance_records** - All attendance data
5. **notifications** - SMS/Email notifications
6. **timetables** - Class schedules

### Data Storage:
- Database: `attendx_ai.db` (SQLite)
- Photos: `uploads/student_photos/`
- All data persists permanently

---

## 🔧 Configuration

### Backend (`backend/database.py`):
```python
DATABASE_URL = "sqlite:///./attendx_ai.db"
```

### Ports:
- Backend: 8000
- AI Engine: 8001
- Frontend: 3000

---

## 📱 API Endpoints

### Students:
- `GET /api/v1/students` - Get all students
- `POST /api/v1/students` - Register new student
- `POST /api/v1/students/{id}/photo` - Upload photo
- `GET /api/v1/students/{id}` - Get student details
- `PUT /api/v1/students/{id}` - Update student
- `DELETE /api/v1/students/{id}` - Delete student

### Attendance:
- `POST /api/v1/attendance/mark` - Mark attendance
- `GET /api/v1/attendance/today` - Today's attendance
- `GET /api/v1/attendance/student/{id}` - Student history
- `POST /api/v1/attendance/verify` - Teacher verification

### Analytics:
- `GET /api/v1/analytics/dashboard` - Dashboard stats
- `GET /api/v1/analytics/reports` - Generate reports
- `GET /api/v1/analytics/at-risk` - At-risk students

---

## 🎯 How to Use

### 1. Register Student (Teacher):
```python
import requests

data = {
    "roll_number": "21CS001",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "phone": "+91 9876543210",
    "parent_phone": "+91 9876543211",
    "semester": 1,
    "class_section": "A",
    "department": "CSE",
    "dob": "2003-01-01",
    "address": "123 Main St"
}

response = requests.post("http://localhost:8000/api/v1/students", json=data)
print(response.json())
# Returns: credentials (user_id, password)
```

### 2. Upload Photo:
```python
with open("student_photo.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post(
        f"http://localhost:8000/api/v1/students/1/photo",
        files=files
    )
```

### 3. Mark Attendance:
```python
data = {
    "student_id": 1,
    "subject": "Data Structures",
    "confidence": 95.5,
    "liveness_passed": True,
    "distance_verified": True
}

response = requests.post("http://localhost:8000/api/v1/attendance/mark", json=data)
```

---

## 🔒 Security

### Password Hashing:
- SHA256 encryption
- Secure storage in database

### Authentication:
- Session management
- Role-based access (admin/teacher/student)

### Data Protection:
- All data in SQLite database
- Face encodings encrypted
- Photos stored securely

---

## 📊 Data Flow

```
Student Registration
↓
Photo Upload
↓
Face Encoding (AI)
↓
Store in Database
↓
Mark Attendance (Face Recognition)
↓
Verify by Teacher
↓
Update Statistics
↓
Send SMS Notification
```

---

## 🚀 Production Deployment

### Option 1: Local Server
```bash
# Already set up!
# Just run the backend and AI engine
```

### Option 2: Cloud Deployment (Future)
- Deploy backend to Heroku/AWS
- Deploy AI engine separately
- Deploy frontend to Vercel/Netlify
- Use PostgreSQL instead of SQLite

---

## 📝 Important Files

### Backend:
- `database.py` - Database models and setup
- `main.py` - FastAPI application
- `api/students_new.py` - Student APIs
- `api/attendance.py` - Attendance APIs

### Database:
- `attendx_ai.db` - SQLite database file (auto-created)

### Uploads:
- `uploads/student_photos/` - Student photos directory

---

## ✅ Testing

### Test Backend:
```bash
curl http://localhost:8000/health
```

### Test Student API:
```bash
curl http://localhost:8000/api/v1/students
```

### API Documentation:
Open: `http://localhost:8000/docs`

---

## 🎉 Ready to Use!

1. ✅ Run `python backend/database.py` to create database
2. ✅ Run `python backend/main.py` to start backend
3. ✅ Run `python ai-engine/main.py` to start AI engine
4. ✅ Open browser and test APIs
5. ✅ Start frontend (React or HTML)

---

## 🆘 Troubleshooting

### Database not created?
```bash
cd backend
python database.py
```

### Import errors?
```bash
pip install -r requirements.txt
```

### Port already in use?
```bash
# Change port in main.py:
uvicorn.run("main:app", host="0.0.0.0", port=8002)
```

---

## 📞 Support

- API Docs: http://localhost:8000/docs
- Database: Check `attendx_ai.db` file
- Logs: Check terminal output

---

**यह अब Real Production Project है! सारा data database में store होगा!** 🎉
