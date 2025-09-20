import React from 'react';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import Footer from '../components/Footer';
import CandidateDashboard from '../components/CandidateDashboard';

const CandidateDashboardPage = () => {
  return (
    <>
      <AuthenticatedHeader />
      <main>
        <CandidateDashboard />
      </main>
      <Footer />
    </>
  );
};

export default CandidateDashboardPage;
