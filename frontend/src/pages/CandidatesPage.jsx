import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import Footer from '../components/Footer';
import CandidatesBoard from '../components/CandidatesBoard';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]); // Add jobs state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  
  // View mode
  const [viewMode, setViewMode] = useState('kanban'); // 'list' or 'kanban'
  
  // Kanban stages
  const stages = [
    { id: 'applied', name: 'Applied', color: 'bg-blue-500' },
    { id: 'screen', name: 'Screening', color: 'bg-yellow-500' },
    { id: 'tech', name: 'Technical', color: 'bg-purple-500' },
    { id: 'offer', name: 'Offer', color: 'bg-orange-500' },
    { id: 'hired', name: 'Hired', color: 'bg-green-500' },
    { id: 'rejected', name: 'Rejected', color: 'bg-red-500' }
  ];

  // Fetch candidates using MSW API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(stageFilter && { stage: stageFilter })
      });

      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCandidates(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs for displaying job titles
  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?pageSize=100');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  useEffect(() => {
    fetchJobs(); // Fetch jobs on component mount
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, search, stageFilter]);

  // Move candidate to different stage
  const handleStageChange = async (candidateId, newStage) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });

      if (!response.ok) {
        throw new Error(`Failed to update candidate: ${response.statusText}`);
      }

      // Refresh candidates list
      await fetchCandidates();
    } catch (err) {
      console.error('Error updating candidate stage:', err);
      alert('Failed to update candidate stage: ' + err.message);
    }
  };

  // Create new candidate
  const handleCreateCandidate = async (candidateData) => {
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create candidate: ${response.statusText}`);
      }

      await fetchCandidates();
    } catch (err) {
      console.error('Error creating candidate:', err);
      alert('Failed to create candidate: ' + err.message);
    }
  };

  // Group candidates by stage for kanban view
  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = candidates.filter(candidate => candidate.stage === stage.id);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-impact font-black uppercase text-primary-500 leading-none tracking-tight">Candidates</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage candidate pipeline • GET /candidates?search=&stage=&page=
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Dashboard
              </Link>
              <div className="flex rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'kanban' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
              <CreateCandidateButton onCreate={handleCreateCandidate} jobs={jobs} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">Search</label>
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">Stage</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Stages</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setStageFilter('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-hero font-impact font-black uppercase text-primary-500 leading-none tracking-tight">Error loading candidates</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'kanban' ? (
          <KanbanView 
            stages={stages} 
            candidatesByStage={candidatesByStage} 
            jobs={jobs}
            onStageChange={handleStageChange}
          />
        ) : (
          <ListView 
            candidates={candidates} 
            stages={stages}
            jobs={jobs}
            onStageChange={handleStageChange}
          />
        )}
      </div>
    </div>
  );
};

// Kanban Board View Component
const KanbanView = ({ stages, candidatesByStage, jobs, onStageChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {stages.map(stage => (
        <div key={stage.id} className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
            <h3 className="text-lg font-impact font-bold uppercase text-primary-500 tracking-tight">{stage.name}</h3>
            <span className="ml-auto bg-white px-2 py-1 rounded text-sm text-gray-600">
              {candidatesByStage[stage.id]?.length || 0}
            </span>
          </div>
          
          <div className="space-y-3">
            {(candidatesByStage[stage.id] || []).map(candidate => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                stages={stages}
                jobs={jobs}
                onStageChange={onStageChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// List View Component
const ListView = ({ candidates, stages, jobs, onStageChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 tracking-tight">
          Candidates ({candidates.length} total)
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {candidates.length > 0 ? candidates.map(candidate => {
          const candidateJob = jobs.find(job => job.id === candidate.jobId);
          return (
            <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {candidate.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/candidates/${candidate.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {candidate.name}
                    </Link>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      Applied to: {candidateJob?.title || 'Unknown Job'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={candidate.stage}
                    onChange={(e) => onStageChange(candidate.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.name}</option>
                    ))}
                  </select>
                  
                  <Link
                    to={`/candidates/${candidate.id}/timeline`}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Timeline
                  </Link>
                  
                  {candidateJob && (
                    <Link
                      to={`/jobs/${candidateJob.id}/flow`}
                      className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Job Flow
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
                                <h3 className="text-xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">No candidates found</h3>
            <p className="text-gray-500">Candidates will appear here as they apply to jobs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Candidate Card Component
const CandidateCard = ({ candidate, stages, jobs, onStageChange }) => {
  const candidateJob = jobs.find(job => job.id === candidate.jobId);
  
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <Link
          to={`/candidates/${candidate.id}`}
          className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
        >
          {candidate.name}
        </Link>
      </div>
      
      <div className="text-xs text-gray-500 mb-2">{candidate.email}</div>
      
      {candidateJob && (
        <div className="text-xs text-blue-600 font-medium mb-3">
          {candidateJob.title}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <select
          value={candidate.stage}
          onChange={(e) => onStageChange(candidate.id, e.target.value)}
          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {stages.map(stage => (
            <option key={stage.id} value={stage.id}>{stage.name}</option>
          ))}
        </select>
        
        <div className="flex space-x-1">
          <Link
            to={`/candidates/${candidate.id}/timeline`}
            className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            Timeline
          </Link>
          {candidateJob && (
            <Link
              to={`/jobs/${candidateJob.id}/flow`}
              className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
            >
              Flow
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Candidate Button Component
const CreateCandidateButton = ({ onCreate, jobs }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    stage: 'applied',
    jobId: jobs.length > 0 ? jobs[0].id : 1 // Default to first job
  });

  // Update default jobId when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !formData.jobId) {
      setFormData(prev => ({ ...prev, jobId: jobs[0].id }));
    }
  }, [jobs, formData.jobId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required');
      return;
    }

    onCreate(formData);
    setFormData({ name: '', email: '', stage: 'applied', jobId: jobs.length > 0 ? jobs[0].id : 1 });
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Candidate
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 tracking-tight mb-4">Add New Candidate</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">
                  Apply to Job *
                </label>
                <select
                  value={formData.jobId}
                  onChange={(e) => setFormData({...formData, jobId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 tracking-tight mb-2">
                  Initial Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="applied">Applied</option>
                  <option value="screen">Screening</option>
                  <option value="tech">Technical</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidatesPage;
