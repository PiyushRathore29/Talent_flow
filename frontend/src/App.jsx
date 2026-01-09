/*
 * MAIN APPLICATION COMPONENT - App.jsx
 *
 * APPLICATION ROUTING & AUTHENTICATION FLOW:
 * 1) App.jsx sets up the main routing structure and context providers
 * 2) AuthProvider wraps the app to manage user authentication state
 * 3) ThemeProvider manages dark/light mode across the application
 * 4) JobsProvider and CandidateProvider provide data access to components
 * 5) Routes are organized by user role (HR vs Candidate)
 *
 * USER FLOW EXPLANATION:
 * - New users: Start at landing page → Sign Up/Sign In → Role-based dashboard
 * - HR users: Dashboard → Jobs → Candidates → Assessments → Flow management
 * - Candidates: Dashboard → Available Jobs → Take Assessments → View progress
 *
 * ROUTE PROTECTION:
 * - Public routes: Landing pages, sign up/in (redirect if already authenticated)
 * - Protected routes: Require authentication and specific role permissions
 * - Role-based access: HR can access management features, candidates can only view/take assessments
 */

// REACT CORE:
import React from "react";

// ROUTING IMPORTS:
// BrowserRouter: Provides routing functionality for single-page application
// Routes/Route: Define application routes and their components
// Navigate: Programmatic navigation and redirects
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// CONTEXT PROVIDERS:
// AuthProvider: Manages authentication state globally
// ThemeProvider: Manages dark/light theme state globally
// Data providers: Provide job and candidate data access
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CandidateProvider } from "./hooks/useCandidates";
import { JobsProvider } from "./hooks/useJobs";

// PUBLIC LANDING PAGES:
// These pages are accessible without authentication
// Used for marketing, information, and user registration
import MainPage from "./pages/landing-page/MainPage";
import ServicesPage from "./pages/landing-page/ServicesPage";
import CompaniesPage from "./pages/landing-page/CompaniesPage";
import ProjectsPage from "./pages/landing-page/ProjectsPage";
import DocsPage from "./pages/landing-page/DocsPage";
import SignUpPage from "./pages/login/SignUpPage";
import SignInPage from "./pages/login/SignInPage";

// DASHBOARD AND MAIN APPLICATION PAGES:
// AnalyticsDashboard: HR main dashboard with metrics and analytics
// Candidate pages: Dashboard and job listing for candidates
// FlowDashboard: Visual job pipeline management
// JobsPage: HR job management interface
// JobDetailPage: Individual job details and management
// JobFlowPage: Job-specific pipeline configuration
// CandidatesPage: HR candidate management interface
// CandidateProfilePage: Individual candidate details and timeline
// DatabaseSeederPage: Development utility for database management
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import CandidateDashboardPage from "./pages/candidate-dashboards/CandidateDashboardPage";
import CandidateJobsPage from "./pages/candidate-dashboards/CandidateJobsPage";
import FlowDashboard from "./components/dashboard/FlowDashboard";
import JobsPage from "./pages/flow/JobsPage";
import JobDetailPage from "./pages/hr-dashboards/JobDetailPage";
import JobFlowPage from "./pages/flow/JobFlowPage";
import CandidatesPage from "./pages/hr-dashboards/CandidatesPage";
import CandidateProfilePage from "./pages/hr-dashboards/CandidateProfilePage";
import DatabaseSeederPage from "./pages/DatabaseSeederPage";

// ASSESSMENT SYSTEM COMPONENTS:
// AssessmentBuilderPage: HR interface for creating assessments
// AssessmentPreviewPage: Preview assessment before publishing
// AssessmentResponsesPage: View and analyze candidate responses
// AssessmentsListPage: List all assessments for a job
// AssessmentSubmit: Candidate interface for taking assessments
import { AssessmentBuilderPage as NewAssessmentBuilderPage } from "./features/assessments/pages/assessment-builder-page";
import { AssessmentPreviewPage } from "./features/assessments/pages/assessment-preview-page";
import { AssessmentResponsesPage } from "./features/assessments/pages/assessment-responses-page";
import { AssessmentsListPage } from "./features/assessments/pages/assessments-list-page";
import AssessmentSubmit from "./components/assessment/AssessmentSubmit";

