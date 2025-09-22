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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-wide mb-2">Jobs</h1>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide">
                Manage job postings • Search, filter, and organize your open positions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-all duration-200 tracking-wide"
              >
                ← Dashboard
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200 tracking-wide"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mb-2">Search</label>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 tracking-wide"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 tracking-wide"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 tracking-wide"
              >
                <option value="title">Title</option>
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
                <option value="status">Status</option>
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
                className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-all duration-200 tracking-wide"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 transition-colors duration-200">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-small font-impact font-black uppercase text-red-800 dark:text-red-300 leading-none tracking-tight">ERROR LOADING JOBS</h3>
                <div className="mt-2 text-small font-impact font-black uppercase text-red-700 dark:text-red-400 leading-none tracking-tight">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">
              Jobs ({jobs.length} Results)
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {jobs.length > 0 ? jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors leading-relaxed tracking-wide"
                      >
                        {job.title}
                      </Link>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full leading-relaxed tracking-wide ${
                        job.status === 'active' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide">Order: {job.order}</span>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide">Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                      {job.tags && job.tags.length > 0 && (
                        <>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <div className="flex space-x-1">
                            {job.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded tracking-wide">
                                {tag}
                              </span>
                            ))}
                            {job.tags.length > 3 && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed tracking-wide">+{job.tags.length - 3} more</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/jobs/${job.id}/flow`}
                      className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border border-green-200 dark:border-green-800 rounded-lg tracking-wide"
                    >
                      Flow Editor
                    </Link>
                    <Link
                      to={`/candidates?jobId=${job.id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 tracking-wide"
                    >
                      View Candidates
                    </Link>
                    <button
                      onClick={() => setEditingJob(job)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 tracking-wide"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleReorderJob(job.id, job.order, job.order + 1)}
                      className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 tracking-wide"
                      title="Test Reorder (10% Error Rate)"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide mb-2">No Jobs Found</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide mb-4">Get started by creating your first job posting.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 tracking-wide"
                >
                  Create Job
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
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed tracking-wide transition-all duration-200"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed tracking-wide transition-all duration-200"
              >
                Next
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
      <div className="bg-white dark:bg-black rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {job ? 'Edit Job' : 'Create New Job'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              placeholder="e.g., Senior React Developer"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              placeholder="React, JavaScript, TypeScript"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              placeholder="Job description..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
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