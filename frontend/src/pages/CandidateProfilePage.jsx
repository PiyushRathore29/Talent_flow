import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar,
  Briefcase,
  User,
  Clock,
  MapPin,
  Edit3,
  ExternalLink
} from 'lucide-react';
import Timeline from '../components/Timeline';
import { dbHelpers } from '../lib/database';

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        
        // Fetch candidate details
        const candidateResponse = await fetch(`/api/candidates/${candidateId}`);
        if (!candidateResponse.ok) {
          throw new Error('Candidate not found');
        }
        const candidateData = await candidateResponse.json();
        setCandidate(candidateData);

        // Fetch job details
        if (candidateData.jobId) {
          const jobResponse = await fetch(`/api/jobs/${candidateData.jobId}`);
          if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            setJob(jobData.data || jobData);
          }
        }

        // Fetch timeline entries for this candidate
        const timeline = await dbHelpers.getTimelineEntries(parseInt(candidateId));
        setTimelineEntries(timeline);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateData();
    }
  }, [candidateId]);

  const getStageInfo = (stage) => {
    const stageMap = {
      'applied': { name: 'Applied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'screen': { name: 'Screening', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      'tech': { name: 'Technical', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      'offer': { name: 'Offer', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      'hired': { name: 'Hired', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      'rejected': { name: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    };
    return stageMap[stage] || { name: stage, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Candidate</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Candidate Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The candidate you're looking for doesn't exist.</p>
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  const stageInfo = getStageInfo(candidate.stage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/candidates"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-4xl font-impact font-black uppercase text-primary-500 dark:text-primary-400 leading-none tracking-tight">
                  {candidate.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Candidate Profile • Applied {new Date(candidate.appliedDate || candidate.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${stageInfo.color}`}>
                {stageInfo.name}
              </span>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Candidate Details Card */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8 transition-colors duration-200">
              <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-6">
                Candidate Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                      <div className="font-medium">{candidate.email}</div>
                    </div>
                  </div>
                  
                  {candidate.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                        <div className="font-medium">{candidate.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Applied Date</div>
                      <div className="font-medium">
                        {new Date(candidate.appliedDate || candidate.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Application Details</h3>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Current Stage</div>
                      <div className="font-medium">{stageInfo.name}</div>
                    </div>
                  </div>
                  
                  {job && (
                    <>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Position</div>
                          <div className="font-medium">{job.title}</div>
                        </div>
                      </div>
                      
                      {job.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                            <div className="font-medium">{job.location}</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                      <div className="font-medium">
                        {new Date(candidate.updatedAt || candidate.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
                  Activity Timeline
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timelineEntries.length} activities
                </div>
              </div>
              
              <Timeline 
                entries={timelineEntries} 
                candidateId={parseInt(candidateId)}
                showCandidate={false}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-200">
              <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Schedule Interview
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Send Assessment
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Add Note
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Download Resume
                </button>
              </div>
            </div>

            {/* Job Details */}
            {job && (
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
                    Job Details
                  </h3>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Position</div>
                    <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                  </div>
                  
                  {job.department && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Department</div>
                      <div className="font-medium text-gray-900 dark:text-white">{job.department}</div>
                    </div>
                  )}
                  
                  {job.location && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                      <div className="font-medium text-gray-900 dark:text-white">{job.location}</div>
                    </div>
                  )}
                  
                  {job.type && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Type</div>
                      <div className="font-medium text-gray-900 dark:text-white">{job.type}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
