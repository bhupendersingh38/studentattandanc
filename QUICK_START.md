# 🚀 AttendX AI - Quick Start Guide

## ✨ Your Complete System is Ready!

---

## 📍 FINAL URLS

### **🎯 Main Application (Open This!)**
```
http://localhost:3000
```

### **🔌 Backend API**
```
http://localhost:8000
```

### **📚 API Documentation**
```
http://localhost:8000/docs
```

---

## 🚀 How to Start (3 Simple Steps)

### **Step 1: Setup Frontend** (One-time only)
Double-click this file:
```
SETUP_FRONTEND.bat
```
Wait for it to install all dependencies (takes 2-3 minutes)

### **Step 2: Start the System**
Double-click this file:
```
START_COMPLETE_SYSTEM.bat
```
This will open 2 terminal windows:
- Terminal 1: Backend (port 8000)
- Terminal 2: Frontend (port 3000)

### **Step 3: Open Your Browser**
Go to:
```
http://localhost:3000
```

---

## 🔑 Login Credentials

### **Student**
- User ID: `21CS001`
- Password: `Std@C001`

### **Teacher**
- User ID: `T001`
- Password: `Tech@T001`

### **Admin**
- User ID: `ADM001`
- Password: `Adm@001`

---

## ✅ What You Get

### **Admin Dashboard**
- ✅ View all students
- ✅ Manage teachers
- ✅ View attendance reports
- ✅ Analytics dashboard
- ✅ System settings

### **Teacher Dashboard**
- ✅ Register students with photos
- ✅ Mark attendance
- ✅ Verify attendance
- ✅ View class reports
- ✅ Send notifications

### **Student Dashboard**
- ✅ Mark attendance with face recognition
- ✅ View attendance history
- ✅ Check timetable
- ✅ See notifications
- ✅ Track attendance percentage

---

## 🎨 Features

✅ **Real Database** - SQLite with data persistence  
✅ **Face Recognition** - AI-powered face detection  
✅ **Liveness Detection** - Prevents photo spoofing  
✅ **Distance Check** - 20m proximity verification  
✅ **SMS Notifications** - Auto alerts to parents  
✅ **Analytics** - Charts and reports  
✅ **Role-Based Access** - Admin/Teacher/Student  
✅ **Responsive Design** - Works on all devices  

---

## 🛠️ Manual Start (Alternative)

If batch files don't work, open 2 terminals:

**Terminal 1 - Backend:**
```cmd
cd backend
python main_production.py
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm run dev
```

Then open: http://localhost:3000

---

## 📝 File Structure

```
📁 Smart Attendance/
├── 🚀 START_COMPLETE_SYSTEM.bat  ← Start everything
├── 📦 SETUP_FRONTEND.bat          ← Install dependencies
├── 📖 QUICK_START.md              ← This guide
├── 📖 COMPLETE_SYSTEM_GUIDE.md    ← Detailed guide
│
├── 📁 backend/                     ← Backend API
│   ├── main_production.py         ← API server
│   ├── database.py                ← Database models
│   ├── attendx_ai.db              ← SQLite database
│   └── api/                       ← API endpoints
│
└── 📁 frontend/                    ← Web Application
    ├── app/                       ← Pages
    │   ├── login/                 ← Login page
    │   ├── dashboard/             ← Dashboard
    │   ├── students/              ← Students page
    │   └── attendance/            ← Attendance page
    └── lib/                       ← API client
```

---

## 🔧 Troubleshooting

### **Problem: "npm is not recognized"**
**Solution:** Install Node.js from https://nodejs.org/

### **Problem: "python is not recognized"**
**Solution:** Install Python from https://www.python.org/

### **Problem: Port already in use**
**Solution:** 
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F

netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Problem: Backend won't start**
**Solution:**
```cmd
cd backend
pip install -r requirements_production.txt
python main_production.py
```

### **Problem: Frontend shows connection error**
**Solution:** Make sure backend is running first (port 8000)

---

## 📞 System Status Check

### **Check Backend Status:**
Open in browser: `http://localhost:8000/health`

Should show:
```json
{
  "status": "healthy",
  "service": "AttendX AI Production API",
  "version": "2.0.0",
  "database": "connected"
}
```

### **Check Frontend:**
Open in browser: `http://localhost:3000`

Should show the login page

---

## 🎉 YOU'RE ALL SET!

### **To Start Using:**

1. ✅ Run `SETUP_FRONTEND.bat` (first time only)
2. ✅ Run `START_COMPLETE_SYSTEM.bat`
3. ✅ Open `http://localhost:3000`
4. ✅ Login and explore!

---

## 📚 Need More Help?

- **Detailed Guide:** Open `COMPLETE_SYSTEM_GUIDE.md`
- **API Docs:** http://localhost:8000/docs
- **System Info:** http://localhost:8000/system/info

---

**Built with FastAPI + Next.js + React + OpenCV + SQLite**

**Enjoy your Smart Attendance System! 🎊**
