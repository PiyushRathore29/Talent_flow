import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandidateDashboard from '../components/CandidateDashboard';

const CandidateDashboardPage = () => {
  return (
    <>
      <Header />
      <main>
        <CandidateDashboard />
      </main>
      <Footer />
    </>
  );
};

export default CandidateDashboardPage;
