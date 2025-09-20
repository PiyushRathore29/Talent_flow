import React from 'react';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import Footer from '../components/Footer';
import CandidatesBoard from '../components/CandidatesBoard';

const CandidatesPage = () => {
  return (
    <>
      <AuthenticatedHeader />
      <main className="pt-8 pb-12 lg:pb-24 bg-primary-50">
        <CandidatesBoard />
      </main>
      <Footer />
    </>
  );
};

export default CandidatesPage;
