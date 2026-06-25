// Teacher Dashboard JavaScript
const API_URL = 'http://localhost:8000';
const AI_URL = 'http://localhost:8001';

// Global state
let teacherData = {
    id: 'T001',
    name: 'Teacher Name',
    students: []
};
let videoStream = null;
let isScanning = false;
let recognizedToday = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTeacher();
    setupNavigation();
    loadTeacherData();
    setupEventListeners();
});

function initializeTeacher() {
    console.log('Teacher Dashboard Initialized');
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadTeacherProfile();
}

function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const time = now.toLocaleTimeString('en-US');
    
    const dateEl = document.getElementById('currentDate');
    const timeEl = document.getElementById('currentTime');
    if (dateEl) dateEl.textContent = date;
    if (timeEl) timeEl.textContent = time;
}

function loadTeacherProfile() {
    document.getElementById('teacherName').textContent = teacherData.name;
    document.getElementById('teacherId').textContent = 'ID: ' + teacherData.id;
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(page + '-page').classList.add('active');
            
            document.getElementById('pageTitle').textContent = this.textContent.trim();
            
            loadPageData(page);
        });
    });
}

function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'register-student':
            setupStudentRegistration();
            break;
        case 'my-students':
            loadMyStudents();
            break;
        case 'mark-attendance':
            setupAttendanceMarking();
            break;
        case 'verify-attendance':
            loadVerifyAttendance();
            break;
        case 'my-classes':
            loadMyClasses();
            break;
    }
}

// Dashboard
function loadTeacherData() {
    document.getElementById('myTotalStudents').textContent = '150';
    document.getElementById('todayPresent').textContent = '135';
    document.getElementById('todayAbsent').textContent = '15';
    document.getElementById('myClasses').textContent = '4';
    
    loadTodaySchedule();
    loadPendingVerifications();
}

function loadDashboardData() {
    loadTeacherData();
}

function loadTodaySchedule() {
    const schedule = [
        { time: '9:00 AM', class: 'Semester 1 - Class A', subject: 'Data Structures' },
        { time: '11:00 AM', class: 'Semester 2 - Class B', subject: 'Algorithms' },
        { time: '2:00 PM', class: 'Semester 3 - Class A', subject: 'Database Systems' }
    ];
    
    const listEl = document.getElementById('todaySchedule');
    if (!listEl) return;
    
    listEl.innerHTML = schedule.map(item => `
        <div class="schedule-item">
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-details">
                <div class="schedule-class">${item.class}</div>
                <div class="schedule-subject">${item.subject}</div>
            </div>
        </div>
    `).join('');
}

function loadPendingVerifications() {
    const pending = [
        { student: 'Rahul Kumar', time: '10 mins ago' },
        { student: 'Priya Sharma', time: '15 mins ago' },
        { student: 'Amit Patel', time: '20 mins ago' }
    ];
    
    const listEl = document.getElementById('pendingVerifications');
    if (!listEl) return;
    
    listEl.innerHTML = pending.map(item => `
        <div class="pending-item">
            <div>
                <div>${item.student}</div>
                <small style="color: var(--text-muted);">${item.time}</small>
            </div>
            <button class="btn-small btn-primary" onclick="verifyStudent('${item.student}')">Verify</button>
        </div>
    `).join('');
}

function verifyStudent(name) {
    alert('Verifying attendance for: ' + name);
}

// Student Registration
function setupStudentRegistration() {
    const form = document.getElementById('studentRegistrationForm');
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPreview.src = e.target.result;
                    photoPreview.style.display = 'block';
                    document.querySelector('.upload-placeholder').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            registerStudent();
        };
    }
}

function generateCredentials() {
    const rollNumber = document.getElementById('rollNumber').value;
    if (!rollNumber) {
        alert('Please enter roll number first');
        return;
    }
    
    const studentID = rollNumber;
    const password = 'Std@' + Math.random().toString(36).substring(2, 8);
    
    document.getElementById('generatedID').value = studentID;
    document.getElementById('generatedPassword').value = password;
}

