import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import SignUpPage from './pages/SignUpPage';
import CandidateSignUpPage from './pages/CandidateSignUpPage';
import EmployerSignUpPage from './pages/EmployerSignUpPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import AssessmentPage from './pages/AssessmentPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/jobs" element={<ProjectsPage />} />
          <Route path="/features" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/candidate" element={<CandidateSignUpPage />} />
          <Route path="/signup/employer" element={<EmployerSignUpPage />} />
          <Route path="/dashboard/candidate" element={<CandidateDashboardPage />} />
          <Route path="/dashboard/employer" element={<EmployerDashboardPage />} />
          <Route path="/assessment/:jobId" element={<AssessmentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
