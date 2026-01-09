import React from "react";
import Header from "../../components/layout/Header";
import CompaniesHeroSection from "../../components/landing/CompaniesHeroSection";
import CompaniesSection from "../../components/landing/CompaniesSection";
import Footer from "../../components/layout/Footer";

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
