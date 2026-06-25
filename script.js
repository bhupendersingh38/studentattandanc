// Configuration
const API_URL = 'http://localhost:8000';
const AI_URL = 'http://localhost:8001';

// Global variables
let videoStream = null;
let recognizedStudents = [];
let isCapturing = false;
let captureInterval = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    checkServerStatus();
    loadDashboardData();
    setupEventListeners();
    initializeCharts();
    setInterval(checkServerStatus, 30000); // Check every 30 seconds
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show page
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(page + '-page').classList.add('active');
            
            // Load page-specific data
            loadPageData(page);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

// Server Status Check
async function checkServerStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    try {
        const backendResponse = await fetch(`${API_URL}/health`);
        const aiResponse = await fetch(`${AI_URL}/health`);
        
        if (backendResponse.ok && aiResponse.ok) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'All Systems Online';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Some Services Offline';
        }
    } catch (error) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Servers Offline';
        console.error('Server check failed:', error);
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/api/v1/analytics/dashboard`);
        const data = await response.json();
        
        // Update stats
        document.getElementById('totalStudents').textContent = data.total_students;
        document.getElementById('presentToday').textContent = data.present_today;
        document.getElementById('absentToday').textContent = data.absent_today;
        
        // Load recent activity
        loadRecentActivity();
        loadAtRiskStudents();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use demo data
        loadRecentActivity();
        loadAtRiskStudents();
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const activities = [
        { name: 'John Doe', action: 'Marked Present', time: '2 min ago', status: 'success' },
        { name: 'Jane Smith', action: 'Marked Present', time: '5 min ago', status: 'success' },
        { name: 'Bob Johnson', action: 'Marked Absent', time: '10 min ago', status: 'danger' },
        { name: 'Alice Williams', action: 'Marked Present', time: '15 min ago', status: 'success' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-dot ${activity.status}"></div>
            <div style="flex: 1;">
                <div style="font-weight: 600;">${activity.name}</div>
                <div style="font-size: 14px; color: var(--text-muted);">${activity.action}</div>
            </div>
            <div style="font-size: 12px; color: var(--text-muted);">${activity.time}</div>
        </div>
    `).join('');
}

function loadAtRiskStudents() {
    const riskList = document.getElementById('riskList');
    const students = [
        { name: 'Mike Brown', id: 'CS001', percentage: 68, trend: 'down' },
        { name: 'Sarah Davis', id: 'CS002', percentage: 72, trend: 'down' },
        { name: 'Tom Wilson', id: 'CS003', percentage: 74, trend: 'stable' },
        { name: 'Emma Martinez', id: 'CS004', percentage: 70, trend: 'down' }
    ];
    
    riskList.innerHTML = students.map(student => `
        <div class="risk-item">
            <div style="flex: 1;">
                <div style="font-weight: 600;">${student.name}</div>
                <div style="font-size: 14px; color: var(--text-muted);">ID: ${student.id}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 24px; font-weight: 700; color: var(--warning);">
                    ${student.percentage}%
                </div>
                <div style="font-size: 12px; color: var(--danger);">↓ Declining</div>
            </div>
        </div>
    `).join('');
}

// Charts Initialization
function initializeCharts() {
    initTrendChart();
    initSubjectChart();
    initMonthlyChart();
}

function initTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Attendance %',
                data: [88, 92, 87, 90, 85, 78, 82],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function initSubjectChart() {
    const ctx = document.getElementById('subjectChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'CS'],
            datasets: [{
                label: 'Attendance %',
                data: [92, 88, 90, 85, 95],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function initMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Average Attendance',
                data: [85, 87, 89, 86, 90, 88],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 80,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// Camera Functions
function setupEventListeners() {
    const startCamera = document.getElementById('startCamera');
    const stopCamera = document.getElementById('stopCamera');
    const captureBtn = document.getElementById('captureBtn');
    const studentSearch = document.getElementById('studentSearch');
    
    if (startCamera) {
        startCamera.addEventListener('click', handleStartCamera);
    }
    
    if (stopCamera) {
        stopCamera.addEventListener('click', handleStopCamera);
    }
    
    if (captureBtn) {
        captureBtn.addEventListener('click', captureFrame);
    }
    
    if (studentSearch) {
        studentSearch.addEventListener('input', handleStudentSearch);
    }
}

async function handleStartCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 } 
        });
        document.getElementById('webcam').srcObject = videoStream;
        document.getElementById('recordingIndicator').classList.add('active');
        
        // Start continuous capture
        isCapturing = true;
        captureInterval = setInterval(captureFrame, 3000); // Every 3 seconds
        
        showNotification('Camera started successfully', 'success');
    } catch (error) {
        console.error('Error accessing camera:', error);
        showNotification('Error accessing camera: ' + error.message, 'error');
    }
}

function handleStopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        document.getElementById('webcam').srcObject = null;
        document.getElementById('recordingIndicator').classList.remove('active');
        videoStream = null;
    }
    
    if (captureInterval) {
        clearInterval(captureInterval);
        captureInterval = null;
        isCapturing = false;
    }
    
    showNotification('Camera stopped', 'info');
}

