import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for 401 unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local auth
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Student Portal Services
export const studentApi = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getFullProfile: () => api.get('/student/full-profile'),
  getStudentProfileById: (id) => api.get(`/student/profiles/${id}`),
  addEducation: (data) => api.post('/student/education', data),
  deleteEducation: (id) => api.delete(`/student/education/${id}`),
  addSkill: (data) => api.post('/student/skills', data),
  deleteSkill: (id) => api.delete(`/student/skills/${id}`),
  addProject: (data) => api.post('/student/projects', data),
  deleteProject: (id) => api.delete(`/student/projects/${id}`),
  addInternship: (data) => api.post('/student/internships', data),
  deleteInternship: (id) => api.delete(`/student/internships/${id}`),
  addCertification: (data) => api.post('/student/certifications', data),
  deleteCertification: (id) => api.delete(`/student/certifications/${id}`),
  uploadResume: (data) => api.post('/student/resume', data),
};

// Placement Drives Services
export const drivesApi = {
  getAllDrives: () => api.get('/drives'),
  getDriveById: (id) => api.get(`/drives/${id}`),
  createDrive: (data) => api.post('/recruiter/drives', data),
  updateDrive: (id, data) => api.put(`/recruiter/drives/${id}`, data),
  updateStatus: (id, status) => api.patch(`/officer/drives/${id}/status?status=${status}`),
};

// Applications Services
export const applicationApi = {
  apply: (data) => api.post('/student/applications', data),
  withdraw: (id) => api.patch(`/student/applications/${id}/withdraw`),
  getMyApplications: () => api.get('/student/applications'),
  getCompanyApplicants: () => api.get('/recruiter/applications'),
  getDriveApplicants: (driveId) => api.get(`/recruiter/drives/${driveId}/applicants`),
  updateStatus: (id, data) => api.patch(`/recruiter/applications/${id}/status`, data),
};

// Interviews Services
export const interviewApi = {
  schedule: (data) => api.post('/recruiter/interviews', data),
  getStudentInterviews: () => api.get('/student/interviews'),
  getRecruiterInterviews: () => api.get('/recruiter/interviews'),
  updateInterview: (id, data) => api.patch(`/interviews/${id}`, data),
};

// Job Offers Services
export const offerApi = {
  generateOffer: (data) => api.post('/recruiter/offers', data),
  getStudentOffers: () => api.get('/student/offers'),
  respondToOffer: (id, status) => api.patch(`/student/offers/${id}/respond`, { status }),
  getCompanyOffers: () => api.get('/recruiter/offers'),
};

// Recruiter Portal Services
export const recruiterApi = {
  getDashboard: () => api.get('/recruiter/dashboard'),
  getProfile: () => api.get('/recruiter/profile'),
  updateCompany: (data) => api.put('/recruiter/company', data),
  getMyDrives: () => api.get('/recruiter/my-drives'),
};

// Placement Officer Services
export const officerApi = {
  getDashboard: () => api.get('/officer/dashboard'),
  getStudents: () => api.get('/officer/students'),
  getCompanies: () => api.get('/officer/companies'),
  toggleCompanyVerification: (id, verified) => api.patch(`/officer/companies/${id}/verify?verified=${verified}`),
  getApplications: () => api.get('/officer/applications'),
};

// Admin Services
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id, active) => api.patch(`/admin/users/${id}/status?active=${active}`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role?role=${role}`),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

// Notifications Services
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/mark-all-read'),
};

export default api;
