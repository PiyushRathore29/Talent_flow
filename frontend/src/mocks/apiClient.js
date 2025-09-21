// API client for testing MSW endpoints
export class APIClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API Request failed: ${config.method || 'GET'} ${url}`, error);
      throw error;
    }
  }

  // Job endpoints
  async getJobs(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/jobs?${searchParams}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: jobData,
    });
  }

  async updateJob(id, updates) {
    return this.request(`/jobs/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  }

  async reorderJob(id, fromOrder, toOrder) {
    return this.request(`/jobs/${id}/reorder`, {
      method: 'PATCH',
      body: { fromOrder, toOrder },
    });
  }

  async getJob(id) {
    return this.request(`/jobs/${id}`);
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Candidate endpoints
  async getCandidates(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/candidates?${searchParams}`);
  }

  async createCandidate(candidateData) {
    return this.request('/candidates', {
      method: 'POST',
      body: candidateData,
    });
  }

  async updateCandidate(id, updates) {
    return this.request(`/candidates/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  }

  async getCandidateTimeline(id) {
    return this.request(`/candidates/${id}/timeline`);
  }

  async getCandidate(id) {
    return this.request(`/candidates/${id}`);
  }

  async deleteCandidate(id) {
    return this.request(`/candidates/${id}`, {
      method: 'DELETE',
    });
  }

  // Assessment endpoints
  async getAssessment(jobId) {
    return this.request(`/assessments/${jobId}`);
  }

  async saveAssessment(jobId, assessmentData) {
    return this.request(`/assessments/${jobId}`, {
      method: 'PUT',
      body: assessmentData,
    });
  }

  async submitAssessment(jobId, submissionData) {
    return this.request(`/assessments/${jobId}/submit`, {
      method: 'POST',
      body: submissionData,
    });
  }

  async getAssessmentResponses(jobId, candidateId = null) {
    const params = candidateId ? `?candidateId=${candidateId}` : '';
    return this.request(`/assessments/${jobId}/responses${params}`);
  }

  async deleteAssessment(jobId) {
    return this.request(`/assessments/${jobId}`, {
      method: 'DELETE',
    });
  }
}

// Create a default instance
export const apiClient = new APIClient();

// Export individual endpoint functions for convenience
export const jobsAPI = {
  getAll: (params) => apiClient.getJobs(params),
  create: (data) => apiClient.createJob(data),
  update: (id, data) => apiClient.updateJob(id, data),
  reorder: (id, fromOrder, toOrder) => apiClient.reorderJob(id, fromOrder, toOrder),
  getById: (id) => apiClient.getJob(id),
  delete: (id) => apiClient.deleteJob(id),
};

export const candidatesAPI = {
  getAll: (params) => apiClient.getCandidates(params),
  create: (data) => apiClient.createCandidate(data),
  update: (id, data) => apiClient.updateCandidate(id, data),
  getTimeline: (id) => apiClient.getCandidateTimeline(id),
  getById: (id) => apiClient.getCandidate(id),
  delete: (id) => apiClient.deleteCandidate(id),
};

export const assessmentsAPI = {
  get: (jobId) => apiClient.getAssessment(jobId),
  save: (jobId, data) => apiClient.saveAssessment(jobId, data),
  submit: (jobId, data) => apiClient.submitAssessment(jobId, data),
  getResponses: (jobId, candidateId) => apiClient.getAssessmentResponses(jobId, candidateId),
  delete: (jobId) => apiClient.deleteAssessment(jobId),
};