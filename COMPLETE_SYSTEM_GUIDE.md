# 🚀 AttendX AI - Complete System Guide

## 📋 System Overview

AttendX AI is a **production-ready** Smart Attendance System with:
- ✅ **Backend API** (FastAPI + SQLite) - Running on port 8000
- ✅ **Frontend Web App** (Next.js + React) - Running on port 3000
- ✅ **AI Engine** (Face Recognition + Liveness Detection)
- ✅ **Real Database** (SQLite with 6 tables)
- ✅ **3 Role-Based Dashboards** (Admin, Teacher, Student)

---

## 🎯 Final URLs

### **MAIN APPLICATION URL**
```
http://localhost:3000
```
This is your **final working URL** - Open this in your browser!

### **Backend API**
```
http://localhost:8000
```

### **API Documentation**
```
http://localhost:8000/docs
```
Interactive Swagger UI to test all APIs

---

## 🚀 Quick Start (One Command)

### **Option 1: Start Complete System (Recommended)**
```bash
START_COMPLETE_SYSTEM.bat
```
This will:
1. Start backend on port 8000
2. Start frontend on port 3000
3. Open both in separate terminal windows

### **Option 2: Start Separately**

**Terminal 1 - Backend:**
```bash
cd backend
python main_production.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📱 How to Use

### **Step 1: Open Application**
Open your browser and go to:
```
http://localhost:3000
```

### **Step 2: Login**
Use these demo credentials:

**Student Login:**
- User ID: `21CS001`
- Password: `Std@C001`
- Role: Student

**Teacher Login:**
- User ID: `T001`
- Password: `Tech@T001`
- Role: Teacher

**Admin Login:**
- User ID: `ADM001`
- Password: `Adm@001`
- Role: Admin

### **Step 3: Explore Features**

#### **Admin Dashboard**
- View all students and teachers
- Manage attendance records
- View analytics and reports
- Add/Edit/Delete students
- Configure timetable

#### **Teacher Dashboard**
- Register new students with photos
- Mark attendance
- Verify attendance records
- View class-wise reports
- Send notifications

#### **Student Dashboard**
- Mark attendance using face recognition
- View attendance history
- Check timetable
- View notifications
- Track attendance percentage

---

## 🔌 API Endpoints

### **Authentication**
```
POST /api/v1/auth/login          # Login
POST /api/v1/auth/register       # Register new user
GET  /api/v1/auth/profile/{id}   # Get profile
POST /api/v1/auth/change-password # Change password
```

### **Students**
```
GET    /api/v1/students                 # Get all students
GET    /api/v1/students/{id}           # Get student by ID
POST   /api/v1/students                 # Register student
PUT    /api/v1/students/{id}           # Update student
DELETE /api/v1/students/{id}           # Delete student
POST   /api/v1/students/{id}/photo     # Upload photo
```

### **Attendance**
```
POST   /api/v1/attendance/mark                      # Mark attendance
POST   /api/v1/attendance/verify                    # Verify attendance
GET    /api/v1/attendance/today                     # Today's attendance
GET    /api/v1/attendance/student/{id}              # Student history
GET    /api/v1/attendance/pending-verification      # Pending verifications
GET    /api/v1/attendance/statistics/{student_id}   # Student stats
```

### **Analytics**
```
GET /api/v1/analytics/dashboard          # Dashboard stats
GET /api/v1/analytics/at-risk-students   # At-risk students
GET /api/v1/analytics/weekly-trend       # Weekly trend
GET /api/v1/analytics/monthly-report     # Monthly report
GET /api/v1/analytics/class-wise         # Class-wise stats
GET /api/v1/analytics/subject-wise       # Subject-wise stats
```

---

## 🎨 Features

### **Face Recognition**
- Real-time face detection
- Face encoding and matching
- Confidence score calculation
- Multi-face detection

### **Liveness Detection**
- Eye blink detection
- Head movement verification
- Prevents photo spoofing
- Ensures real person

### **Distance Verification**
- 20-meter proximity check
- GPS-based verification
- Prevents proxy attendance

### **Notifications**
- SMS to parents
- Email notifications
- Push notifications
- Daily updates

### **Analytics**
- Attendance trends
- At-risk students
- Class-wise reports
- Subject-wise reports
- Teacher performance

### **Security**
- Password hashing (SHA256)
- SQL injection protection
- Role-based access control
- Session management

---

## 📊 Database Schema

### **Tables**
1. **users** - User accounts (student/teacher/admin)
2. **students** - Student profiles and photos
3. **teachers** - Teacher profiles
4. **attendance_records** - All attendance entries
5. **notifications** - SMS/Email notifications
6. **timetables** - Class schedules

---

## 🛠️ Technology Stack

### **Backend**
- **Framework:** FastAPI (Python)
- **Database:** SQLite (SQLAlchemy ORM)
- **AI:** OpenCV, Face Recognition
- **APIs:** RESTful JSON APIs

### **Frontend**
- **Framework:** Next.js 14 (React 18)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **State:** Zustand
- **HTTP:** Axios

---

## 📁 Project Structure

```
Smart Attendance/
├── backend/                    # Backend API
│   ├── main_production.py     # Main FastAPI app
│   ├── database.py            # Database models
│   ├── attendx_ai.db          # SQLite database
│   ├── api/                   # API endpoints
│   │   ├── auth_new.py
│   │   ├── students_new.py
│   │   ├── attendance_new.py
│   │   └── analytics_new.py
│   └── uploads/               # Student photos
│
├── frontend/                   # Next.js Frontend
│   ├── app/                   # Pages
│   │   ├── login/            # Login page
│   │   ├── dashboard/        # Dashboard
│   │   ├── students/         # Students page
│   │   └── attendance/       # Attendance page
│   ├── components/           # React components
│   ├── lib/                  # API clients & store
│   └── package.json
│
├── START_COMPLETE_SYSTEM.bat  # One-click starter
└── COMPLETE_SYSTEM_GUIDE.md  # This file
```

---

## 🔧 Troubleshooting

### **Problem: Backend not starting**
```bash
cd backend
pip install -r requirements_production.txt
python database.py
python main_production.py
```

### **Problem: Frontend not starting**
```bash
cd frontend
npm install
npm run dev
```

### **Problem: Database doesn't exist**
```bash
cd backend
python database.py
```

### **Problem: Port already in use**
```bash
# For Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Problem: Cannot connect to backend**
- Make sure backend is running on port 8000
- Check `.env.local` file in frontend folder
- Verify `NEXT_PUBLIC_API_URL=http://localhost:8000`

