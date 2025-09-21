import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import Footer from '../components/Footer';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Job not found');
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return;
        }
        
        const data = await response.json();
        setJob(data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch job:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
              {error}
            </h2>
            <p className="text-gray-500 mb-6">The job you are looking for does not exist.</p>
            <Link 
              to="/employer-dashboard" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-impact font-bold uppercase text-primary-500 tracking-tight">
                {job.title}
              </h1>
              <p className="text-gray-600 mt-1">{job.department || 'General'}</p>
              <p className="text-sm text-blue-600 mt-1">
                {job.location || 'Remote'} • {job.employmentType || 'Full-time'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/employer-dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                job.status === 'active' ? 'bg-green-100 text-green-800' :
                job.status === 'closed' ? 'bg-red-100 text-red-800' :
                job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
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
                Job Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">
                  {job.description || 'No description provided for this job.'}
                </p>
              </div>
            </div>

            {job.tags && job.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                Job Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{job.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{job.employmentType || 'Full-time'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{job.location || 'Remote'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{job.department || 'General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to={`/jobs/${jobId}/flow`}
                  className="w-full px-4 py-2 text-center bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors block"
                >
                  View Job Flow
                </Link>
                <Link
                  to={`/assessments/${jobId}`}
                  className="w-full px-4 py-2 text-center bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors block"
                >
                  Edit Assessment
                </Link>
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

export default JobDetailPage;
