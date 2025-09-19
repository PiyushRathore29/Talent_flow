import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CandidateProvider } from './hooks/useCandidates';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import SignUpPage from './pages/SignUpPage';
import CandidateSignUpPage from './pages/CandidateSignUpPage';
import EmployerSignUpPage from './pages/EmployerSignUpPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateProfilePage from './pages/CandidateProfilePage';

function App() {
  return (
    <Router>
      <CandidateProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/jobs" element={<ProjectsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/features" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signup/candidate" element={<CandidateSignUpPage />} />
            <Route path="/signup/employer" element={<EmployerSignUpPage />} />
            <Route path="/dashboard/candidate" element={<CandidateDashboardPage />} />
            <Route path="/dashboard/employer" element={<Navigate to="/dashboard/employer/1" replace />} />
            <Route path="/dashboard/employer/:jobId" element={<EmployerDashboardPage />} />
            <Route path="/assessment/:jobId" element={<AssessmentPage />} />
          </Routes>
        </div>
      </CandidateProvider>
    </Router>
  );
}

export default App;
