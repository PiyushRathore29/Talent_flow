import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { dbHelpers } from '../lib/database';
import Header from '../components/Header';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import Footer from '../components/Footer';
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle, Loader } from 'lucide-react';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { jobs } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadJobData = async () => {
      try {
        // Get job from jobs context or database
        const jobData = jobs[jobId];
        if (jobData) {
          setJob(jobData.details);
          
          // Check if user has already applied (for candidates)
          if (user && user.role === 'candidate') {
            const userApplications = await dbHelpers.getApplicationsByCandidate(user.id);
            const applicationExists = userApplications.some(app => app.jobId === parseInt(jobId));
            setHasApplied(applicationExists);
          }
        }
      } catch (error) {
        console.error('Failed to load job data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [jobId, jobs, user]);

  const handleApply = async () => {
    if (!user || user.role !== 'candidate') return;
    
    setApplying(true);
    try {
      // Create application record
      const applicationData = {
        jobId: parseInt(jobId),
        candidateId: user.id,
        candidateName: `${user.firstName} ${user.lastName}`,
        candidateEmail: user.email,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await dbHelpers.createApplication(applicationData);

      // Create candidate record for HR to see in kanban board
      const candidateData = {
        companyId: job.companyId,
        jobId: parseInt(jobId),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
        currentStageId: `job-${jobId}-stage-applied`, // Assuming this is the applied stage ID
        appliedDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await dbHelpers.createCandidate(candidateData, user.id);
      
      setHasApplied(true);
    } catch (error) {
      console.error('Failed to apply to job:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <>
        {user ? <AuthenticatedHeader /> : <Header />}
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader className="w-6 h-6 animate-spin text-primary-600" />
            <span className="text-lg text-gray-600">Loading job details...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        {user ? <AuthenticatedHeader /> : <Header />}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-500">Job Not Found</h1>
            <p className="mt-4 text-primary-500/70">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs" className="mt-6 inline-block bg-primary-400 text-white px-6 py-3 rounded-lg font-semibold">
              Back to Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getPostedTimeAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <>
      {user ? <AuthenticatedHeader /> : <Header />}
      <main className="pt-32 lg:pt-48 pb-24 bg-white">
        <div className="px-4 sm:px-8 lg:px-24">
          <div className="max-w-screen-lg mx-auto">
            <div className="mb-12">
              <p className="text-medium font-times italic text-primary-500/60 mb-4">({job.title})</p>
              <h1 className="text-heading font-impact font-black uppercase text-primary-500 leading-none tracking-tight">{job.companyName}</h1>
              <p className="text-subheading font-inter font-semibold text-primary-500/80 mt-2">{job.companyName}</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-primary-500/80 mb-12">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold">{job.type || 'Full-time'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">{job.location || 'Remote'}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">{job.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Posted {getPostedTimeAgo(job.postedDate)}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none font-inter text-primary-500/90 leading-relaxed">
              <h2 className="font-impact text-display-sm uppercase text-primary-500">Job Description</h2>
              <div className="whitespace-pre-line">{job.description}</div>

              {job.responsibilities && (
                <>
                  <h2 className="font-impact text-display-sm uppercase text-primary-500 mt-12">Responsibilities</h2>
                  <div className="whitespace-pre-line">{job.responsibilities}</div>
                </>
              )}

              {job.qualifications && (
                <>
                  <h2 className="font-impact text-display-sm uppercase text-primary-500 mt-12">Qualifications</h2>
                  <div className="whitespace-pre-line">{job.qualifications}</div>
                </>
              )}
            </div>

            <div className="mt-16 text-center">
              {user && user.role === 'candidate' ? (
                hasApplied ? (
                  <div className="inline-flex items-center gap-2 px-12 py-4 bg-green-100 text-green-700 rounded-lg text-lg font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Applied Successfully
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="inline-block bg-primary-400 text-white px-12 py-4 rounded-lg text-lg font-inter font-semibold hover:bg-primary-400/90 transition-colors disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                )
              ) : user && user.role === 'hr' ? (
                <p className="text-primary-500/70">HR users cannot apply to jobs</p>
              ) : (
                <Link
                  to="/signup"
                  className="inline-block bg-primary-400 text-white px-12 py-4 rounded-lg text-lg font-inter font-semibold hover:bg-primary-400/90 transition-colors"
                >
                  Sign Up to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JobDetailPage;
