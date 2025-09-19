import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SignUpOptions from '../components/SignUpOptions';

const SignUpPage = () => {
  return (
    <>
      <Header />
      <main>
        <SignUpOptions />
      </main>
      <Footer />
    </>
  );
};

export default SignUpPage;
