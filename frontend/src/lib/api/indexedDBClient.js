// Hybrid API client that uses MSW in development and IndexedDB in production
// This preserves all MSW functionality while providing production fallback
//
// To re-enable MSW in production, set VITE_ENABLE_MSW=true in your environment
// To force IndexedDB in development, set VITE_ENABLE_MSW=false in your environment
//
import { dbHelpers } from '../database';

// Check if MSW is available (only in development)
const isMSWAvailable = () => {
  return import.meta.env.DEV && typeof window !== 'undefined' && window.__MSW_WORKER__;
};

// Check if we should use MSW or IndexedDB fallback
const shouldUseMSW = () => {
  // MSW disabled - always use IndexedDB directly
  return false;
  // return import.meta.env.DEV && typeof window !== 'undefined' && window.__MSW_WORKER__;
};

// Generic API call with MSW first, then IndexedDB fallback
export const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {} } = options;
  
  // Try MSW first if available (development)
  if (shouldUseMSW()) {
    try {
      console.log(`🔄 [API] Trying MSW for ${method} ${endpoint}`);
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ [API] MSW success for ${method} ${endpoint}`);
      return result;
    } catch (error) {
      console.warn(`⚠️ [API] MSW failed for ${method} ${endpoint}, falling back to IndexedDB:`, error.message);
      // Fall through to IndexedDB fallback
    }
  }
  
  // IndexedDB fallback for production or when MSW fails
  console.log(`🔄 [API] Using IndexedDB fallback for ${method} ${endpoint}`);
  return await handleIndexedDBFallback(endpoint, method, body);
};

// Handle IndexedDB fallback for different endpoints
const handleIndexedDBFallback = async (endpoint, method, body) => {
  console.log(`🔄 Using IndexedDB fallback for ${method} ${endpoint}`);
  
  // Parse endpoint to determine action
  const url = new URL(endpoint, window.location.origin);
  const path = url.pathname;
  const searchParams = url.searchParams;
  
  try {
    // Jobs endpoints
    if (path.startsWith('/api/jobs')) {
      return await handleJobsEndpoint(path, method, body, searchParams);
    }
    
    // Candidates endpoints
    if (path.startsWith('/api/candidates')) {
      return await handleCandidatesEndpoint(path, method, body, searchParams);
    }
    
    // Assessments endpoints
    if (path.startsWith('/api/assessments')) {
      return await handleAssessmentsEndpoint(path, method, body, searchParams);
    }
    
    throw new Error(`Unsupported endpoint: ${endpoint}`);
  } catch (error) {
    console.error('IndexedDB fallback failed:', error);
    throw error;
  }
};

// Handle jobs endpoints
const handleJobsEndpoint = async (path, method, body, searchParams) => {
  const jobId = path.match(/\/api\/jobs\/(\d+)/)?.[1];
  
  switch (method) {
    case 'GET':
      if (jobId) {
        // GET /api/jobs/:id
        const job = await dbHelpers.getJobById(parseInt(jobId));
        if (!job) {
          throw new Error('Job not found');
        }
        return { success: true, data: job };
      } else {
        // GET /api/jobs with query parameters
        const params = {
          page: parseInt(searchParams.get('page')) || 1,
          pageSize: parseInt(searchParams.get('pageSize')) || 10,
          search: searchParams.get('search') || '',
          status: searchParams.get('status') || '',
          sort: searchParams.get('sort') || 'order'
        };
        
        const jobs = await dbHelpers.getAllJobs();
        
        // Apply filtering and pagination
        let filteredJobs = jobs;
        
        if (params.search) {
          filteredJobs = jobs.filter(job => 
            job.details?.title?.toLowerCase().includes(params.search.toLowerCase()) ||
            job.details?.description?.toLowerCase().includes(params.search.toLowerCase())
          );
        }
        
        if (params.status) {
          filteredJobs = filteredJobs.filter(job => job.status === params.status);
        }
        
        // Apply sorting
        if (params.sort === 'order') {
          filteredJobs.sort((a, b) => (a.order || 0) - (b.order || 0));
        } else if (params.sort === 'title') {
          filteredJobs.sort((a, b) => (a.details?.title || '').localeCompare(b.details?.title || ''));
        }
        
        // Apply pagination
        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
        
        return {
          success: true,
          data: paginatedJobs,
          pagination: {
            page: params.page,
            pageSize: params.pageSize,
            total: filteredJobs.length,
            totalPages: Math.ceil(filteredJobs.length / params.pageSize)
          }
        };
      }
      
    case 'POST':
      // POST /api/jobs
      const newJob = await dbHelpers.createJob(body);
      return { success: true, data: newJob };
      
    case 'PUT':
      // PUT /api/jobs/:id
      if (jobId) {
        const updatedJob = await dbHelpers.updateJob(parseInt(jobId), body);
        return { success: true, data: updatedJob };
      }
      break;
      
    case 'PATCH':
      // PATCH /api/jobs/:id/reorder
      if (path.includes('/reorder')) {
        const { position } = body;
        await dbHelpers.updateJob(parseInt(jobId), { order: position });
        return { success: true };
      }
      break;
      
    case 'DELETE':
      // DELETE /api/jobs/:id
      if (jobId) {
        await dbHelpers.updateJob(parseInt(jobId), { status: 'archived' });
        return { success: true };
      }
      break;
  }
  
  throw new Error(`Unsupported method ${method} for jobs endpoint`);
};

// Handle candidates endpoints
const handleCandidatesEndpoint = async (path, method, body, searchParams) => {
  const candidateId = path.match(/\/api\/candidates\/(\d+)/)?.[1];
  
  switch (method) {
    case 'GET':
      if (candidateId) {
        // GET /api/candidates/:id
        const candidate = await dbHelpers.getCandidateById(parseInt(candidateId));
        if (!candidate) {
          throw new Error('Candidate not found');
        }
        return { success: true, data: candidate };
      } else if (path.includes('/timeline')) {
        // GET /api/candidates/:id/timeline
        const candidateId = path.match(/\/api\/candidates\/(\d+)\/timeline/)?.[1];
        const timeline = await dbHelpers.getCandidateHistory(parseInt(candidateId));
        return { success: true, data: timeline };
      } else {
        // GET /api/candidates
        const jobId = searchParams.get('jobId');
        if (jobId) {
          // GET /api/candidates?jobId=X - return candidates for specific job
          const candidates = await dbHelpers.getCandidatesByJob(parseInt(jobId));
          return { success: true, data: candidates };
        } else {
          // GET /api/candidates - return all candidates
          const candidates = await dbHelpers.getAllCandidates();
          return { success: true, data: candidates };
        }
      }
      
    case 'POST':
      // POST /api/candidates
      const newCandidate = await dbHelpers.createCandidate(body);
      return { success: true, data: newCandidate };
      
    case 'PUT':
    case 'PATCH':
      // PUT/PATCH /api/candidates/:id
      if (candidateId) {
        const updatedCandidate = await dbHelpers.updateCandidate(parseInt(candidateId), body);
        return { success: true, data: updatedCandidate };
      }
      break;
      
    case 'DELETE':
      // DELETE /api/candidates/:id
      if (candidateId) {
        await dbHelpers.updateCandidate(parseInt(candidateId), { status: 'archived' });
        return { success: true };
      }
      break;
  }
  
  throw new Error(`Unsupported method ${method} for candidates endpoint`);
};

// Handle assessments endpoints
const handleAssessmentsEndpoint = async (path, method, body, searchParams) => {
  const jobId = path.match(/\/api\/assessments\/(\d+)/)?.[1];
  
  switch (method) {
    case 'GET':
      if (jobId) {
        // GET /api/assessments/:jobId
        const assessments = await dbHelpers.getAssessmentsByJob(parseInt(jobId));
        const assessment = assessments.length > 0 ? assessments[0] : null;
        if (!assessment) {
          return { success: true, data: null };
        }
        return { success: true, data: assessment };
      }
      break;
      
    case 'PUT':
      // PUT /api/assessments/:jobId
      if (jobId) {
        const assessment = await dbHelpers.createAssessment(body);
        return { success: true, data: assessment };
      }
      break;
      
    case 'POST':
      if (path.includes('/submit')) {
        // POST /api/assessments/:jobId/submit
        const response = await dbHelpers.saveAssessmentResponse(body);
        return { success: true, data: response };
      }
      break;
  }
  
  throw new Error(`Unsupported method ${method} for assessments endpoint`);
};

// Convenience functions for common API calls
export const jobsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/api/jobs?${queryString}`);
  },
  getById: (id) => apiCall(`/api/jobs/${id}`),
  create: (data) => apiCall('/api/jobs', { method: 'POST', body: data }),
  update: (id, data) => apiCall(`/api/jobs/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiCall(`/api/jobs/${id}`, { method: 'DELETE' }),
  reorder: (id, position) => apiCall(`/api/jobs/${id}/reorder`, { method: 'PATCH', body: { position } })
};

export const candidatesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/api/candidates?${queryString}`);
  },
  getById: (id) => apiCall(`/api/candidates/${id}`),
  create: (data) => apiCall('/api/candidates', { method: 'POST', body: data }),
  update: (id, data) => apiCall(`/api/candidates/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiCall(`/api/candidates/${id}`, { method: 'DELETE' }),
  getTimeline: (id) => apiCall(`/api/candidates/${id}/timeline`)
};

export const assessmentsAPI = {
  getByJobId: (jobId) => apiCall(`/api/assessments/${jobId}`),
  createOrUpdate: (jobId, data) => apiCall(`/api/assessments/${jobId}`, { method: 'PUT', body: data }),
  submit: (jobId, data) => apiCall(`/api/assessments/${jobId}/submit`, { method: 'POST', body: data })
};
