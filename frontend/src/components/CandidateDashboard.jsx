import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { dbHelpers } from '../lib/database';
import { FileText, Clock, CheckCircle, MapPin, DollarSign, Calendar, Briefcase, Loader, ExternalLink, Plus, Eye } from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      if (!user || user.role !== 'candidate') {
        setLoading(false);
        return;
      }

      try {
        // Load user's applications
        const userApplications = await dbHelpers.getApplicationsByCandidate(user.id);
        setApplications(userApplications);

        // Load candidate records that show current stage
        const candidateRecords = await dbHelpers.getCandidatesByUserId(user.id);
        setCandidates(candidateRecords);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!jobsLoading) {
      loadApplications();
    }
  }, [user, jobs, jobsLoading]);

  // Add periodic refresh to check for stage updates
  useEffect(() => {
    if (!user || user.role !== 'candidate') return;

    const refreshInterval = setInterval(async () => {
      try {
        // Refresh candidate records to get latest stage updates
        const candidateRecords = await dbHelpers.getCandidatesByUserId(user.id);
        setCandidates(candidateRecords);
      } catch (error) {
        console.error('Failed to refresh candidate data:', error);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(refreshInterval);
  }, [user]);

  const getStatusDisplay = (status, currentStageId) => {
    // If we have a candidate record with stage information, use that
    if (currentStageId) {
      const stageId = currentStageId.toLowerCase();
      if (stageId.includes('applied')) {
        return {
          icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
          text: 'Application Submitted',
          className: 'bg-blue-100 text-blue-700'
        };
      } else if (stageId.includes('screening') || stageId.includes('review')) {
        return {
          icon: <FileText className="w-4 h-4 text-orange-500" />,
          text: 'Under Review',
          className: 'bg-orange-100 text-orange-700'
        };
      } else if (stageId.includes('assessment') || stageId.includes('test') || stageId.includes('oa')) {
        return {
          icon: <FileText className="w-4 h-4 text-indigo-500" />,
          text: 'Assessment Required',
          className: 'bg-indigo-100 text-indigo-700',
          isAssessment: true
        };
      } else if (stageId.includes('interview')) {
        return {
          icon: <Clock className="w-4 h-4 text-purple-500" />,
          text: 'Interview Stage',
          className: 'bg-purple-100 text-purple-700'
        };
      } else if (stageId.includes('offer')) {
        return {
          icon: <FileText className="w-4 h-4 text-green-500" />,
          text: 'Offer Stage',
          className: 'bg-green-100 text-green-700'
        };
      } else if (stageId.includes('hired') || stageId.includes('accepted')) {
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: 'Hired',
          className: 'bg-green-100 text-green-700'
        };
      } else if (stageId.includes('rejected') || stageId.includes('declined')) {
        return {
          icon: <Clock className="w-4 h-4 text-red-500" />,
          text: 'Not Selected',
          className: 'bg-red-100 text-red-700'
        };
      }
    }

    // Fallback to original application status
    switch (status) {
      case 'Applied':
        return {
          icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
          text: 'Application Submitted',
          className: 'bg-blue-100 text-blue-700'
        };
      case 'Screening':
        return {
          icon: <FileText className="w-4 h-4 text-orange-500" />,
          text: 'Under Review',
          className: 'bg-orange-100 text-orange-700'
        };
      case 'Interview':
        return {
          icon: <Clock className="w-4 h-4 text-purple-500" />,
          text: 'Interview Scheduled',
          className: 'bg-purple-100 text-purple-700'
        };
      case 'Offer':
        return {
          icon: <FileText className="w-4 h-4 text-green-500" />,
          text: 'Offer Extended',
          className: 'bg-green-100 text-green-700'
        };
      case 'Hired':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: 'Hired',
          className: 'bg-green-100 text-green-700'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-gray-500" />,
          text: status,
          className: 'bg-gray-100 text-gray-700'
        };
    }
  };

  // Helper function to get current stage for an application
  const getCurrentStage = (jobId) => {
    const candidateRecord = candidates.find(c => c.jobId === parseInt(jobId));
    return candidateRecord?.currentStageId;
  };

  // Handle assessment navigation
  const handleStartAssessment = async (jobId, stageId) => {
    try {
      console.log('🎯 Starting assessment for job:', jobId, 'stage:', stageId);
      
      // Find the assessment for this stage
      const assessments = await dbHelpers.getAssessmentsByJob(parseInt(jobId));
      const stageAssessment = assessments.find(assessment => assessment.stageId === stageId);
      
      if (stageAssessment) {
        console.log('📝 Found assessment:', stageAssessment);
        // Navigate to assessment page
        // For now, we'll show an alert - later we'll create a proper assessment page
        alert(`Assessment found: ${stageAssessment.title}\n\nThis will open the assessment interface (coming soon!)`);
      } else {
        console.log('❌ No assessment found for stage:', stageId);
        alert('No assessment found for this stage. Please contact HR.');
      }
    } catch (error) {
      console.error('Failed to load assessment:', error);
      alert('Failed to load assessment. Please try again.');
    }
  };

  if (loading || jobsLoading) {
    return (
      <section className="min-h-screen bg-primary-50 py-24">
        <div className="pt-16 pb-12 px-4 sm:px-8 lg:px-24">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-6 h-6 animate-spin text-primary-600" />
                <span className="text-lg text-gray-600">Loading dashboard...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-primary-50 py-8">
      <div className="pt-8 pb-12 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading font-impact font-black uppercase text-primary-500">
                  Welcome, {user?.firstName}
                </h1>
                <p className="mt-2 text-body text-primary-500/70">
                  Track your applications and discover new opportunities.
                </p>
              </div>
              <Link
                to="/dashboard/candidate/jobs"
                className="flex items-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Browse Jobs
              </Link>
            </div>
          </div>

          {/* My Applications Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-700">My Applications</h2>
              <span className="text-sm text-gray-600">
                {applications.length} application{applications.length !== 1 ? 's' : ''} total
              </span>
            </div>
            {applications.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b">
                      <tr>
                        <th className="p-6 font-inter font-semibold text-primary-700">Job Title</th>
                        <th className="p-6 font-inter font-semibold text-primary-700">Company</th>
                        <th className="p-6 font-inter font-semibold text-primary-700">Applied Date</th>
                        <th className="p-6 font-inter font-semibold text-primary-700">Status</th>
                        <th className="p-6 font-inter font-semibold text-primary-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => {
                        const job = jobs[app.jobId];
                        const currentStageId = getCurrentStage(app.jobId);
                        const statusDisplay = getStatusDisplay(app.status, currentStageId);
                        return (
                          <tr key={app.id} className={index < applications.length - 1 ? 'border-b' : ''}>
                            <td className="p-6 font-inter font-semibold text-primary-500">
                              {job?.details?.title || 'Job Not Found'}
                            </td>
                            <td className="p-6 font-inter text-primary-500/80">
                              {job?.details?.companyName || 'Unknown Company'}
                            </td>
                            <td className="p-6 font-inter text-primary-500/60">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="p-6">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusDisplay.className}`}>
                                {statusDisplay.icon}
                                {statusDisplay.text}
                              </span>
                            </td>
                            <td className="p-6">
                              {statusDisplay.isAssessment ? (
                                <button 
                                  className="font-inter font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
                                  onClick={() => handleStartAssessment(app.jobId, currentStageId)}
                                >
                                  <FileText className="w-4 h-4" />
                                  Take Assessment
                                </button>
                              ) : job ? (
                                <Link 
                                  to={`/jobs/${job.id}`} 
                                  className="font-inter font-semibold text-primary-400 hover:underline inline-flex items-center gap-1"
                                >
                                  View Job
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                <p className="text-gray-500 mb-4">Start your job search by browsing available opportunities.</p>
                <Link
                  to="/dashboard/candidate/jobs"
                  className="inline-flex items-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandidateDashboard;