---

## 📝 Demo Workflow

### **As Admin:**
1. Login at http://localhost:3000/login
2. View dashboard with all stats
3. Navigate to Students page
4. Add new students with photos
5. View analytics and reports

### **As Teacher:**
1. Login with teacher credentials
2. Register new students
3. Upload student photos
4. Mark attendance for class
5. Verify pending attendance

### **As Student:**
1. Login with student credentials
2. View personal dashboard
3. Mark attendance using webcam
4. Check attendance history
5. View timetable

---

## 🎉 Success Indicators

✅ Backend running on http://localhost:8000  
✅ Frontend running on http://localhost:3000  
✅ Database file exists: `backend/attendx_ai.db`  
✅ Can login with demo credentials  
✅ Dashboard loads with data  
✅ Can view students list  
✅ Webcam works on attendance page  
✅ API docs accessible at /docs  

---

## 🌐 Deployment (Future)

### **Backend Deployment:**
- Deploy to Heroku/Railway/AWS
- Change SQLite to PostgreSQL
- Set environment variables
- Configure CORS origins

### **Frontend Deployment:**
- Deploy to Vercel/Netlify
- Update API URL in .env
- Build for production: `npm run build`

---

## 📞 Support

### **Check System Health:**
```
http://localhost:8000/health
```

### **View System Info:**
```
http://localhost:8000/system/info
```

### **Interactive API Docs:**
```
http://localhost:8000/docs
```

---

## 🎊 YOU NOW HAVE A COMPLETE WORKING SYSTEM!

**Main Application:** http://localhost:3000  
**Backend API:** http://localhost:8000  
**API Documentation:** http://localhost:8000/docs  

**Start the system with:**
```
START_COMPLETE_SYSTEM.bat
```

**Then open your browser and go to:**
```
http://localhost:3000
```

**Login with demo credentials and explore!**

---

**Built with ❤️ using FastAPI + Next.js + OpenCV + SQLite**
