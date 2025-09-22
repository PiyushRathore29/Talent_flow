import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import Footer from '../components/Footer';

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/candidates/${candidateId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Candidate not found');
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return;
        }
        
        const candidateData = await response.json();
        setCandidate(candidateData);
        
        // Also fetch the job details
        if (candidateData.jobId) {
          const jobResponse = await fetch(`/api/jobs/${candidateData.jobId}`);
          if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            setJob(jobData.data);
          }
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch candidate:', err);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <AuthenticatedHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-8 text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
              {error}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-6">The candidate profile you are looking for does not exist.</p>
            <Link 
              to="/candidates" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Candidates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <AuthenticatedHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-impact font-bold uppercase text-primary-500 tracking-tight">
                {candidate.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{candidate.email}</p>
              {job && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Applied to: {job.title}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/candidates"
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                ← Back to Candidates
              </Link>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                candidate.stage === 'hired' ? 'bg-green-100 text-green-800' :
                candidate.stage === 'rejected' ? 'bg-red-100 text-red-800' :
                candidate.stage === 'offer' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {candidate.stage?.charAt(0).toUpperCase() + candidate.stage?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">{candidate.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{candidate.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p className="mt-1 text-gray-900">
                    {candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Information */}
            {job && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                  Applied Position
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <p className="mt-1 text-gray-900">{job.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-gray-900">{job.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-gray-900">{job.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                    <p className="mt-1 text-gray-900">{job.employmentType || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to={`/candidates/${candidateId}/timeline`}
                  className="w-full px-4 py-2 text-center bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors block"
                >
                  View Timeline
                </Link>
                {job && (
                  <Link
                    to={`/jobs/${job.id}`}
                    className="w-full px-4 py-2 text-center bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors block"
                  >
                    View Job Details
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{candidate.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied:</span>
                  <span className="font-medium">
                    {candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
