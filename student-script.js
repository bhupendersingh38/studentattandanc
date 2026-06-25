// Student Dashboard JavaScript
const API_URL = 'http://localhost:8000';
const AI_URL = 'http://localhost:8001';

// Global state
let studentData = {
    id: '21CS001',
    name: 'Student Name',
    roll: '21CS001',
    semester: 1,
    class: 'A',
    attendance: 85
};
let videoStream = null;
let attendanceMarking = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeStudent();
    setupNavigation();
    loadStudentData();
    setupEventListeners();
});

function initializeStudent() {
    console.log('Student Dashboard Initialized');
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadStudentProfile();
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

function loadStudentProfile() {
    document.getElementById('studentName').textContent = studentData.name;
    document.getElementById('studentRoll').textContent = 'Roll: ' + studentData.roll;
    document.getElementById('welcomeName').textContent = studentData.name;
    document.getElementById('studentAvatar').textContent = studentData.name.charAt(0);
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
        case 'mark-attendance':
            setupMarkAttendance();
            break;
        case 'my-attendance':
            loadMyAttendance();
            break;
        case 'timetable':
            loadTimetable();
            break;
        case 'notifications':
            loadNotifications();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Dashboard
function loadStudentData() {
    document.getElementById('overallAttendance').textContent = studentData.attendance + '%';
    document.getElementById('attendanceProgress').style.width = studentData.attendance + '%';
    document.getElementById('presentDays').textContent = '68';
    document.getElementById('absentDays').textContent = '12';
    
    const status = studentData.attendance >= 75 ? 'Safe' : 'At Risk';
    const statusEl = document.getElementById('attendanceStatus');
    statusEl.textContent = status;
    statusEl.style.color = studentData.attendance >= 75 ? 'var(--success)' : 'var(--danger)';
    
    loadTodayClasses();
    loadRecentNotifications();
    checkAttendanceAlert();
}

function loadDashboardData() {
    loadStudentData();
}

function loadTodayClasses() {
    const classes = [
        { time: '9:00 AM', subject: 'Data Structures', teacher: 'Prof. John Doe', status: 'upcoming' },
        { time: '11:00 AM', subject: 'Database Systems', teacher: 'Prof. Jane Smith', status: 'upcoming' },
        { time: '2:00 PM', subject: 'Web Technologies', teacher: 'Prof. Mike Johnson', status: 'upcoming' }
    ];
    
    const listEl = document.getElementById('todayClasses');
    if (!listEl) return;
    
    listEl.innerHTML = classes.map(cls => `
        <div class="class-item">
            <div class="class-time">${cls.time}</div>
            <div class="class-details">
                <div class="class-subject">${cls.subject}</div>
                <div class="class-teacher">${cls.teacher}</div>
            </div>
            <span class="class-status ${cls.status}">${cls.status.toUpperCase()}</span>
        </div>
    `).join('');
}

function loadRecentNotifications() {
    const notifications = [
        { title: 'Attendance Marked', message: 'Your attendance for Data Structures class has been marked', time: '1 hour ago' },
        { title: 'Low Attendance Alert', message: 'Your attendance is below 75%. Please attend classes regularly', time: '2 hours ago' },
        { title: 'New Assignment', message: 'New assignment posted for Web Technologies', time: '5 hours ago' }
    ];
    
    const listEl = document.getElementById('recentNotifications');
    if (!listEl) return;
    
    listEl.innerHTML = notifications.map(notif => `
        <div class="notification-item unread">
            <div class="notification-content">
                <div class="notification-title">${notif.title}</div>
                <div class="notification-message">${notif.message}</div>
                <div class="notification-time">${notif.time}</div>
            </div>
        </div>
    `).join('');
}

function checkAttendanceAlert() {
    if (studentData.attendance < 75) {
        const alertEl = document.getElementById('attendanceAlert');
        if (alertEl) {
            alertEl.className = 'attendance-alert show';
            alertEl.innerHTML = `
                <h4 style="color: var(--danger); margin-bottom: 12px;">⚠️ Attendance Warning</h4>
                <p>Your attendance is ${studentData.attendance}%, which is below the required 75%.</p>
                <p>You need to attend ${Math.ceil((75 * 80 - studentData.attendance * 80) / 25)} more classes to reach 75%.</p>
            `;
        }
    }
}

// Mark Attendance
function setupMarkAttendance() {
    const startBtn = document.getElementById('startStudentCamera');
    const markBtn = document.getElementById('markMyAttendance');
    const stopBtn = document.getElementById('stopStudentCamera');
    
    if (startBtn) startBtn.onclick = startStudentCamera;
    if (markBtn) markBtn.onclick = markAttendance;
    if (stopBtn) stopBtn.onclick = stopStudentCamera;
    
    checkStudentDistance();
}

async function startStudentCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720, facingMode: 'user' } 
        });
        
        const video = document.getElementById('studentWebcam');
        video.srcObject = videoStream;
        
        document.getElementById('faceDetection').textContent = 'Detecting...';
        document.getElementById('faceDetection').style.color = 'var(--warning)';
        
        // Simulate face detection
        setTimeout(() => {
            document.getElementById('faceDetection').textContent = 'Face Detected ✓';
            document.getElementById('faceDetection').style.color = 'var(--success)';
        }, 2000);
        
        console.log('Camera started');
    } catch (error) {
        console.error('Camera error:', error);
        alert('Failed to access camera. Please allow camera permissions.');
    }
}

