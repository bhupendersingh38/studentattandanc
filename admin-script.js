// Admin Dashboard JavaScript
const API_URL = 'http://localhost:8000';
const AI_URL = 'http://localhost:8001';

// Global state
let currentPage = 'overview';
let teachers = [];
let students = [];
let attendanceData = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    setupNavigation();
    loadDashboardData();
    setupEventListeners();
});

function initializeAdmin() {
    console.log('Admin Dashboard Initialized');
    updateDateTime();
    setInterval(updateDateTime, 1000);
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
    
    // Update if elements exist
    const dateEl = document.getElementById('currentDate');
    const timeEl = document.getElementById('currentTime');
    if (dateEl) dateEl.textContent = date;
    if (timeEl) timeEl.textContent = time;
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
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
            
            // Update title
            document.getElementById('pageTitle').textContent = this.textContent.trim();
            
            // Load page data
            loadPageData(page);
        });
    });
}

function loadPageData(page) {
    switch(page) {
        case 'overview':
            loadOverviewData();
            break;
        case 'teachers':
            loadTeachersData();
            break;
        case 'students':
            loadStudentsData();
            break;
        case 'attendance':
            loadAttendanceData();
            break;
        case 'timetable':
            loadTimetableData();
            break;
    }
}

// Dashboard Data
async function loadDashboardData() {
    try {
        // Simulate API call
        const data = {
            totalStudents: 500,
            totalTeachers: 45,
            totalClasses: 12,
            todayAttendance: 87
        };
        
        document.getElementById('totalStudents').textContent = data.totalStudents;
        document.getElementById('totalTeachers').textContent = data.totalTeachers;
        document.getElementById('totalClasses').textContent = data.totalClasses;
        document.getElementById('todayAttendance').textContent = data.todayAttendance + '%';
        
        loadRecentActivities();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function loadOverviewData() {
    loadDashboardData();
}

function loadRecentActivities() {
    const activities = [
        { text: 'Teacher John Doe marked attendance for CS-A', time: '5 mins ago', icon: '✓' },
        { text: 'New student registered in Semester 3', time: '15 mins ago', icon: '👤' },
        { text: 'Attendance report generated', time: '1 hour ago', icon: '📊' },
        { text: 'SMS notifications sent to parents', time: '2 hours ago', icon: '📱' },
        { text: 'System backup completed', time: '3 hours ago', icon: '💾' }
    ];
    
    const listEl = document.getElementById('recentActivities');
    if (!listEl) return;
    
    listEl.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div style="display: flex; gap: 12px; align-items: start;">
                <span style="font-size: 20px;">${activity.icon}</span>
                <div style="flex: 1;">
                    <div>${activity.text}</div>
                    <small style="color: var(--text-muted);">${activity.time}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Teachers Management
function loadTeachersData() {
    teachers = [
        { id: 'T001', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', department: 'CSE', classes: 'CS-A, CS-B', status: 'Active' },
        { id: 'T002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', department: 'ECE', classes: 'EC-A', status: 'Active' },
        { id: 'T003', name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 9876543212', department: 'ME', classes: 'ME-A, ME-B', status: 'Active' }
    ];
    
    const tbody = document.getElementById('teachersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = teachers.map(teacher => `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.department}</td>
            <td>${teacher.classes}</td>
            <td><span class="status-badge online">${teacher.status}</span></td>
            <td>
                <button class="btn-small btn-primary" onclick="editTeacher('${teacher.id}')">Edit</button>
                <button class="btn-small btn-danger" onclick="deleteTeacher('${teacher.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    modal.style.display = 'none';
}

function editTeacher(id) {
    alert('Edit teacher: ' + id);
}

function deleteTeacher(id) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        teachers = teachers.filter(t => t.id !== id);
        loadTeachersData();
    }
}

// Students Management
function loadStudentsData() {
    students = [
        { roll: '21CS001', name: 'Rahul Kumar', semester: 1, class: 'A', phone: '+91 9876543210', parentPhone: '+91 9876543211', attendance: 92, status: 'Active' },
        { roll: '21CS002', name: 'Priya Sharma', semester: 1, class: 'A', phone: '+91 9876543212', parentPhone: '+91 9876543213', attendance: 88, status: 'Active' },
        { roll: '21CS003', name: 'Amit Patel', semester: 1, class: 'A', phone: '+91 9876543214', parentPhone: '+91 9876543215', attendance: 75, status: 'At Risk' },
        { roll: '21CS004', name: 'Sneha Reddy', semester: 2, class: 'B', phone: '+91 9876543216', parentPhone: '+91 9876543217', attendance: 95, status: 'Active' }
    ];
    
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.roll}</td>
            <td>${student.name}</td>
            <td>Sem ${student.semester}</td>
            <td>Class ${student.class}</td>
            <td>${student.phone}</td>
            <td>${student.parentPhone}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="progress-bar" style="width: 100px; height: 6px;">
                        <div class="progress-fill" style="width: ${student.attendance}%"></div>
                    </div>
                    <span>${student.attendance}%</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${student.status === 'Active' ? 'online' : 'offline'}">
                    ${student.status}
                </span>
            </td>
            <td>
                <button class="btn-small btn-primary" onclick="viewStudent('${student.roll}')">View</button>
                <button class="btn-small btn-secondary" onclick="editStudent('${student.roll}')">Edit</button>
            </td>
        </tr>
    `).join('');
}

function viewStudent(roll) {
    alert('View student details: ' + roll);
}

function editStudent(roll) {
    alert('Edit student: ' + roll);
}

// Attendance Management
function loadAttendanceData() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
    
    const attendanceGrid = document.getElementById('attendanceGrid');
    if (!attendanceGrid) return;
    
    attendanceGrid.innerHTML = `
        <div class="card">
            <h3>Today's Attendance Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
                <div class="stat-box">
                    <div class="stat-label">Total Present</div>
                    <div class="stat-number" style="color: var(--success);">435</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Total Absent</div>
                    <div class="stat-number" style="color: var(--danger);">65</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Attendance Rate</div>
                    <div class="stat-number" style="color: var(--primary);">87%</div>
                </div>
            </div>
        </div>
    `;
}

function exportAttendance() {
    alert('Exporting attendance data...');
}

// Timetable Management
function loadTimetableData() {
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const tbody = document.getElementById('timetableBody');
    if (!tbody) return;
    
    tbody.innerHTML = times.map(time => `
        <tr>
            <td><strong>${time}</strong></td>
            ${days.map(() => '<td>-</td>').join('')}
        </tr>
    `).join('');
}

function showAddTimetableModal() {
    alert('Add new timetable entry');
}

// Reports
function generateReport(type) {
    alert(`Generating ${type} report...`);
}

// Event Listeners
function setupEventListeners() {
    // Semester filter
    const semesterFilter = document.getElementById('semesterFilter');
    if (semesterFilter) {
        semesterFilter.addEventListener('change', filterStudents);
    }
    
    // Class filter
    const classFilter = document.getElementById('classFilter');
    if (classFilter) {
        classFilter.addEventListener('change', filterStudents);
    }
    
    // Search
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', searchStudents);
    }
}

function filterStudents() {
    const semester = document.getElementById('semesterFilter').value;
    const classVal = document.getElementById('classFilter').value;
    
    // Filter logic here
    loadStudentsData();
}

function searchStudents() {
    const query = document.getElementById('studentSearch').value.toLowerCase();
    
    // Search logic here
    loadStudentsData();
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}
