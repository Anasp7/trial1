import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsersPage from './pages/Admin/ManageUsersPage';

// Alumni pages
import AlumniDashboard from './pages/Alumni/AlumniDashboard';
import AlumniProfilePage from './pages/Alumni/ProfilePage';
import AlumniOpportunitiesPage from './pages/Alumni/OpportunitiesPage';
import AlumniInternshipPage from './pages/Alumni/InternshipPage';
import AlumniScholarshipPage from './pages/Alumni/ScholarshipPage';
import AlumniMentorshipPage from './pages/Alumni/MentorshipPage';
import AlumniSuccessStoriesPage from './pages/Alumni/SuccessStoriesPage';
import AlumniApplicationsPage from './pages/Alumni/ApplicationsPage';

// Student pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfilePage from './pages/Student/ProfilePage';
import StudentOpportunitiesPage from './pages/Student/OpportunitiesPage';
import StudentInternshipPage from './pages/Student/InternshipPage';
import StudentScholarshipPage from './pages/Student/ScholarshipPage';
import StudentMentorshipPage from './pages/Student/MentorshipPage';
import StudentApplicationsPage from './pages/Student/MyApplicationsPage';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const DashboardLayout = ({ children }) => {
    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar userRole={user.role} onLogout={logout} />
          <div className="flex-1 ml-0 md:ml-0">
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {!isAuthenticated && <Navbar />}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated && user ? 
                <Navigate to={`/${user.role}/dashboard`} replace /> : 
                <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated && user ? 
                <Navigate to={`/${user.role}/dashboard`} replace /> : 
                <RegisterPage />
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <ManageUsersPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Alumni Routes */}
          <Route 
            path="/alumni/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/profile" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/:id" 
            element={
              <ProtectedRoute allowedRoles={['alumni','admin','student']}>
                <DashboardLayout>
                  <StudentProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/opportunities" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniOpportunitiesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/internships" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniInternshipPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/scholarships" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniScholarshipPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/mentorship" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniMentorshipPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/success-stories" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniSuccessStoriesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni/applications" 
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <DashboardLayout>
                  <AlumniApplicationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/opportunities" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentOpportunitiesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/internships" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentInternshipPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/scholarships" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentScholarshipPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/mentorship" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentMentorshipPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/applications" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentApplicationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Redirect to dashboard if authenticated */}
          <Route 
            path="*" 
            element={
              isAuthenticated && user ? 
                <Navigate to={`/${user.role}/dashboard`} replace /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>

        {!isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
