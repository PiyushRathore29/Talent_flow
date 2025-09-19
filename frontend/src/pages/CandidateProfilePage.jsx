import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandidateProfile from '../components/CandidateProfile';
import { useCandidates } from '../hooks/useCandidates';

const ProfileContent = () => {
  const { candidateId } = useParams();
  const { findCandidate } = useCandidates();
  const candidate = findCandidate(candidateId);

  if (!candidate) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">Candidate not found</h2>
          <p className="text-gray-500 mt-2">The profile you are looking for does not exist.</p>
          <Link to="/candidates" className="mt-6 inline-block bg-primary-400 text-white px-6 py-3 rounded-lg font-semibold">
            Back to Candidates Board
          </Link>
        </div>
      </div>
    );
  }

  return <CandidateProfile candidate={candidate} />;
};

const CandidateProfilePage = () => {
  return (
    <>
      <Header />
      <main className="pt-32 lg:pt-40 pb-12 lg:pb-24 bg-white">
        <div className="px-4 sm:px-8 lg:px-24">
          <div className="max-w-screen-xl mx-auto">
            <ProfileContent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CandidateProfilePage;
