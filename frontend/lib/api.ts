// API configuration and helper functions
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const authAPI = {
  login: async (userId: string, password: string, role: string) => {
    const response = await api.post('/api/v1/auth/login', {
      user_id: userId,
      password,
      role,
    });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  getProfile: async (userId: string) => {
    const response = await api.get(`/api/v1/auth/profile/${userId}`);
    return response.data;
  },

  changePassword: async (userId: string, oldPassword: string, newPassword: string) => {
    const response = await api.post('/api/v1/auth/change-password', {
      user_id: userId,
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// Students APIs
export const studentsAPI = {
  getAll: async (params?: { semester?: number; class_section?: string; search?: string }) => {
    const response = await api.get('/api/v1/students', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/v1/students/${id}`);
    return response.data;
  },

  create: async (studentData: any) => {
    const response = await api.post('/api/v1/students', studentData);
    return response.data;
  },

  update: async (id: number, studentData: any) => {
    const response = await api.put(`/api/v1/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/v1/students/${id}`);
    return response.data;
  },

  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/v1/students/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Attendance APIs
export const attendanceAPI = {
  mark: async (attendanceData: any) => {
    const response = await api.post('/api/v1/attendance/mark', attendanceData);
    return response.data;
  },

  verify: async (attendanceId: number, status: string, notes?: string) => {
    const response = await api.post('/api/v1/attendance/verify', {
      attendance_id: attendanceId,
      status,
      notes,
    });
    return response.data;
  },

  getToday: async (params?: { semester?: number; class_section?: string }) => {
    const response = await api.get('/api/v1/attendance/today', { params });
    return response.data;
  },

  getStudentHistory: async (studentId: number, params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get(`/api/v1/attendance/student/${studentId}`, { params });
    return response.data;
  },

  getPendingVerifications: async (teacherId?: number) => {
    const response = await api.get('/api/v1/attendance/pending-verification', {
      params: { teacher_id: teacherId },
    });
    return response.data;
  },

  getStatistics: async (studentId: number) => {
    const response = await api.get(`/api/v1/attendance/statistics/${studentId}`);
    return response.data;
  },

  getSubjectWise: async (studentId: number) => {
    const response = await api.get(`/api/v1/attendance/subject-wise/${studentId}`);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/v1/attendance/${id}`);
    return response.data;
  },
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await api.get('/api/v1/analytics/dashboard');
    return response.data;
  },

  getAtRiskStudents: async (threshold?: number) => {
    const response = await api.get('/api/v1/analytics/at-risk-students', {
      params: { threshold },
    });
    return response.data;
  },

  getWeeklyTrend: async () => {
    const response = await api.get('/api/v1/analytics/weekly-trend');
    return response.data;
  },

  getMonthlyReport: async (year: number, month: number) => {
    const response = await api.get('/api/v1/analytics/monthly-report', {
      params: { year, month },
    });
    return response.data;
  },

  getClassWise: async () => {
    const response = await api.get('/api/v1/analytics/class-wise');
    return response.data;
  },

  getSubjectWise: async (params?: { semester?: number; class_section?: string }) => {
    const response = await api.get('/api/v1/analytics/subject-wise', { params });
    return response.data;
  },

  getTeacherSummary: async (teacherId: number) => {
    const response = await api.get(`/api/v1/analytics/teacher-summary/${teacherId}`);
    return response.data;
  },

  generateReport: async (reportType: string, params?: any) => {
    const response = await api.get('/api/v1/analytics/generate-report', {
      params: { report_type: reportType, ...params },
    });
    return response.data;
  },
};