async function registerStudent() {
    const formData = {
        name: document.getElementById('studentName').value,
        rollNumber: document.getElementById('rollNumber').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        parentPhone: document.getElementById('parentPhone').value,
        semester: document.getElementById('semester').value,
        class: document.getElementById('classSection').value,
        department: document.getElementById('department').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        studentID: document.getElementById('generatedID').value,
        password: document.getElementById('generatedPassword').value
    };
    
    // Validate
    if (!formData.name || !formData.rollNumber) {
        alert('Please fill all required fields');
        return;
    }
    
    if (!formData.studentID || !formData.password) {
        alert('Please generate credentials first');
        return;
    }
    
    try {
        // Simulate API call
        console.log('Registering student:', formData);
        
        // Send SMS to student and parent
        sendSMS(formData.phone, `Welcome ${formData.name}! Your ID: ${formData.studentID}, Password: ${formData.password}`);
        sendSMS(formData.parentPhone, `Your child ${formData.name} registered. ID: ${formData.studentID}`);
        
        alert('Student registered successfully! SMS sent to student and parent.');
        document.getElementById('studentRegistrationForm').reset();
        
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Failed to register student');
    }
}

function sendSMS(phone, message) {
    console.log(`SMS to ${phone}: ${message}`);
    // Simulate SMS sending
}

