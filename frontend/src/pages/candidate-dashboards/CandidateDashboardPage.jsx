import React from "react";
import AuthenticatedHeader from "../../components/layout/AuthenticatedHeader";
import Footer from "../../components/layout/Footer";
import CandidateDashboard from "../../components/dashboard/CandidateDashboard";

const CandidateDashboardPage = () => {
  return (
    <>
      <AuthenticatedHeader />
      <main>
        <CandidateDashboard />
      </main>
      <Footer />
    </>
  );
};

export default CandidateDashboardPage;
