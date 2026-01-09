import React from "react";
import Header from "../../components/layout/Header";
import ServicesHeroSection from "../../components/landing/ServicesHeroSection";
import ServiceImagesSection from "../../components/landing/ServiceImagesSection";
import BrandStrategySection from "../../components/landing/BrandStrategySection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import ProcessSection from "../../components/landing/ProcessSection";
import Footer from "../../components/layout/Footer";

const ServicesPage = () => {
  return (
    <>
      <Header />
      <ServicesHeroSection />
      <ServiceImagesSection />
      <BrandStrategySection />
      <TestimonialsSection />
      <ProcessSection />
      <Footer />
    </>
  );
};

export default ServicesPage;