// My Students
function loadMyStudents() {
    const students = [
        { id: 1, name: 'Rahul Kumar', roll: '21CS001', semester: 1, class: 'A', attendance: 92, photo: '📷' },
        { id: 2, name: 'Priya Sharma', roll: '21CS002', semester: 1, class: 'A', attendance: 88, photo: '📷' },
        { id: 3, name: 'Amit Patel', roll: '21CS003', semester: 1, class: 'A', attendance: 75, photo: '📷' },
        { id: 4, name: 'Sneha Reddy', roll: '21CS004', semester: 2, class: 'B', attendance: 95, photo: '📷' }
    ];
    
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;
    
    grid.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-photo">
                <span style="font-size: 48px;">${student.photo}</span>
            </div>
            <div class="student-name">${student.name}</div>
            <div class="student-roll">${student.roll}</div>
            <div class="student-info">
                <div class="info-row">
                    <span class="info-label">Semester:</span>
                    <span class="info-value">${student.semester}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Class:</span>
                    <span class="info-value">${student.class}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Attendance:</span>
                    <span class="info-value">${student.attendance}%</span>
                </div>
            </div>
            <div class="attendance-bar">
                <div class="attendance-fill" style="width: ${student.attendance}%"></div>
            </div>
            <div class="student-actions">
                <button class="btn-small btn-primary" onclick="viewStudentDetails(${student.id})">View</button>
                <button class="btn-small btn-secondary" onclick="editStudentDetails(${student.id})">Edit</button>
            </div>
        </div>
    `).join('');
}

function sortStudents(by) {
    alert('Sorting students by: ' + by);
    loadMyStudents();
}

function viewStudentDetails(id) {
    alert('Viewing student ID: ' + id);
}

function editStudentDetails(id) {
    alert('Editing student ID: ' + id);
}

// Mark Attendance
function setupAttendanceMarking() {
    const startBtn = document.getElementById('startCamera');
    const scanBtn = document.getElementById('scanFace');
    const stopBtn = document.getElementById('stopCamera');
    
    if (startBtn) {
        startBtn.onclick = startCamera;
    }
    if (scanBtn) {
        scanBtn.onclick = scanAndRecognize;
    }
    if (stopBtn) {
        stopBtn.onclick = stopCamera;
    }
    
    checkTeacherDistance();
}

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 } 
        });
        
        const video = document.getElementById('webcam');
        video.srcObject = videoStream;
        
        console.log('Camera started');
    } catch (error) {
        console.error('Camera error:', error);
        alert('Failed to access camera');
    }
}

async function scanAndRecognize() {
    if (!videoStream) {
        alert('Please start camera first');
        return;
    }
    
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    
    try {
        // Simulate face recognition
        const result = await recognizeFace(imageData);
        
        if (result.success) {
            addToAttendanceList(result);
            updateAttendanceSummary();
        } else {
            alert('Face not recognized or liveness check failed');
        }
    } catch (error) {
        console.error('Recognition error:', error);
    }
}

async function recognizeFace(imageData) {
    // Simulate AI recognition
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        success: Math.random() > 0.2,
        studentName: 'Rahul Kumar',
        studentId: '21CS001',
        confidence: 95,
        liveness: true,
        timestamp: new Date().toLocaleTimeString()
    };
}

function addToAttendanceList(result) {
    recognizedToday.push(result);
    
    const list = document.getElementById('scannedList');
    if (!list) return;
    
    const item = document.createElement('div');
    item.className = 'scanned-item';
    item.innerHTML = `
        <div style="flex: 1;">
            <div style="font-weight: 600;">${result.studentName}</div>
            <div style="font-size: 12px; color: var(--text-muted);">
                ID: ${result.studentId} | Confidence: ${result.confidence}% | ${result.timestamp}
            </div>
        </div>
        <span style="color: var(--success);">✓</span>
    `;
    
    list.insertBefore(item, list.firstChild);
}

function updateAttendanceSummary() {
    document.getElementById('scannedCount').textContent = recognizedToday.length;
    document.getElementById('matchedCount').textContent = recognizedToday.filter(r => r.success).length;
    document.getElementById('failedCount').textContent = recognizedToday.filter(r => !r.success).length;
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        const video = document.getElementById('webcam');
        video.srcObject = null;
    }
}

function checkTeacherDistance() {
    // Simulate distance check using geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                document.getElementById('distanceStatus').innerHTML = `
                    <span class="distance-icon">📍</span>
                    <span style="color: var(--success);">Device location verified</span>
                `;
            },
            error => {
                document.getElementById('distanceStatus').innerHTML = `
                    <span class="distance-icon">📍</span>
                    <span style="color: var(--danger);">Location access denied</span>
                `;
            }
        );
    }
}

// Verify Attendance
function loadVerifyAttendance() {
    const pending = [
        { name: 'Rahul Kumar', roll: '21CS001', time: '9:15 AM', confidence: 95, liveness: true },
        { name: 'Priya Sharma', roll: '21CS002', time: '9:16 AM', confidence: 88, liveness: true },
        { name: 'Amit Patel', roll: '21CS003', time: '9:18 AM', confidence: 72, liveness: false }
    ];
    
    const list = document.getElementById('verifyList');
    if (!list) return;
    
    list.innerHTML = pending.map(item => `
        <div class="verify-item">
            <div class="verify-photo">
                <span style="font-size: 48px;">📷</span>
            </div>
            <div class="verify-details">
                <div class="verify-name">${item.name}</div>
                <div class="verify-meta">
                    <span>Roll: ${item.roll}</span>
                    <span>Time: ${item.time}</span>
                    <span>Confidence: ${item.confidence}%</span>
                    <span>Liveness: ${item.liveness ? '✓' : '✗'}</span>
                </div>
            </div>
            <div class="verify-actions">
                <button class="btn-primary btn-approve" onclick="approveAttendance('${item.roll}')">
                    ✓ Approve
                </button>
                <button class="btn-danger btn-reject" onclick="rejectAttendance('${item.roll}')">
                    ✗ Reject
                </button>
            </div>
        </div>
    `).join('');
}

function approveAttendance(roll) {
    alert('Attendance approved for: ' + roll);
    loadVerifyAttendance();
}

function rejectAttendance(roll) {
    if (confirm('Reject attendance for ' + roll + '? This may indicate proxy attendance.')) {
        alert('Attendance rejected. Admin notified.');
        loadVerifyAttendance();
    }
}

// My Classes
function loadMyClasses() {
    console.log('Loading classes');
}

function viewClassDetails(semester, classSection) {
    alert(`Viewing Semester ${semester} - Class ${classSection}`);
}

// Generate Report
function generateReport() {
    alert('Generating report...');
}

function downloadReport() {
    alert('Downloading report as PDF...');
}

// Event Listeners
function setupEventListeners() {
    const filterSemester = document.getElementById('filterSemester');
    const filterClass = document.getElementById('filterClass');
    const searchStudent = document.getElementById('searchStudent');
    
    if (filterSemester) filterSemester.addEventListener('change', loadMyStudents);
    if (filterClass) filterClass.addEventListener('change', loadMyStudents);
    if (searchStudent) searchStudent.addEventListener('input', loadMyStudents);
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}