function checkStudentDistance() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Simulate distance calculation
                const distance = Math.floor(Math.random() * 30) + 5; // 5-35 meters
                
                const distanceEl = document.getElementById('distanceCheck');
                if (distance <= 20) {
                    distanceEl.textContent = `${distance}m - Within Range ✓`;
                    distanceEl.style.color = 'var(--success)';
                } else {
                    distanceEl.textContent = `${distance}m - Too Far ✗`;
                    distanceEl.style.color = 'var(--danger)';
                }
            },
            error => {
                document.getElementById('distanceCheck').textContent = 'Location Unavailable';
                document.getElementById('distanceCheck').style.color = 'var(--danger)';
            }
        );
    }
}

async function markAttendance() {
    if (!videoStream) {
        alert('Please start camera first');
        return;
    }
    
    // Check distance
    const distanceText = document.getElementById('distanceCheck').textContent;
    if (distanceText.includes('Too Far') || distanceText.includes('Unavailable')) {
        alert('You must be within 20 meters of your teacher to mark attendance');
        return;
    }
    
    attendanceMarking = true;
    
    const video = document.getElementById('studentWebcam');
    const canvas = document.getElementById('studentCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    
    try {
        // Check liveness
        document.getElementById('livenessCheck').textContent = 'Checking...';
        document.getElementById('livenessCheck').style.color = 'var(--warning)';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const livenessResult = Math.random() > 0.1; // 90% success rate
        
        if (!livenessResult) {
            document.getElementById('livenessCheck').textContent = 'Failed - Use Real Face';
            document.getElementById('livenessCheck').style.color = 'var(--danger)';
            showAttendanceResult(false, 'Liveness check failed. Please use your real face, not a photo or video.');
            return;
        }
        
        document.getElementById('livenessCheck').textContent = 'Verified ✓';
        document.getElementById('livenessCheck').style.color = 'var(--success)';
        
        // Recognize face
        const result = await recognizeStudentFace(imageData);
        
        if (result.success && result.match >= 85) {
            showAttendanceResult(true, `Attendance marked successfully! Match: ${result.match}%`);
            
            // Send SMS notification
            sendSMSNotification();
        } else {
            showAttendanceResult(false, 'Face recognition failed. Please position your face clearly.');
        }
        
    } catch (error) {
        console.error('Attendance marking error:', error);
        showAttendanceResult(false, 'An error occurred. Please try again.');
    } finally {
        attendanceMarking = false;
    }
}

async function recognizeStudentFace(imageData) {
    // Simulate AI recognition
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.15; // 85% success rate
    const match = success ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 50) + 30;
    
    return {
        success: success,
        match: match,
        studentId: studentData.id,
        timestamp: new Date().toISOString()
    };
}

function showAttendanceResult(success, message) {
    const resultEl = document.getElementById('attendanceResult');
    if (!resultEl) return;
    
    if (success) {
        resultEl.innerHTML = `
            <div class="result-success">
                <div class="result-icon">✅</div>
                <div class="result-message">Attendance Marked!</div>
                <div class="result-details">${message}</div>
            </div>
        `;
    } else {
        resultEl.innerHTML = `
            <div class="result-failed">
                <div class="result-icon">❌</div>
                <div class="result-message">Failed</div>
                <div class="result-details">${message}</div>
            </div>
        `;
    }
}

function sendSMSNotification() {
    const message = `Attendance marked for ${studentData.name} at ${new Date().toLocaleTimeString()}`;
    console.log('SMS Notification:', message);
    
    // Show toast
    showSMSToast(message);
}

