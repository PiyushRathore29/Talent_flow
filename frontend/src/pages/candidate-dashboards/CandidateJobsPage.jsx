import React from "react";
import AuthenticatedHeader from "../../components/layout/AuthenticatedHeader";
import CandidateJobsBoard from "../../components/dashboard/CandidateJobsBoard";

const CandidateJobsPage = () => {
  return (
    <>
      <AuthenticatedHeader />
      <main>
        <CandidateJobsBoard />
      </main>
    </>
  );
};

export default CandidateJobsPage;
