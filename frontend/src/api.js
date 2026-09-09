import axios from 'axios';

// Detect whether running in Vite dev server (port 5173) or Spring Boot (port 8080)
const BASE_URL = window.location.port === '5173' ? '/api' : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const portalApi = {
  getDepartments: () => api.get('/departments'),
  getStaffList: (query) => api.get('/staff', { params: { q: query || '' } }),
  getStaffSlots: (staffId) => api.get(`/staff/${staffId}/slots`),
  getMySlots: (staffId) => api.get('/staff/my-slots', { params: { staffId } }),
  addSlot: (staffId, dayOfWeek, timeSlot) => api.post('/staff/slots', { staffId, dayOfWeek, timeSlot }),
  
  // Appointments
  bookAppointment: (data) => api.post('/appointments/book', data),
  getStudentAppointments: (studentId) => api.get('/appointments/student', { params: { studentId } }),
  getStaffAppointments: (staffId) => api.get('/appointments/staff', { params: { staffId } }),
  acceptAppointment: (id) => api.post(`/appointments/${id}/accept`),
  declineAppointment: (id) => api.post(`/appointments/${id}/decline`),
  completeAppointment: (id, remarks) => api.post(`/appointments/${id}/complete`, { remarks }),
  rateAppointment: (id, rating) => api.post(`/appointments/${id}/rate`, { rating }),
  
  // Admin
  getAdminStats: () => api.get('/admin/stats'),
  checkOverdue: () => api.post('/admin/check-overdue'),
  resolveFlag: (id) => api.post(`/admin/flagged/${id}/resolve`),
};

export default api;
