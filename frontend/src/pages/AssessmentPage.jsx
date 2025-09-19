import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Assessment from '../components/Assessment';

const AssessmentPage = () => {
  return (
    <>
      <Header />
      <main>
        <Assessment />
      </main>
      <Footer />
    </>
  );
};

export default AssessmentPage;
