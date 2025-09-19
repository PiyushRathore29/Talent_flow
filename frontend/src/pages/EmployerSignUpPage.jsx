import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmployerSignUpForm from '../components/EmployerSignUpForm';

const EmployerSignUpPage = () => {
  return (
    <>
      <Header />
      <main>
        <EmployerSignUpForm />
      </main>
      <Footer />
    </>
  );
};

export default EmployerSignUpPage;
