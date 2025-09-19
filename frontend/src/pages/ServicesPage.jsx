import React from 'react';
import Header from '../components/Header';
import ServicesHeroSection from '../components/ServicesHeroSection';
import ServiceImagesSection from '../components/ServiceImagesSection';
import BrandStrategySection from '../components/BrandStrategySection';
import TestimonialsSection from '../components/TestimonialsSection';
import ProcessSection from '../components/ProcessSection';
import Footer from '../components/Footer';

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
