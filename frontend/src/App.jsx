import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CandidateProvider } from "./hooks/useCandidates";
import { JobsProvider } from "./hooks/useJobs";

// Public pages
import MainPage from "./pages/landing-page/MainPage";
import ServicesPage from "./pages/landing-page/ServicesPage";
import CompaniesPage from "./pages/landing-page/CompaniesPage";
import ProjectsPage from "./pages/landing-page/ProjectsPage";
import DocsPage from "./pages/landing-page/DocsPage";
import SignUpPage from "./pages/login/SignUpPage";
import SignInPage from "./pages/login/SignInPage";

// Dashboard and main pages
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CandidateDashboardPage from "./pages/candidate-dashboards/CandidateDashboardPage";
import CandidateJobsPage from "./pages/candidate-dashboards/CandidateJobsPage";
import FlowDashboard from "./components/FlowDashboard";
import JobsPage from "./pages/flow/JobsPage";
import JobDetailPage from "./pages/hr-dashboards/JobDetailPage";
import JobFlowPage from "./pages/flow/JobFlowPage";
import CandidatesPage from "./pages/hr-dashboards/CandidatesPage";
import CandidateProfilePage from "./pages/hr-dashboards/CandidateProfilePage";
import DatabaseSeederPage from "./pages/DatabaseSeederPage";

// New assessment components from the assessment folder
import { AssessmentBuilderPage as NewAssessmentBuilderPage } from "./assesment/assessments/pages/assessment-builder-page";
import { AssessmentPreviewPage } from "./assesment/assessments/pages/assessment-preview-page";
import { AssessmentResponsesPage } from "./assesment/assessments/pages/assessment-responses-page";
import { AssessmentsListPage } from "./assesment/assessments/pages/assessments-list-page";
import AssessmentSubmit from "./components/AssessmentSubmit";

// Development tools
import MSWTester from "./components/MSWTester";

// Protected route component
import ProtectedRoute from "./components/ProtectedRoute";

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
    return (
      <Navigate
        to={user.role === "hr" ? "/dashboard" : "/dashboard/candidate"}
        replace
      />
    );
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
            <Route path="/" element={<MainPage />} />
            <Route path="/features" element={<ServicesPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/docs" element={<DocsPage />} />

            {/* Auth routes */}
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignInPage />
                </PublicRoute>
              }
            />

            {/* Development tools */}
            <Route path="/msw-tester" element={<MSWTester />} />
            <Route path="/seed-database" element={<DatabaseSeederPage />} />

            {/* Main application routes - Role-based access control */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/candidate"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/candidate/jobs"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/flow/:jobId"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <FlowDashboard />
                </ProtectedRoute>
              }
            />

            {/* Jobs routes - HR only */}
            <Route
              path="/jobs"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <JobDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId/flow"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <JobFlowPage />
                </ProtectedRoute>
              }
            />

            {/* Candidates routes - HR only */}
            <Route
              path="/candidates"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <CandidatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates/:candidateId"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <CandidateProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates/:candidateId/timeline"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <CandidateProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Assessments routes - HR can create, candidates can take */}
            <Route
              path="/assessments"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <AssessmentsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments/:jobId"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <NewAssessmentBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments/:jobId/preview"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <AssessmentPreviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments/:jobId/responses"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <AssessmentResponsesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments/:jobId/submit"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <AssessmentSubmit />
                </ProtectedRoute>
              }
            />
            {/* Redirect legacy routes */}
            <Route
              path="/dashboard/employer"
              element={<Navigate to="/dashboard" replace />}
            />

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
