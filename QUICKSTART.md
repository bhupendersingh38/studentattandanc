# 🚀 AttendX AI - Quick Start Guide

## ✅ System Status

### Currently Running Services:

1. **Backend API** ✓ Running on http://localhost:8000
   - FastAPI backend with REST API
   - Demo mode (no database required)
   - All endpoints functional

2. **AI Engine** ✓ Running on http://localhost:8001
   - Face recognition service
   - Liveness detection
   - Prediction engine
   - Engagement analyzer

## 📊 Access the Dashboard

Open the demo dashboard in your browser:

```
file:///C:/Users/dayma/OneDrive/Desktop/Smart Attandance/demo_dashboard.html
```

Or simply double-click the `demo_dashboard.html` file!

## 🔗 Important URLs

- **Backend API Docs**: http://localhost:8000/docs (Swagger UI)
- **Backend Health**: http://localhost:8000/health
- **AI Engine Docs**: http://localhost:8001/docs
- **AI Engine Health**: http://localhost:8001/health

## 🧪 Test the API

### 1. Test Backend Health
```bash
curl http://localhost:8000/health
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### 3. Get Students List
```bash
curl http://localhost:8000/api/v1/students
```

### 4. Get Dashboard Analytics
```bash
curl http://localhost:8000/api/v1/analytics/dashboard
```

### 5. Test AI Engine
```bash
curl http://localhost:8001/health
```

## 📱 Available API Endpoints

### Backend API (Port 8000)

#### Authentication
- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/register` - Register new user
- GET `/api/v1/auth/me` - Get current user

#### Students
- GET `/api/v1/students` - Get all students
- GET `/api/v1/students/{id}` - Get student by ID
- POST `/api/v1/students` - Create new student
- GET `/api/v1/students/{id}/attendance` - Get student attendance

#### Attendance
- POST `/api/v1/attendance/mark` - Mark attendance
- GET `/api/v1/attendance` - Get all attendance records
- GET `/api/v1/attendance/student/{id}` - Get student attendance
- GET `/api/v1/attendance/class/{id}` - Get class attendance

#### Analytics
- GET `/api/v1/analytics/dashboard` - Dashboard statistics
- GET `/api/v1/analytics/trends` - Attendance trends
- GET `/api/v1/analytics/reports` - Generated reports
- POST `/api/v1/analytics/export` - Export reports

#### Notifications
- GET `/api/v1/notifications` - Get notifications
- POST `/api/v1/notifications/send` - Send notification
- PUT `/api/v1/notifications/{id}/read` - Mark as read

#### Predictions
- GET `/api/v1/predictions/at-risk` - Get at-risk students
- GET `/api/v1/predictions/student/{id}` - Predict student attendance

### AI Engine API (Port 8001)

#### Face Recognition
- POST `/api/v1/detect-faces` - Detect faces in image
- POST `/api/v1/recognize` - Recognize students
- POST `/api/v1/enroll` - Enroll new face
- POST `/api/v1/verify-liveness` - Verify liveness
- POST `/api/v1/analyze-engagement` - Analyze engagement
- POST `/api/v1/predict-attendance` - Predict attendance

## 🛠️ Managing Services

### Stop Services
```bash
# In the terminal where services are running:
Press Ctrl+C
```

### View Logs
Backend and AI Engine logs are displayed in their respective terminal windows.

## 📖 Interactive API Documentation

Visit these URLs in your browser for interactive API testing:

- Backend: http://localhost:8000/docs
- AI Engine: http://localhost:8001/docs

You can test all endpoints directly from the browser!

## 🎯 Next Steps

### 1. Create Frontend (Next.js)
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm run dev
```

### 2. Add Database (Optional)
```bash
# Install PostgreSQL
# Create database: attendx_db
# Update backend/core/database.py to enable database
```

### 3. Install Full AI Models
```bash
cd ai-engine
pip install tensorflow torch opencv-python deepface
# Download pre-trained models
```

### 4. Deploy to Production
```bash
docker-compose up -d
```

## 💡 Features Demonstrated

✅ RESTful API design
✅ AI/ML service architecture
✅ Face recognition endpoints
✅ Liveness detection
✅ Attendance prediction
✅ Analytics dashboard
✅ Real-time WebSocket support
✅ Swagger documentation
✅ CORS configuration
✅ Demo mode operation

## 🎨 Demo Dashboard Features

- Real-time server status monitoring
- Interactive API testing
- Visual statistics display
- Glassmorphism UI design
- One-click API tests
- Response display

## 📞 Need Help?

1. Check the API docs: http://localhost:8000/docs
2. Review the logs in terminal windows
3. Check `SETUP_GUIDE.md` for detailed instructions
4. Review `README.md` for architecture overview

## 🎉 Success!

Your AttendX AI system is now running! Both backend and AI engine are operational and ready for development.

**Current Status:**
- ✅ Backend API running on port 8000
- ✅ AI Engine running on port 8001
- ✅ Demo dashboard available
- ✅ All endpoints functional
- ✅ API documentation accessible

Start building your smart attendance system! 🚀
