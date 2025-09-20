import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CandidateProvider } from './hooks/useCandidates';
import { JobsProvider } from './hooks/useJobs';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import CandidateSignUpPage from './pages/CandidateSignUpPage';
import EmployerSignUpPage from './pages/EmployerSignUpPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import CandidateJobsPage from './pages/CandidateJobsPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentTakePage from './pages/AssessmentTakePage';
import AssessmentResponsesViewer from './pages/AssessmentResponsesViewer';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import AssessmentBuilder from './components/AssessmentBuilder';

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'hr' ? '/dashboard/employer' : '/dashboard/candidate'} replace />;
  }
  
  return children;
};

// Public route component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={user.role === 'hr' ? '/dashboard/employer' : '/dashboard/candidate'} replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <JobsProvider>
      <CandidateProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AboutPage />} />
            <Route path="/jobs" element={<ProjectsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/features" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Auth routes */}
            <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
            
            {/* Legacy signup routes - redirect to new signup */}
            <Route path="/signup/candidate" element={<Navigate to="/signup" replace />} />
            <Route path="/signup/employer" element={<Navigate to="/signup" replace />} />
            
            {/* Protected candidate routes */}
            <Route path="/dashboard/candidate" element={
              <ProtectedRoute requiredRole="candidate">
                <CandidateDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/candidate/jobs" element={
              <ProtectedRoute requiredRole="candidate">
                <CandidateJobsPage />
              </ProtectedRoute>
            } />
            
            {/* Protected HR routes */}
            <Route path="/dashboard/employer" element={
              <ProtectedRoute requiredRole="hr">
                <Navigate to="/dashboard/employer/overview" replace />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/employer/overview" element={
              <ProtectedRoute requiredRole="hr">
                <EmployerDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/employer/:jobId" element={
              <ProtectedRoute requiredRole="hr">
                <EmployerDashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/candidates" element={
              <ProtectedRoute requiredRole="hr">
                <CandidatesPage />
              </ProtectedRoute>
            } />
            <Route path="/candidates/:candidateId" element={
              <ProtectedRoute requiredRole="hr">
                <CandidateProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Assessment routes */}
            <Route path="/assessment/:assessmentId" element={
              <ProtectedRoute requiredRole="candidate">
                <AssessmentTakePage />
              </ProtectedRoute>
            } />
            <Route path="/assessment/:assessmentId/responses" element={
              <ProtectedRoute requiredRole="hr">
                <AssessmentResponsesViewer />
              </ProtectedRoute>
            } />
            <Route path="/assessment/:jobId/builder" element={
              <ProtectedRoute requiredRole="hr">
                <div className="min-h-screen">
                  <AssessmentBuilder />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/assessment/:jobId/take" element={
              <ProtectedRoute requiredRole="candidate">
                <AssessmentPage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CandidateProvider>
    </JobsProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
