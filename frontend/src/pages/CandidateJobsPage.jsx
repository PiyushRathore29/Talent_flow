import React from 'react';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import CandidateJobsBoard from '../components/CandidateJobsBoard';

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