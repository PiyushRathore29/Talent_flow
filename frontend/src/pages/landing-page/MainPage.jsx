import React from "react";
import Header from "../../components/layout/Header";
import HeroSection from "../../components/landing/HeroSection";
import TeamSection from "../../components/landing/TeamSection";
import AwardsSection from "../../components/landing/AwardsSection";
import Footer from "../../components/layout/Footer";

const MainPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <TeamSection />
      <AwardsSection />
      <Footer />
    </>
  );
};

export default MainPage;