// DEVELOPMENT AND UTILITY COMPONENTS:
// MSWTester: Mock Service Worker testing interface
// ProtectedRoute: Route protection wrapper for authentication
import MSWTester from "./components/common/MSWTester";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// PUBLIC ROUTE COMPONENT - Handles authentication redirect logic
// FLOW: When user visits public pages (signup/signin), this component checks:
// 1) If user is already authenticated → redirect to appropriate dashboard
// 2) If user is not authenticated → show the public page (signup/signin)
// 3) While checking authentication → show loading spinner
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Step 1: Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Step 2: If user is already logged in, redirect to their dashboard
  // HR users go to /dashboard, candidates go to /dashboard/candidate
  if (user) {
    return (
      <Navigate
        to={user.role === "hr" ? "/dashboard" : "/dashboard/candidate"}
        replace
      />
    );
  }

  // Step 3: User is not authenticated, show the public page
  return children;
};

// APP ROUTES COMPONENT - Defines all application routes with data providers
// FLOW: This component wraps the entire app with data providers and defines routing
// 1) JobsProvider provides job data access to all components
// 2) CandidateProvider provides candidate data access to all components
// 3) Routes are organized by access level (public, auth, protected)
function AppRoutes() {
  return (
    <JobsProvider>
      <CandidateProvider>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
          <Routes>
            {/* PUBLIC ROUTES - No authentication required */}
            {/* These routes are accessible to everyone and show marketing/landing content */}
            <Route path="/" element={<MainPage />} />
            <Route path="/features" element={<ServicesPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/docs" element={<DocsPage />} />

            {/* AUTHENTICATION ROUTES - Redirect if already logged in */}
            {/* PublicRoute component handles redirect logic for authenticated users */}
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

            {/* DEVELOPMENT TOOLS - For testing and database management */}
            <Route path="/msw-tester" element={<MSWTester />} />
            <Route path="/seed-database" element={<DatabaseSeederPage />} />

            {/* PROTECTED ROUTES - Require authentication and role-based access */}
            {/* HR DASHBOARD ROUTES - Only accessible to HR users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />

            {/* CANDIDATE DASHBOARD ROUTES - Only accessible to candidate users */}
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

            {/* FLOW MANAGEMENT ROUTES - HR only */}
            <Route
              path="/dashboard/flow/:jobId"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <FlowDashboard />
                </ProtectedRoute>
              }
            />

            {/* JOB MANAGEMENT ROUTES - HR only */}
            {/* FLOW: HR clicks "Jobs" → /jobs → can create/edit jobs → click specific job → /jobs/:jobId → can manage job flow */}
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

            {/* CANDIDATE MANAGEMENT ROUTES - HR only */}
            {/* FLOW: HR clicks "Candidates" → /candidates → view all candidates → click candidate → /candidates/:candidateId → view profile/timeline */}
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

            {/* ASSESSMENT ROUTES - Role-based access for different functions */}
            {/* HR ASSESSMENT FLOW: /assessments → create new assessment → /assessments/:jobId → build questions → /assessments/:jobId/preview → test assessment → /assessments/:jobId/responses → view submissions */}
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

            {/* CANDIDATE ASSESSMENT FLOW: Candidate clicks "Take Assessment" → /assessments/:jobId/submit → complete assessment → submit → redirect to jobs page */}
            <Route
              path="/assessments/:jobId/submit"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <AssessmentSubmit />
                </ProtectedRoute>
              }
            />

            {/* LEGACY ROUTE REDIRECTS - Maintain backward compatibility */}
            <Route
              path="/dashboard/employer"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* CATCH-ALL ROUTE - Redirect unknown routes to home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CandidateProvider>
    </JobsProvider>
  );
}

// MAIN APP COMPONENT - Sets up global context providers and routing
// FLOW: This is the root component that provides context to the entire application
// 1) Router enables client-side routing throughout the app
// 2) ThemeProvider manages dark/light mode state globally
// 3) AuthProvider manages user authentication state globally
// 4) AppRoutes defines all the application routes and components
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
