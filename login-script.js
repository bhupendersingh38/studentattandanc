// Login Page JavaScript
let selectedRole = 'student';

// Demo Credentials
const credentials = {
    student: [
        { id: '21CS001', password: 'student123' },
        { id: '21CS002', password: 'student123' },
        { id: '21CS003', password: 'student123' }
    ],
    teacher: [
        { id: 'T001', password: 'teacher123' },
        { id: 'T002', password: 'teacher123' },
        { id: 'teacher@example.com', password: 'teacher123' }
    ],
    admin: [
        { id: 'admin', password: 'admin123' },
        { id: 'admin@example.com', password: 'admin123' }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    loadRememberedUser();
});

// Select Role
function selectRole(role) {
    selectedRole = role;
    
    // Update active button
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-role="${role}"]`).classList.add('active');
    
    // Update placeholder
    const userIdInput = document.getElementById('userId');
    if (role === 'student') {
        userIdInput.placeholder = 'Enter Student ID (e.g., 21CS001)';
    } else if (role === 'teacher') {
        userIdInput.placeholder = 'Enter Teacher ID (e.g., T001)';
    } else {
        userIdInput.placeholder = 'Enter Admin Username';
    }
}

// Setup Login Form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Auto-fill on credential click
    document.querySelectorAll('.credential-item').forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const role = ['student', 'teacher', 'admin'][index];
            const creds = credentials[role][0];
            
            selectRole(role);
            document.getElementById('userId').value = creds.id;
            document.getElementById('password').value = creds.password;
        });
    });
}

// Handle Login
async function handleLogin() {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate
    if (!userId || !password) {
        showAlert('Please enter both User ID and Password', 'error');
        return;
    }
    
    // Show loading
    const form = document.getElementById('loginForm');
    form.classList.add('loading');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check credentials
        const isValid = validateCredentials(userId, password, selectedRole);
        
        if (isValid) {
            // Remember user if checkbox is checked
            if (remember) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    userId: userId,
                    role: selectedRole
                }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            // Store session
            sessionStorage.setItem('currentUser', JSON.stringify({
                userId: userId,
                role: selectedRole,
                loginTime: new Date().toISOString()
            }));
            
            // Success
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                redirectToDashboard(selectedRole);
            }, 1500);
            
        } else {
            showAlert('Invalid credentials. Please try again.', 'error');
            form.classList.remove('loading');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred. Please try again.', 'error');
        form.classList.remove('loading');
    }
}

// Validate Credentials
function validateCredentials(userId, password, role) {
    const roleCredentials = credentials[role];
    
    return roleCredentials.some(cred => 
        (cred.id.toLowerCase() === userId.toLowerCase()) && 
        cred.password === password
    );
}

// Redirect to Dashboard
function redirectToDashboard(role) {
    const dashboards = {
        student: 'student-dashboard.html',
        teacher: 'teacher-dashboard.html',
        admin: 'admin-dashboard.html'
    };
    
    window.location.href = dashboards[role];
}

// Show Alert
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Load Remembered User
function loadRememberedUser() {
    const remembered = localStorage.getItem('rememberedUser');
    
    if (remembered) {
        try {
            const user = JSON.parse(remembered);
            document.getElementById('userId').value = user.userId;
            document.getElementById('remember').checked = true;
            selectRole(user.role);
        } catch (error) {
            console.error('Error loading remembered user:', error);
        }
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + S = Student
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        selectRole('student');
    }
    // Alt + T = Teacher
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        selectRole('teacher');
    }
    // Alt + A = Admin
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        selectRole('admin');
    }
});

// Auto-focus on User ID field
window.addEventListener('load', function() {
    document.getElementById('userId').focus();
});

// Prevent multiple form submissions
let isSubmitting = false;
document.getElementById('loginForm').addEventListener('submit', function(e) {
    if (isSubmitting) {
        e.preventDefault();
        return false;
    }
    isSubmitting = true;
    setTimeout(() => {
        isSubmitting = false;
    }, 2000);
});

// Check if already logged in
function checkExistingSession() {
    const session = sessionStorage.getItem('currentUser');
    
    if (session) {
        try {
            const user = JSON.parse(session);
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            // If logged in within last 8 hours, redirect to dashboard
            if (hoursSinceLogin < 8) {
                redirectToDashboard(user.role);
            } else {
                // Session expired
                sessionStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
    }
}

// Check session on page load
checkExistingSession();

// Handle Enter key on inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    });
});

// Add visual feedback on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Log system info
console.log('%c AttendX AI - Smart Attendance System ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('System Status: Online ✓');
console.log('Backend API: http://localhost:8000');
console.log('AI Engine: http://localhost:8001');
console.log('\nDemo Credentials:');
console.log('Student: 21CS001 / student123');
console.log('Teacher: T001 / teacher123');
console.log('Admin: admin / admin123');
