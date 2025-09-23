import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { dbHelpers } from '../lib/database';
import { Search, Filter, MapPin, DollarSign, Calendar, Briefcase, Loader, ExternalLink, Users } from 'lucide-react';

const CandidateJobsBoard = () => {
  const { user } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Helper function to format salary
  const formatSalary = (salary) => {
    if (!salary) return '';
    
    // If it's already a string, return it
    if (typeof salary === 'string') return salary;
    
    // If it's an object with min, max, currency
    if (typeof salary === 'object' && salary.min && salary.max) {
      const currency = salary.currency || '$';
      return `${currency}${salary.min.toLocaleString()} - ${currency}${salary.max.toLocaleString()}`;
    }
    
    // If it's just a number
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}`;
    }
    
    return String(salary);
  };

  useEffect(() => {
    const loadJobs = async () => {
      if (!user || user.role !== 'candidate') {
        setLoading(false);
        return;
      }

      try {
        // Load user's applications to know which jobs they've applied to
        const userApplications = await dbHelpers.getApplicationsByCandidate(user.id);
        const appliedIds = new Set(userApplications.map(app => app.jobId));
        setAppliedJobIds(appliedIds);

        // Get all active jobs from all companies
        const allJobs = Object.values(jobs).filter(job => {
          // Filter out any jobs that don't have proper details
          return job.details && job.details.title;
        });
        
        setAvailableJobs(allJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!jobsLoading) {
      loadJobs();
    }
  }, [user, jobs, jobsLoading]);

  const handleApplyToJob = async (jobId) => {
    try {
      const job = availableJobs.find(j => j.id === jobId);
      if (!job) {
        console.error('❌ Job not found:', jobId);
        return;
      }
      
      console.log('🎯 Applying to job:', {
        jobId,
        jobTitle: job.details.title,
        companyId: job.details.companyId
      });

      // Check if user already applied to this job
      const existingApplications = await dbHelpers.getApplicationsByCandidate(user.id);
      const alreadyApplied = existingApplications.some(app => app.jobId === parseInt(jobId));
      
      if (alreadyApplied) {
        alert('You have already applied to this job!');
        return;
      }

      // Find the "Applied" stage for this job
      const jobStages = await dbHelpers.getJobStages(parseInt(jobId));
      console.log('📋 Job stages found:', jobStages);
      
      const appliedStage = jobStages.find(stage => 
        stage.name.toLowerCase().includes('applied') || 
        stage.order === 1 // If no "applied" stage, use the first stage
      );
      
      if (!appliedStage) {
        console.error('❌ No applied stage found for job:', jobId, 'Available stages:', jobStages);
        alert('Error: No application stage found for this job. Please contact HR.');
        return;
      }
      
      console.log('🎪 Using applied stage:', appliedStage);

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

      console.log('📝 Creating application:', applicationData);
      await dbHelpers.createApplication(applicationData);

      // Create candidate record for HR to see in kanban board
      // Match the data structure that CandidatesPage expects
      const candidateData = {
        companyId: job.details.companyId,
        jobId: parseInt(jobId),
        userId: user.id, // Make sure userId is set
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
        // Use both formats for compatibility
        currentStageId: appliedStage.nodeId, // For flow diagram
        stage: 'applied', // For Kanban board (matches CandidatesPage expected format - this is the key field!)
        jobTitle: job.details.title, // Add job title for display
        appliedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        // Add additional fields that match seeded data structure
        position: job.details.title,
        experience: user.experience || 'Not specified',
        skills: user.skills || [],
        status: 'Active',
        notes: `Applied via candidate portal on ${new Date().toLocaleDateString()}`,
        resumeUrl: null
      };

      console.log('👤 Creating candidate record:', candidateData);
      const candidateId = await dbHelpers.createCandidate(candidateData, user.id);
      console.log('✅ Candidate created with ID:', candidateId);
      
      // Verify the candidate was created properly
      const createdCandidate = await dbHelpers.getCandidateById(candidateId);
      console.log('🔍 Verification - candidate in DB:', createdCandidate);
      
      // Check if candidate appears in job candidates
      const jobCandidates = await dbHelpers.getCandidatesByJob(parseInt(jobId));
      console.log('👥 All candidates for this job:', jobCandidates);
      
      // Update applied jobs set
      setAppliedJobIds(prev => new Set([...prev, parseInt(jobId)]));
      
      console.log('🎉 Successfully applied to job:', jobId);
      alert(`Successfully applied to ${job.details.title}! You can view your application status in your dashboard.`);
      
    } catch (error) {
      console.error('💥 Failed to apply to job:', error);
      alert('Failed to apply to job. Please try again.');
    }
  };

  // Get unique locations and types for filters
  const locations = [...new Set(availableJobs.map(job => job.details.location).filter(Boolean))];
  const jobTypes = [...new Set(availableJobs.map(job => job.details.type).filter(Boolean))];

  // Filter jobs based on search and filters
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.details.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.details.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.details.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'All' || job.details.location === locationFilter;
    const matchesType = typeFilter === 'All' || job.details.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  if (loading || jobsLoading) {
    return (
      <section className="min-h-screen bg-primary-50 py-24">
        <div className="pt-16 pb-12 px-4 sm:px-8 lg:px-24">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-6 h-6 animate-spin text-primary-600" />
                <span className="text-lg text-gray-600">Loading jobs...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-primary-50 py-24">
      <div className="pt-16 pb-12 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-heading font-impact font-black uppercase text-primary-500">
              Available Opportunities
            </h1>
            <p className="mt-2 text-body text-primary-500/70">
              Discover and apply to jobs from companies across the platform.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50 appearance-none"
                >
                  <option value="All">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50 appearance-none"
                >
                  <option value="All">All Job Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredJobs.length} of {availableJobs.length} jobs
              </span>
              <span>
                {appliedJobIds.size} applications submitted
              </span>
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => {
                const hasApplied = appliedJobIds.has(job.id);
                
                return (
                  <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-primary-700 line-clamp-2">
                          {job.details.title}
                        </h3>
                        {hasApplied && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-primary-500 font-semibold mb-2">
                        {job.details.companyName}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {job.details.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {job.details.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{job.details.location}</span>
                        </div>
                      )}
                      {job.details.salary && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{formatSalary(job.details.salary)}</span>
                        </div>
                      )}
                      {job.details.type && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{job.details.type}</span>
                        </div>
                      )}
                      {job.details.postedDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Posted {new Date(job.details.postedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {job.details.applicants !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{job.details.applicants} applicants</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="flex-1 px-4 py-2 text-center border border-primary-400 text-primary-400 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        View Details
                      </Link>
                      {!hasApplied ? (
                        <button
                          onClick={() => handleApplyToJob(job.id)}
                          className="flex-1 px-4 py-2 bg-primary-400 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                        >
                          Applied
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm || locationFilter !== 'All' || typeFilter !== 'All' 
                  ? 'No jobs match your filters' 
                  : 'No jobs available'
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm || locationFilter !== 'All' || typeFilter !== 'All' 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Check back later for new opportunities!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CandidateJobsBoard;