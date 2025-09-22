import React from 'react';
import Header from '../components/Header';
import CompaniesHeroSection from '../components/CompaniesHeroSection';
import CompaniesSection from '../components/CompaniesSection';
import Footer from '../components/Footer';

const CompaniesPage = () => {
  return (
    <>
      <Header />
      <CompaniesHeroSection />
      <CompaniesSection />
      <Footer />
    </>
  );
};

export default CompaniesPage;