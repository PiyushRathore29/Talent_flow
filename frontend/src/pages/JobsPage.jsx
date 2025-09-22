import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch jobs using MSW API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(sortBy && { sort: sortBy })
      });

      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setJobs(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [currentPage, search, statusFilter, sortBy]);

  // Create new job
  const handleCreateJob = async (jobData) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create job: ${response.statusText}`);
      }

      await fetchJobs(); // Refresh list
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating job:', err);
      alert('Failed to create job: ' + err.message);
    }
  };

  // Update job
  const handleUpdateJob = async (jobId, updates) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update job: ${response.statusText}`);
      }

      await fetchJobs(); // Refresh list
      setEditingJob(null);
    } catch (err) {
      console.error('Error updating job:', err);
      alert('Failed to update job: ' + err.message);
    }
  };

  // Handle job reordering (drag & drop)
  const handleReorderJob = async (jobId, fromOrder, toOrder) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromOrder, toOrder })
      });

      if (!response.ok) {
        throw new Error(`Reorder failed: ${response.statusText}`);
      }

      await fetchJobs(); // Refresh list
    } catch (err) {
      console.error('Error reordering job:', err);
      alert('Failed to reorder job: ' + err.message + ' (This is the 10% error simulation)');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-hero font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 tracking-tight">JOBS</h1>
              <p className="text-medium font-impact font-black uppercase text-primary-700 dark:text-gray-300 leading-none tracking-tight">
                MANAGE JOB POSTINGS • GET /JOBS?SEARCH=&STATUS=&PAGE=&PAGESIZE=&SORT=
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-small font-impact font-black uppercase text-primary-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors leading-none tracking-tight"
              >
                ← DASHBOARD
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-small font-impact font-black uppercase rounded-md hover:bg-blue-700 transition-colors leading-none tracking-tight"
              >
                CREATE JOB
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-small font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-2">SEARCH</label>
              <input
                type="text"
                placeholder="SEARCH JOBS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-small font-impact font-black uppercase leading-none tracking-tight"
              />
            </div>
            <div>
              <label className="block text-small font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-2">STATUS</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-small font-impact font-black uppercase leading-none tracking-tight"
              >
                <option value="">ALL STATUSES</option>
                <option value="active">ACTIVE</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>
            <div>
              <label className="block text-small font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-2">SORT BY</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-small font-impact font-black uppercase leading-none tracking-tight"
              >
                <option value="title">TITLE</option>
                <option value="createdAt">CREATED DATE</option>
                <option value="updatedAt">UPDATED DATE</option>
                <option value="status">STATUS</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setSortBy('title');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-small font-impact font-black uppercase text-primary-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors leading-none tracking-tight"
              >
                CLEAR FILTERS
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
                <h3 className="text-small font-impact font-black uppercase text-red-800 leading-none tracking-tight">ERROR LOADING JOBS</h3>
                <div className="mt-2 text-small font-impact font-black uppercase text-red-700 leading-none tracking-tight">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-heading font-impact font-black uppercase text-primary-500 leading-none tracking-tight">
              JOBS ({jobs.length} RESULTS)
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {jobs.length > 0 ? jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-heading-sm font-impact font-black uppercase text-primary-500 hover:text-blue-600 transition-colors leading-none tracking-tight"
                      >
                        {job.title}
                      </Link>
                      <span className={`px-2 py-1 text-tiny font-impact font-black uppercase rounded-full leading-none tracking-tight ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">ORDER: {job.order}</span>
                      <span className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">•</span>
                      <span className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">CREATED: {new Date(job.createdAt).toLocaleDateString()}</span>
                      {job.tags && job.tags.length > 0 && (
                        <>
                          <span className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">•</span>
                          <div className="flex space-x-1">
                            {job.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-tiny font-impact font-black uppercase rounded leading-none tracking-tight">
                                {tag}
                              </span>
                            ))}
                            {job.tags.length > 3 && (
                              <span className="text-tiny font-impact font-black uppercase text-gray-400 leading-none tracking-tight">+{job.tags.length - 3} MORE</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/jobs/${job.id}/flow`}
                      className="px-3 py-1 text-small font-impact font-black uppercase text-green-600 hover:text-green-700 transition-colors border border-green-200 rounded hover:bg-green-50 leading-none tracking-tight"
                    >
                      FLOW EDITOR
                    </Link>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-3 py-1 text-small font-impact font-black uppercase text-blue-600 hover:text-blue-700 transition-colors leading-none tracking-tight"
                    >
                      VIEW DETAILS
                    </Link>
                    <button
                      onClick={() => setEditingJob(job)}
                      className="px-3 py-1 text-small font-impact font-black uppercase text-blue-600 hover:text-blue-700 transition-colors leading-none tracking-tight"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleUpdateJob(job.id, { 
                        status: job.status === 'active' ? 'archived' : 'active' 
                      })}
                      className="px-3 py-1 text-small font-impact font-black uppercase text-gray-600 hover:text-gray-700 transition-colors leading-none tracking-tight"
                    >
                      {job.status === 'active' ? 'ARCHIVE' : 'ACTIVATE'}
                    </button>
                    <button
                      onClick={() => handleReorderJob(job.id, job.order, job.order + 1)}
                      className="px-3 py-1 text-small font-impact font-black uppercase text-purple-600 hover:text-purple-700 transition-colors leading-none tracking-tight"
                      title="TEST REORDER (10% ERROR RATE)"
                    >
                      REORDER
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <div className="text-display mb-4">💼</div>
                <h3 className="text-heading font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-2">NO JOBS FOUND</h3>
                <p className="text-medium font-impact font-black uppercase text-primary-700 leading-none tracking-tight mb-4">GET STARTED BY CREATING YOUR FIRST JOB POSTING.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-small font-impact font-black uppercase rounded-md hover:bg-blue-700 transition-colors leading-none tracking-tight"
                >
                  CREATE JOB
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-small font-impact font-black uppercase text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed leading-none tracking-tight"
              >
                PREVIOUS
              </button>
              
              <span className="px-3 py-2 text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">
                PAGE {currentPage} OF {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-small font-impact font-black uppercase text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed leading-none tracking-tight"
              >
                NEXT
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Create/Edit Job Modal */}
      {(showCreateModal || editingJob) && (
        <JobModal
          job={editingJob}
          onSave={editingJob ? 
            (updates) => handleUpdateJob(editingJob.id, updates) : 
            handleCreateJob
          }
          onClose={() => {
            setShowCreateModal(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
};

// Job Modal Component
const JobModal = ({ job, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    status: job?.status || 'active',
    tags: job?.tags?.join(', ') || '',
    description: job?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Job title is required');
      return;
    }

    const jobData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    onSave(jobData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {job ? 'Edit Job' : 'Create New Job'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior React Developer"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, JavaScript, TypeScript"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Job description..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobsPage;