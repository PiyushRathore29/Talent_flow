import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmployerDashboard from '../components/EmployerDashboard';

const EmployerDashboardPage = () => {
  return (
    <>
      <Header />
      <main>
        <EmployerDashboard />
      </main>
      <Footer />
    </>
  );
};

export default EmployerDashboardPage;
