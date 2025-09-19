import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandidatesBoard from '../components/CandidatesBoard';

const CandidatesPage = () => {
  return (
    <>
      <Header />
      <main className="pt-32 lg:pt-40 pb-12 lg:pb-24 bg-primary-50">
        <CandidatesBoard />
      </main>
      <Footer />
    </>
  );
};

export default CandidatesPage;