async function captureFrame() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    
    if (!video.srcObject) {
        showNotification('Please start the camera first', 'warning');
        return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
        const response = await fetch(`${AI_URL}/api/v1/recognize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                image_base64: imageData,
                class_id: 'demo-class'
            })
        });
        
        if (response.ok) {
            const students = await response.json();
            updateRecognizedStudents(students);
            
            // Mark attendance
            for (const student of students) {
                if (student.liveness_verified && student.confidence > 0.85) {
                    await markAttendance(student);
                }
            }
        }
    } catch (error) {
        console.error('Error recognizing faces:', error);
    }
}

function updateRecognizedStudents(students) {
    const recognizedList = document.getElementById('recognizedList');
    
    if (students.length === 0) {
        recognizedList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📷</div>
                <p>No faces detected</p>
                <p class="empty-subtitle">Make sure students are in front of the camera</p>
            </div>
        `;
        return;
    }
    
    // Update recognized students array
    students.forEach(student => {
        const exists = recognizedStudents.find(s => s.student_id === student.student_id);
        if (!exists) {
            recognizedStudents.push(student);
        }
    });
    
    // Update display
    recognizedList.innerHTML = recognizedStudents.map(student => {
        const confidenceClass = student.confidence > 0.9 ? 'high' : 
                               student.confidence > 0.8 ? 'medium' : 'low';
        
        return `
            <div class="recognized-item">
                <div class="recognized-name">${student.student_name}</div>
                <div class="recognized-id">ID: ${student.student_id}</div>
                <div class="recognized-meta">
                    <span class="confidence-badge ${confidenceClass}">
                        ${(student.confidence * 100).toFixed(1)}% Confidence
                    </span>
                    <span style="color: ${student.liveness_verified ? 'var(--success)' : 'var(--danger)'}">
                        ${student.liveness_verified ? '✓ Live' : '✗ Not Live'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // Update summary
    updateSummary();
}

function updateSummary() {
    document.getElementById('recognizedCount').textContent = recognizedStudents.length;
    document.getElementById('highConfidence').textContent = 
        recognizedStudents.filter(s => s.confidence > 0.85).length;
    document.getElementById('failedLiveness').textContent = 
        recognizedStudents.filter(s => !s.liveness_verified).length;
    document.getElementById('markedPresent').textContent = 
        recognizedStudents.filter(s => s.confidence > 0.85 && s.liveness_verified).length;
}

async function markAttendance(student) {
    try {
        await fetch(`${API_URL}/api/v1/attendance/mark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: student.student_id,
                class_id: 'demo-class',
                status: 'present',
                confidence_score: student.confidence,
                marked_at: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
    }
}

// Load Students
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/api/v1/students`);
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
        // Use demo data
        displayStudents(getDemoStudents());
    }
}

function getDemoStudents() {
    return [
        { id: '1', student_code: 'CS001', first_name: 'John', last_name: 'Doe', 
          email: 'john@university.edu', department: 'Computer Science', year: 3, attendance_percentage: 85.5 },
        { id: '2', student_code: 'CS002', first_name: 'Jane', last_name: 'Smith', 
          email: 'jane@university.edu', department: 'Computer Science', year: 3, attendance_percentage: 92.3 },
        { id: '3', student_code: 'CS003', first_name: 'Bob', last_name: 'Johnson', 
          email: 'bob@university.edu', department: 'Computer Science', year: 2, attendance_percentage: 78.2 },
        { id: '4', student_code: 'CS004', first_name: 'Alice', last_name: 'Williams', 
          email: 'alice@university.edu', department: 'Computer Science', year: 4, attendance_percentage: 95.7 }
    ];
}

function displayStudents(students) {
    const studentsGrid = document.getElementById('studentsGrid');
    
    studentsGrid.innerHTML = students.map(student => {
        const initials = student.first_name[0] + student.last_name[0];
        const percentage = student.attendance_percentage;
        
        return `
            <div class="student-card">
                <div class="student-header">
                    <div class="student-avatar">${initials}</div>
                    <div>
                        <div class="student-name">${student.first_name} ${student.last_name}</div>
                        <div class="student-id">${student.student_code}</div>
                    </div>
                </div>
                <div class="student-info">
                    <div class="student-info-item">
                        <span class="student-info-label">Department:</span>
                        <span>${student.department}</span>
                    </div>
                    <div class="student-info-item">
                        <span class="student-info-label">Year:</span>
                        <span>Year ${student.year}</span>
                    </div>
                    <div class="student-info-item">
                        <span class="student-info-label">Email:</span>
                        <span style="font-size: 12px;">${student.email}</span>
                    </div>
                </div>
                <div class="student-attendance">
                    <div class="attendance-percentage">
                        <span style="color: var(--text-muted);">Attendance:</span>
                        <span class="percentage-value">${percentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function handleStudentSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const studentCards = document.querySelectorAll('.student-card');
    
    studentCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

// Load page-specific data
function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'students':
            loadStudents();
            break;
        case 'attendance':
            recognizedStudents = [];
            updateSummary();
            break;
    }
}

// Notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass);
        backdrop-filter: blur(10px);
        border: 1px solid var(--border);
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'});
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🎉 AttendX AI - Smart Attendance System', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cBackend API: ' + API_URL, 'color: #10b981; font-size: 14px;');
console.log('%cAI Engine: ' + AI_URL, 'color: #8b5cf6; font-size: 14px;');