function showSMSToast(message) {
    const toast = document.getElementById('smsToast');
    const messageEl = document.getElementById('toastMessage');
    
    if (toast && messageEl) {
        messageEl.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
}

function stopStudentCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        const video = document.getElementById('studentWebcam');
        video.srcObject = null;
        
        document.getElementById('faceDetection').textContent = 'Not Detected';
        document.getElementById('faceDetection').style.color = 'var(--text-muted)';
        document.getElementById('livenessCheck').textContent = 'Not Verified';
        document.getElementById('livenessCheck').style.color = 'var(--text-muted)';
    }
}

// My Attendance
function loadMyAttendance() {
    document.getElementById('totalClasses').textContent = '80';
    document.getElementById('classesAttended').textContent = '68';
    document.getElementById('classesMissed').textContent = '12';
    document.getElementById('progressText').textContent = studentData.attendance + '%';
    
    // Update circular progress
    const circle = document.getElementById('progressCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (studentData.attendance / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    loadAttendanceHistory();
}

function loadAttendanceHistory() {
    const history = [
        { date: '2024-01-15', subject: 'Data Structures', teacher: 'Prof. John', time: '9:00 AM', status: 'Present' },
        { date: '2024-01-15', subject: 'Database Systems', teacher: 'Prof. Jane', time: '11:00 AM', status: 'Present' },
        { date: '2024-01-14', subject: 'Web Technologies', teacher: 'Prof. Mike', time: '2:00 PM', status: 'Absent' },
        { date: '2024-01-14', subject: 'Data Structures', teacher: 'Prof. John', time: '9:00 AM', status: 'Present' }
    ];
    
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = history.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${record.subject}</td>
            <td>${record.teacher}</td>
            <td>${record.time}</td>
            <td><span class="status-${record.status.toLowerCase()}">${record.status}</span></td>
        </tr>
    `).join('');
}

// Timetable
function loadTimetable() {
    document.getElementById('currentSemester').textContent = studentData.semester;
    document.getElementById('currentClass').textContent = studentData.class;
    
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const tbody = document.getElementById('timetableBody');
    if (!tbody) return;
    
    tbody.innerHTML = times.map((time, idx) => `
        <tr>
            <td><strong>${time}</strong></td>
            ${days.map((day, dayIdx) => {
                if ((idx + dayIdx) % 2 === 0) {
                    return `
                        <td>
                            <div class="class-cell">
                                <div class="cell-subject">Subject ${idx + 1}</div>
                                <div class="cell-teacher">Teacher ${dayIdx + 1}</div>
                            </div>
                        </td>
                    `;
                }
                return '<td>-</td>';
            }).join('')}
        </tr>
    `).join('');
}

// Notifications
function loadNotifications() {
    const notifications = [
        { icon: '✅', title: 'Attendance Marked', message: 'Your attendance for Data Structures has been marked successfully', time: '1 hour ago', unread: true },
        { icon: '⚠️', title: 'Low Attendance Alert', message: 'Your attendance is below 75%. Please attend classes regularly', time: '2 hours ago', unread: true },
        { icon: '📚', title: 'New Assignment', message: 'New assignment posted for Web Technologies - Due: Jan 20', time: '5 hours ago', unread: false },
        { icon: '📢', title: 'Holiday Notice', message: 'College will remain closed on Jan 26 for Republic Day', time: '1 day ago', unread: false }
    ];
    
    const container = document.getElementById('notificationsContainer');
    if (!container) return;
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.unread ? 'unread' : ''}">
            <div class="notification-icon">${notif.icon}</div>
            <div class="notification-content">
                <div class="notification-title">${notif.title}</div>
                <div class="notification-message">${notif.message}</div>
                <div class="notification-time">${notif.time}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('notificationCount').textContent = notifications.filter(n => n.unread).length;
}

function showNotifications() {
    // Navigate to notifications page
    document.querySelector('[data-page="notifications"]').click();
}

function markAllRead() {
    alert('All notifications marked as read');
    loadNotifications();
}

// Profile
function loadProfile() {
    document.getElementById('profileName').textContent = studentData.name;
    document.getElementById('profileRoll').textContent = 'Roll: ' + studentData.roll;
    document.getElementById('profileSemester').textContent = `Semester ${studentData.semester} - Class ${studentData.class}`;
    document.getElementById('profileEmail').textContent = 'student@example.com';
    document.getElementById('profilePhone').textContent = '+91 9876543210';
    document.getElementById('profileParentPhone').textContent = '+91 9876543211';
    document.getElementById('profileDepartment').textContent = 'Computer Science';
    document.getElementById('profileDOB').textContent = '01/01/2003';
    document.getElementById('profileAddress').textContent = '123 Main Street, City, State';
}

function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        alert('Password changed successfully!');
    }
}

// Event Listeners
function setupEventListeners() {
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) {
        monthFilter.addEventListener('change', loadAttendanceHistory);
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}
