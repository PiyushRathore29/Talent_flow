import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CandidateProvider } from './hooks/useCandidates';
import { JobsProvider } from './hooks/useJobs';

// Public pages
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CompaniesPage from './pages/CompaniesPage';
import ProjectsPage from './pages/ProjectsPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

// Dashboard and main pages
import DashboardPage from './pages/DashboardPage';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FlowDashboard from './components/FlowDashboard';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import JobFlowPage from './pages/JobFlowPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';
import AssessmentTakePage from './pages/AssessmentTakePage';
import DatabaseSeederPage from './pages/DatabaseSeederPage';

// Development tools
import MSWTester from './components/MSWTester';

// Protected route component
const ProtectedRoute = ({ children }) => {
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
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AboutPage />} />
            <Route path="/features" element={<ServicesPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Auth routes */}
            <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
            
            {/* Development tools */}
            <Route path="/msw-tester" element={<MSWTester />} />
            <Route path="/seed-database" element={<DatabaseSeederPage />} />
            
            {/* Main application routes - matching API patterns */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/flow/:jobId" element={
              <ProtectedRoute>
                <FlowDashboard />
              </ProtectedRoute>
            } />
            
            {/* Jobs routes - GET /jobs, POST /jobs, PATCH /jobs/:id, PATCH /jobs/:id/reorder */}
            <Route path="/jobs" element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:jobId" element={
              <ProtectedRoute>
                <JobDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:jobId/flow" element={
              <ProtectedRoute>
                <JobFlowPage />
              </ProtectedRoute>
            } />
            
            {/* Candidates routes - GET /candidates, POST /candidates, PATCH /candidates/:id, GET /candidates/:id/timeline */}
            <Route path="/candidates" element={
              <ProtectedRoute>
                <CandidatesPage />
              </ProtectedRoute>
            } />
            <Route path="/candidates/:candidateId" element={
              <ProtectedRoute>
                <CandidateProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/candidates/:candidateId/timeline" element={
              <ProtectedRoute>
                <CandidateProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Assessments routes - GET /assessments/:jobId, PUT /assessments/:jobId, POST /assessments/:jobId/submit */}
            <Route path="/assessments" element={
              <ProtectedRoute>
                <AssessmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/assessments/:jobId" element={
              <ProtectedRoute>
                <AssessmentBuilderPage />
              </ProtectedRoute>
            } />
            <Route path="/assessments/:jobId/take" element={
              <ProtectedRoute>
                <AssessmentTakePage />
              </ProtectedRoute>
            } />
            <Route path="/assessments/:jobId/submit" element={
              <ProtectedRoute>
                <AssessmentTakePage />
              </ProtectedRoute>
            } />
            
            {/* Redirect legacy routes */}
            <Route path="/dashboard/employer" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/candidate" element={<Navigate to="/dashboard" replace />} />
            
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
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
