import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandidateSignUpForm from '../components/CandidateSignUpForm';

const CandidateSignUpPage = () => {
  return (
    <>
      <Header />
      <main>
        <CandidateSignUpForm />
      </main>
      <Footer />
    </>
  );
};

export default CandidateSignUpPage;
