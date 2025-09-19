import React from 'react';
import Header from '../components/Header';
import ProjectsHeroSection from '../components/ProjectsHeroSection';
import ProjectsSection from '../components/ProjectsSection';
import ProjectsStatsSection from '../components/ProjectsStatsSection';
import ProjectsCTASection from '../components/ProjectsCTASection';
import Footer from '../components/Footer';

const ProjectsPage = () => {
  return (
    <>
      <Header />
      <ProjectsHeroSection />
      <ProjectsSection />
      <ProjectsStatsSection />
      <ProjectsCTASection />
      <Footer />
    </>
  );
};

export default ProjectsPage;
