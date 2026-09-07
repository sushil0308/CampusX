import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { AboutPage } from './pages/public/AboutPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { DrivesCatalogPage } from './pages/student/DrivesCatalogPage';
import { DriveDetailsPage } from './pages/student/DriveDetailsPage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { StudentInterviewsPage } from './pages/student/StudentInterviewsPage';
import { StudentOffersPage } from './pages/student/StudentOffersPage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyProfilePage } from './pages/recruiter/CompanyProfilePage';
import { ManageDrivesPage } from './pages/recruiter/ManageDrivesPage';
import { CreateDrivePage } from './pages/recruiter/CreateDrivePage';
import { DriveApplicantsPage } from './pages/recruiter/DriveApplicantsPage';
import { RecruiterInterviewsPage } from './pages/recruiter/RecruiterInterviewsPage';

// Placement Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { ManageStudentsPage } from './pages/officer/ManageStudentsPage';
import { ManageCompaniesPage } from './pages/officer/ManageCompaniesPage';
import { ApproveDrivesPage } from './pages/officer/ApproveDrivesPage';
import { PlacementReportsPage } from './pages/officer/PlacementReportsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register', '/about'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar />}

        <main className={`flex-1 ${showSidebar ? 'p-6 sm:p-8 max-w-7xl mx-auto w-full' : 'w-full'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Student Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/drives"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <DrivesCatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/drives/:id"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <DriveDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <MyApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/interviews"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentInterviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/offers"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentOffersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentNotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/company"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <CompanyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/drives"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <ManageDrivesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/create-drive"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <CreateDrivePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/applicants"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <DriveApplicantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/interviews"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <RecruiterInterviewsPage />
                </ProtectedRoute>
              }
            />

            {/* Placement Officer Protected Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/students"
              element={
                <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
                  <ManageStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/companies"
              element={
                <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
                  <ManageCompaniesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/drives"
              element={
                <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
                  <ApproveDrivesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/reports"
              element={
                <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
                  <PlacementReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
