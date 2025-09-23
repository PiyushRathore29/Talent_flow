import Dexie from 'dexie';

// Database schema
export class TalentFlowDB extends Dexie {
  constructor() {
    super('TalentFlowDB');
    
    this.version(6).stores({
      // Authentication & Users
      users: '++id, email, &username, companyId, role, createdAt, lastLogin',
      companies: '++id, &name, domain, createdAt',
      sessions: '++id, userId, token, expiresAt, createdAt',
      
      // Job Management
      jobs: '++id, companyId, title, status, createdById, createdAt, updatedAt',
      jobStages: '++id, jobId, name, order, type, position, nodeId, createdAt',
      
      // Candidate Management
      candidates: '++id, companyId, jobId, userId, name, email, phone, currentStageId, appliedDate, createdAt',
      candidateHistory: '++id, candidateId, fromStageId, toStageId, changedBy, changedAt, note',
      candidateNotes: '++id, candidateId, authorId, text, mentions, createdAt',
      
      // Timeline System - Comprehensive activity tracking
      timeline: '++id, candidateId, candidateName, action, actionType, description, fromStage, toStage, timestamp, hrUserId, hrUserName, jobId, jobTitle, metadata',
      
      // Application System
      applications: '++id, jobId, candidateId, candidateName, candidateEmail, status, appliedAt, createdAt, updatedAt',
      
      // Enhanced Assessment System
      assessments: '++id, jobId, stageId, companyId, title, description, instructions, timeLimit, passingScore, isRequired, settings, createdById, createdAt, updatedAt',
      assessmentQuestions: '++id, assessmentId, questionType, title, description, options, validation, conditionalLogic, order, isRequired, createdAt',
      assessmentResponses: '++id, assessmentId, candidateId, questionResponses, submittedAt, timeTaken, score, isCompleted, startedAt',
      assessmentAttempts: '++id, assessmentId, candidateId, attemptNumber, responses, submittedAt, score, timeSpent, isCompleted',
      
      // Application Settings
      appSettings: '++id, userId, companyId, settings, updatedAt'
    }).upgrade(trans => {
      // Migration from version 5 to 6: Add comprehensive timeline system
      console.log('Upgraded database to version 6: Added comprehensive timeline system for tracking all candidate activities');
    });
  }
}

// Initialize database
export const db = new TalentFlowDB();

// Helper functions for common operations
export const dbHelpers = {
  // User & Authentication
  async createUser(userData) {
    // Check if user with this username or email already exists
    const [existingUsername, existingEmail] = await Promise.all([
      db.users.where('username').equals(userData.username).first(),
      db.users.where('email').equals(userData.email).first()
    ]);
    
    if (existingUsername) {
      return existingUsername.id;
    }
    
    if (existingEmail) {
      return existingEmail.id;
    }
    
    const user = {
      ...userData,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    return await db.users.add(user);
  },

  async getUserByEmail(email) {
    return await db.users.where('email').equals(email).first();
  },

  async getUserById(id) {
    return await db.users.get(id);
  },

  async getUserByUsername(username) {
    return await db.users.where('username').equals(username).first();
  },

  async updateUserLastLogin(userId) {
    return await db.users.update(userId, { lastLogin: new Date() });
  },

  // Company Management
  async createCompany(companyData) {
    // Check if company with this name already exists
    const existingCompany = await db.companies.where('name').equals(companyData.name).first();
    if (existingCompany) {
      return existingCompany.id;
    }
    
    const company = {
      ...companyData,
      createdAt: new Date()
    };
    return await db.companies.add(company);
  },

  async getCompanyById(id) {
    return await db.companies.get(id);
  },

  async getCompanyByName(name) {
    return await db.companies.where('name').equals(name).first();
  },

  // Session Management
  async createSession(userId, token) {
    const session = {
      userId,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date()
    };
    return await db.sessions.add(session);
  },

  async getValidSession(token) {
    const session = await db.sessions.where('token').equals(token).first();
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    return null;
  },

  async deleteSession(token) {
    return await db.sessions.where('token').equals(token).delete();
  },

  // Job Management
  async createJob(jobData) {
    const job = {
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await db.jobs.add(job);
  },

  async getJobsByCompany(companyId) {
    return await db.jobs.where('companyId').equals(companyId).toArray();
  },

  async getAllJobs() {
    return await db.jobs.toArray();
  },

  async getJobById(id) {
    return await db.jobs.get(id);
  },

  async updateJob(id, updates) {
    // Ensure ID is always a number
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    console.log('🗄️ Database: updateJob called with ID:', numericId, 'type:', typeof numericId);
    
    try {
      // First, check if the job exists
      const existingJob = await db.jobs.get(numericId);
      console.log('🗄️ Database: Existing job before update:', existingJob);
      
      if (!existingJob) {
        console.error('🗄️ Database: Job not found with ID:', numericId);
        return 0;
      }
      
      const result = await db.jobs.update(numericId, { ...updates, updatedAt: new Date() });
      console.log('🗄️ Database: updateJob result:', result);
      
      // Verify the update worked
      const updatedJob = await db.jobs.get(numericId);
      console.log('🗄️ Database: Job after update:', updatedJob);
      console.log('🗄️ Database: Job flowData after update:', updatedJob?.flowData);
      
      return result;
    } catch (error) {
      console.error('🗄️ Database: updateJob failed:', error);
      throw error;
    }
  },

  async updateJobOrder(jobId, newOrder) {
    console.log('🗄️ Database: Updating job order - ID:', jobId, 'New Order:', newOrder);
    return await this.updateJob(jobId, { order: newOrder });
  },

  async reorderJobs(jobsWithNewOrders) {
    console.log('🗄️ Database: Reordering jobs:', jobsWithNewOrders);
    
    try {
      await db.transaction('rw', db.jobs, async () => {
        for (const { id, order } of jobsWithNewOrders) {
          await db.jobs.update(id, { order: order, updatedAt: new Date() });
        }
      });
      
      console.log('🗄️ Database: Jobs reordered successfully');
      return true;
    } catch (error) {
      console.error('🗄️ Database: Failed to reorder jobs:', error);
      throw error;
    }
  },

  async getJobsOrderedByOrder() {
    const jobs = await db.jobs.orderBy('order').toArray();
    // Fill in missing order values if needed
    const jobsWithOrder = jobs.map((job, index) => ({
      ...job,
      order: job.order || (index + 1)
    }));
    return jobsWithOrder;
  },

  // Job Stages
  async createJobStage(stageData) {
    console.log('🗄️ Database: Attempting to create job stage:', stageData);
    try {
      const stage = {
        ...stageData,
        createdAt: new Date()
      };
      console.log('🗄️ Database: Final stage object before save:', stage);
      const result = await db.jobStages.add(stage);
      console.log('🗄️ Database: Stage successfully saved, returned ID:', result);
      return result;
    } catch (error) {
      console.error('🗄️ Database ERROR: Failed to create job stage:', error);
      throw error;
    }
  },

  async getJobStages(jobId) {
    console.log('🗄️ Database: Fetching stages for job ID:', jobId);
    try {
      const stages = await db.jobStages.where('jobId').equals(jobId).toArray();
      const sortedStages = stages.sort((a, b) => a.order - b.order);
      console.log('🗄️ Database: Found stages:', sortedStages);
      return sortedStages;
    } catch (error) {
      console.error('🗄️ Database ERROR: Failed to get job stages:', error);
      throw error;
    }
  },

  async updateJobStage(id, updates) {
    return await db.jobStages.update(id, updates);
  },

  async deleteJobStage(id) {
    return await db.jobStages.delete(id);
  },

  async deleteJobStageByNodeId(nodeId) {
    return await db.jobStages.where('nodeId').equals(nodeId).delete();
  },

  // Candidate Management
  async createCandidate(candidateData, userId) {
    const user = await this.getUserById(userId);
    const candidate = {
      ...candidateData,
      userId: userId, // Ensure userId is stored
      companyId: candidateData.companyId || user?.companyId, // Use provided companyId or user's companyId
      appliedDate: new Date(),
      createdAt: new Date()
    };
    const candidateId = await db.candidates.add(candidate);
    
    // Create initial history entry
    await this.addCandidateHistory({
      candidateId,
      toStageId: candidateData.currentStageId,
      changedBy: userId,
      note: 'Application submitted'
    });
    
    return candidateId;
  },

  async getCandidatesByCompany(companyId) {
    return await db.candidates.where('companyId').equals(companyId).toArray();
  },

  async getCandidatesByUserId(userId) {
    // Get candidate records that have the userId field set
    let candidateRecords = await db.candidates.where('userId').equals(userId).toArray();
    
    // If no direct candidate records found, fall back to matching by email through applications
    if (candidateRecords.length === 0) {
      const user = await this.getUserById(userId);
      if (user) {
        const userApplications = await db.applications.where('candidateId').equals(userId).toArray();
        
        for (const application of userApplications) {
          // Find candidate record for this application by job and email
          let candidate = await db.candidates.where('jobId').equals(application.jobId)
            .and(candidate => candidate.email === user.email).first();
          
          if (candidate) {
            candidateRecords.push(candidate);
          }
        }
      }
    }
    
    return candidateRecords;
  },

  async getAllCandidates() {
    return await db.candidates.toArray();
  },

  async getCandidatesByJob(jobId) {
    console.log('🔍 [DB] Getting candidates for job:', jobId);
    const candidates = await db.candidates.where('jobId').equals(jobId).toArray();
    console.log('🔍 [DB] Found candidates:', candidates.length, candidates);
    
    // Fetch user data for each candidate
    const candidatesWithUserData = await Promise.all(
      candidates.map(async (candidate) => {
        let user = null;
        
        // Only try to get user data if userId exists and is valid
        if (candidate.userId && typeof candidate.userId === 'number') {
          try {
            user = await db.users.get(candidate.userId);
          } catch (error) {
            console.warn(`Failed to fetch user data for candidate ${candidate.id}:`, error);
          }
        }
        
        return {
          ...candidate,
          userName: user?.username || candidate.name || 'Unknown User',
          userEmail: user?.email || candidate.email || ''
        };
      })
    );
    
    console.log('🔍 [DB] Candidates with user data:', candidatesWithUserData);
    return candidatesWithUserData;
  },

  async getCandidateById(id) {
    return await db.candidates.get(id);
  },

  async updateCandidate(id, updates) {
    return await db.candidates.update(id, updates);
  },

  async moveCandidateToStage(candidateId, newStageId, userId, note = '') {
    const candidate = await this.getCandidateById(candidateId);
    const oldStageId = candidate.currentStageId;
    
    await db.candidates.update(candidateId, { currentStageId: newStageId });
    
    return await this.addCandidateHistory({
      candidateId,
      fromStageId: oldStageId,
      toStageId: newStageId,
      changedBy: userId,
      note
    });
  },

  // Candidate History
  async addCandidateHistory(historyData) {
    const history = {
      ...historyData,
      changedAt: new Date()
    };
    return await db.candidateHistory.add(history);
  },

  async getCandidateHistory(candidateId) {
    return await db.candidateHistory.where('candidateId').equals(candidateId).orderBy('changedAt').toArray();
  },

  // Timeline Management - Comprehensive activity tracking
  async addTimelineEntry(timelineData) {
    const entry = {
      timestamp: new Date().toISOString(),
      hrUserId: 1, // Default to admin user for now
      hrUserName: "Admin User",
      metadata: {},
      ...timelineData
    };
    return await db.timeline.add(entry);
  },

  async getTimelineEntries(candidateId = null, limit = null) {
    let query = candidateId 
      ? db.timeline.where('candidateId').equals(candidateId)
      : db.timeline.orderBy('timestamp').reverse();
    
    const entries = await query.toArray();
    
    // Sort by timestamp descending (newest first)
    entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return limit ? entries.slice(0, limit) : entries;
  },

  async getTimelineStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const allEntries = await db.timeline.toArray();
    
    const todayEntries = allEntries.filter(entry => 
      new Date(entry.timestamp) >= today
    );
    
    const weekEntries = allEntries.filter(entry => 
      new Date(entry.timestamp) >= thisWeek
    );
    
    const monthEntries = allEntries.filter(entry => 
      new Date(entry.timestamp) >= thisMonth
    );

    return {
      today: todayEntries.length,
      thisWeek: weekEntries.length,
      thisMonth: monthEntries.length,
      total: allEntries.length
    };
  },

  // Log candidate creation
  async logCandidateCreated(candidate, job) {
    return await this.addTimelineEntry({
      candidateId: candidate.id,
      candidateName: candidate.name,
      action: "created",
      actionType: "candidate_created",
      description: `New candidate ${candidate.name} created`,
      fromStage: null,
      toStage: "applied",
      jobId: job.id,
      jobTitle: job.title,
      metadata: {
        candidateEmail: candidate.email,
        jobLocation: job.location
      }
    });
  },

  // Log stage progression
  async logStageChange(candidate, fromStage, toStage, job) {
    return await this.addTimelineEntry({
      candidateId: candidate.id,
      candidateName: candidate.name,
      action: "stage_changed",
      actionType: "stage_progression",
      description: `Moved from ${fromStage} to ${toStage}`,
      fromStage: fromStage,
      toStage: toStage,
      jobId: job?.id,
      jobTitle: job?.title,
      metadata: {}
    });
  },

  // Candidate Notes
  async addCandidateNote(noteData) {
    const note = {
      ...noteData,
      createdAt: new Date()
    };
    return await db.candidateNotes.add(note);
  },

  async getCandidateNotes(candidateId) {
    return await db.candidateNotes.where('candidateId').equals(candidateId).orderBy('createdAt').toArray();
  },

  // Assessment Management
  async createAssessment(assessmentData, userId) {
    const user = await this.getUserById(userId);
    const assessment = {
      ...assessmentData,
      companyId: user.companyId,
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await db.assessments.add(assessment);
  },

  async getAssessmentsByJob(jobId) {
    return await db.assessments.where('jobId').equals(jobId).toArray();
  },

  async getAssessmentById(id) {
    return await db.assessments.get(id);
  },

  async updateAssessment(id, updates) {
    return await db.assessments.update(id, { ...updates, updatedAt: new Date() });
  },

  // Assessment Responses
  async saveAssessmentResponse(responseData) {
    const response = {
      ...responseData,
      submittedAt: new Date()
    };
    return await db.assessmentResponses.add(response);
  },

  async getAssessmentResponse(assessmentId, candidateId) {
    return await db.assessmentResponses
      .where('[assessmentId+candidateId]')
      .equals([assessmentId, candidateId])
      .first();
  },

  // Utility functions
  async clearAllData() {
    await db.delete();
    await db.open();
  },

  async exportData() {
    const data = {};
    const tables = ['users', 'companies', 'jobs', 'jobStages', 'candidates', 'candidateHistory', 'candidateNotes', 'timeline', 'assessments', 'assessmentResponses'];
    
    for (const table of tables) {
      data[table] = await db[table].toArray();
    }
    
    return data;
  },

  async importData(data) {
    for (const [tableName, records] of Object.entries(data)) {
      if (db[tableName]) {
        await db[tableName].clear();
        await db[tableName].bulkAdd(records);
      }
    }
  },

  // Application Management
  async createApplication(applicationData) {
    const application = {
      ...applicationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await db.applications.add(application);
  },

  async getApplicationsByCandidate(candidateId) {
    const applications = await db.applications.where('candidateId').equals(candidateId).toArray();
    return applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  },

  async getApplicationsByJob(jobId) {
    const applications = await db.applications.where('jobId').equals(jobId).toArray();
    return applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  },

  async getApplicationById(id) {
    return await db.applications.get(id);
  },

  async updateApplication(id, updates) {
    return await db.applications.update(id, { ...updates, updatedAt: new Date() });
  },

  async deleteApplication(id) {
    return await db.applications.delete(id);
  },

  // Assessment Management
  async createAssessment(assessmentData) {
    const assessment = {
      ...assessmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await db.assessments.add(assessment);
  },

  async getAssessmentById(id) {
    return await db.assessments.get(id);
  },

  async getAssessmentsByJob(jobId) {
    return await db.assessments.where('jobId').equals(jobId).toArray();
  },

  async getAssessmentsByStage(stageId) {
    return await db.assessments.where('stageId').equals(stageId).toArray();
  },

  async updateAssessment(id, updates) {
    return await db.assessments.update(id, { ...updates, updatedAt: new Date() });
  },

  async deleteAssessment(id) {
    // Also delete related questions and responses
    await db.assessmentQuestions.where('assessmentId').equals(id).delete();
    await db.assessmentResponses.where('assessmentId').equals(id).delete();
    await db.assessmentAttempts.where('assessmentId').equals(id).delete();
    return await db.assessments.delete(id);
  },

  // Assessment Questions
  async createAssessmentQuestion(questionData) {
    const question = {
      ...questionData,
      createdAt: new Date()
    };
    return await db.assessmentQuestions.add(question);
  },

  async getQuestionsByAssessment(assessmentId) {
    const questions = await db.assessmentQuestions.where('assessmentId').equals(assessmentId).toArray();
    return questions.sort((a, b) => a.order - b.order);
  },

  async updateAssessmentQuestion(id, updates) {
    return await db.assessmentQuestions.update(id, updates);
  },

  async deleteAssessmentQuestion(id) {
    return await db.assessmentQuestions.delete(id);
  },

  // Assessment Responses
  async createAssessmentResponse(responseData) {
    const response = {
      ...responseData,
      submittedAt: new Date()
    };
    return await db.assessmentResponses.add(response);
  },

  async getResponsesByAssessment(assessmentId) {
    return await db.assessmentResponses.where('assessmentId').equals(assessmentId).toArray();
  },

  async getResponsesByCandidate(candidateId) {
    return await db.assessmentResponses.where('candidateId').equals(candidateId).toArray();
  },

  async getCandidateAssessmentResponse(assessmentId, candidateId) {
    return await db.assessmentResponses.where('assessmentId').equals(assessmentId)
      .and(response => response.candidateId === candidateId).first();
  },

  async updateAssessmentResponse(id, updates) {
    return await db.assessmentResponses.update(id, updates);
  },

  // Assessment Attempts
  async createAssessmentAttempt(attemptData) {
    const attempt = {
      ...attemptData,
      submittedAt: new Date()
    };
    return await db.assessmentAttempts.add(attempt);
  },

  async getAttemptsByAssessment(assessmentId) {
    return await db.assessmentAttempts.where('assessmentId').equals(assessmentId).toArray();
  },

  async getAttemptsByCandidate(candidateId) {
    return await db.assessmentAttempts.where('candidateId').equals(candidateId).toArray();
  }
};

// Initialize with sample data if database is empty
export const initializeSampleData = async () => {
  try {
    // Check if any sample data already exists
    const userCount = await db.users.count();
    
    if (userCount > 0) {
      console.log('Sample data already exists, skipping initialization');
      return;
    }
    
    console.log('Initializing sample data...');
    
    // Use transaction to ensure atomicity
    await db.transaction('rw', [db.companies, db.users, db.jobs, db.jobStages, db.candidates, db.timeline], async () => {
      // Create sample companies
      const company1Id = await dbHelpers.createCompany({
        name: 'TechCorp Inc',
        domain: 'techcorp.com'
      });
      
      const company2Id = await dbHelpers.createCompany({
        name: 'StartupHub',
        domain: 'startuphub.io'
      });
      
      // Create sample users
      const hr1Id = await dbHelpers.createUser({
        email: 'sarah.wilson@techcorp.com',
        username: 'hr_techcorp',
        password: 'password123', // In production, hash this
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'hr',
        companyId: company1Id
      });
      
      const hr2Id = await dbHelpers.createUser({
        email: 'hiring@techcorp.com',
        username: 'hiring_techcorp',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson', 
        role: 'hr',
        companyId: company1Id
      });
      
      const hr3Id = await dbHelpers.createUser({
        email: 'hr@startuphub.io',
        username: 'hr_startup',
        password: 'password123',
        firstName: 'Lisa',
        lastName: 'Chen',
        role: 'hr',
        companyId: company2Id
      });
      
      await dbHelpers.createUser({
        email: 'john.doe@example.com',
        username: 'john_doe',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'candidate',
        companyId: null
      });
      
      await dbHelpers.createUser({
        email: 'jane.smith@example.com',
        username: 'jane_smith',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'candidate',
        companyId: null
      });

      // Create sample jobs
      const job1Id = await dbHelpers.createJob({
        companyId: company1Id,
        title: 'Senior Frontend Developer',
        status: 'Active',
        description: 'Join our team to build amazing user interfaces with React and TypeScript.',
        location: 'Remote',
        salary: '$80,000 - $120,000',
        type: 'Full-time',
        companyName: 'TechCorp Inc',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        applicants: 0,
        createdById: hr1Id
      });

      const job2Id = await dbHelpers.createJob({
        companyId: company1Id,
        title: 'Product Manager',
        status: 'Active',
        description: 'Lead the vision and roadmap for our core product. Work with engineering and design teams.',
        location: 'San Francisco, CA',
        salary: '$100,000 - $140,000',
        type: 'Full-time',
        companyName: 'TechCorp Inc',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        applicants: 0,
        createdById: hr1Id
      });

      const job3Id = await dbHelpers.createJob({
        companyId: company2Id,
        title: 'UX/UI Designer',
        status: 'Active',
        description: 'Design beautiful and intuitive user experiences for our platform.',
        location: 'New York, NY',
        salary: '$70,000 - $100,000',
        type: 'Contract',
        companyName: 'StartupHub',
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        applicants: 0,
        createdById: hr3Id
      });

      // Create default stages for each job
      await dbHelpers.createJobStage({
        jobId: job1Id,
        name: 'Applied',
        order: 1,
        type: 'candidate',
        position: JSON.stringify({ x: 0, y: 250 }),
        nodeId: `job-${job1Id}-stage-applied`
      });

      await dbHelpers.createJobStage({
        jobId: job1Id,
        name: 'Screening',
        order: 2,
        type: 'candidate',
        position: JSON.stringify({ x: 400, y: 250 }),
        nodeId: `job-${job1Id}-stage-screening`
      });

      await dbHelpers.createJobStage({
        jobId: job1Id,
        name: 'Interview',
        order: 3,
        type: 'candidate',
        position: JSON.stringify({ x: 800, y: 250 }),
        nodeId: `job-${job1Id}-stage-interview`
      });

      await dbHelpers.createJobStage({
        jobId: job1Id,
        name: 'Offer',
        order: 4,
        type: 'candidate',
        position: JSON.stringify({ x: 1200, y: 250 }),
        nodeId: `job-${job1Id}-stage-offer`
      });

      // Add stages for job 2
      await dbHelpers.createJobStage({
        jobId: job2Id,
        name: 'Applied',
        order: 1,
        type: 'candidate',
        position: JSON.stringify({ x: 0, y: 250 }),
        nodeId: `job-${job2Id}-stage-applied`
      });

      await dbHelpers.createJobStage({
        jobId: job2Id,
        name: 'Assessment',
        order: 2,
        type: 'assessment',
        position: JSON.stringify({ x: 400, y: 250 }),
        nodeId: `job-${job2Id}-stage-assessment`
      });

      await dbHelpers.createJobStage({
        jobId: job2Id,
        name: 'Interview',
        order: 3,
        type: 'candidate',
        position: JSON.stringify({ x: 800, y: 250 }),
        nodeId: `job-${job2Id}-stage-interview`
      });

      // Add stages for job 3
      await dbHelpers.createJobStage({
        jobId: job3Id,
        name: 'Applied',
        order: 1,
        type: 'candidate',
        position: JSON.stringify({ x: 0, y: 250 }),
        nodeId: `job-${job3Id}-stage-applied`
      });

      await dbHelpers.createJobStage({
        jobId: job3Id,
        name: 'Portfolio Review',
        order: 2,
        type: 'candidate',
        position: JSON.stringify({ x: 400, y: 250 }),
        nodeId: `job-${job3Id}-stage-portfolio`
      });

      // Create sample candidates
      const candidate1Id = await db.candidates.add({
        name: 'Alex Thompson',
        email: 'alex.thompson@email.com',
        phone: '+1-555-0101',
        currentStage: 'Applied',
        position: 'Senior Frontend Developer',
        experience: '5 years',
        skills: ['React', 'TypeScript', 'Node.js'],
        status: 'Active',
        notes: 'Strong React experience, good portfolio',
        resumeUrl: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      });

      const candidate2Id = await db.candidates.add({
        name: 'Sarah Rodriguez',
        email: 'sarah.rodriguez@email.com',
        phone: '+1-555-0102',
        currentStage: 'Phone Screen',
        position: 'Backend Developer',
        experience: '3 years',
        skills: ['Python', 'Django', 'PostgreSQL'],
        status: 'Active',
        notes: 'Good communication skills, solid backend knowledge',
        resumeUrl: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)  // 1 day ago
      });

      const candidate3Id = await db.candidates.add({
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0103',
        currentStage: 'Technical Interview',
        position: 'Full Stack Developer',
        experience: '4 years',
        skills: ['JavaScript', 'React', 'Express', 'MongoDB'],
        status: 'Active',
        notes: 'Great problem-solving skills, quick learner',
        resumeUrl: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)       // 2 hours ago
      });

      // Create sample timeline entries
      const timelineEntries = [
        {
          candidateId: candidate1Id,
          candidateName: 'Alex Thompson',
          action: 'created',
          fromStage: null,
          toStage: 'Applied',
          details: 'New candidate application received',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          candidateId: candidate2Id,
          candidateName: 'Sarah Rodriguez',
          action: 'created',
          fromStage: null,
          toStage: 'Applied',
          details: 'New candidate application received',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          candidateId: candidate2Id,
          candidateName: 'Sarah Rodriguez',
          action: 'moved',
          fromStage: 'Applied',
          toStage: 'Phone Screen',
          details: 'Moved to Phone Screen stage',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          candidateId: candidate3Id,
          candidateName: 'Michael Chen',
          action: 'created',
          fromStage: null,
          toStage: 'Applied',
          details: 'New candidate application received',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          candidateId: candidate3Id,
          candidateName: 'Michael Chen',
          action: 'moved',
          fromStage: 'Applied',
          toStage: 'Phone Screen',
          details: 'Moved to Phone Screen stage',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          candidateId: candidate3Id,
          candidateName: 'Michael Chen',
          action: 'moved',
          fromStage: 'Phone Screen',
          toStage: 'Technical Interview',
          details: 'Moved to Technical Interview stage',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ];

      for (const entry of timelineEntries) {
        await db.timeline.add(entry);
      }
    });
    
    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
    // Clear potentially corrupted data and try to recover
    try {
      const userCount = await db.users.count();
      if (userCount === 0) {
        console.log('No data was created, safe to continue');
      }
    } catch (recoveryError) {
      console.error('Error during recovery check:', recoveryError);
    }
  }
};

// Helper function to clear all data (for testing)
export const clearAllData = async () => {
  try {
    await db.transaction('rw', [
      db.users, 
      db.companies, 
      db.jobs, 
      db.candidates, 
      db.applications, 
      db.assessments, 
      db.assessmentQuestions,
      db.assessmentResponses,
      db.assessmentAttempts,
      db.candidateHistory, 
      db.jobStages, 
      db.timeline,
      db.appSettings
    ], async () => {
      await Promise.all([
        db.users.clear(),
        db.companies.clear(),
        db.jobs.clear(),
        db.candidates.clear(),
        db.applications.clear(),
        db.assessments.clear(),
        db.assessmentQuestions.clear(),
        db.assessmentResponses.clear(),
        db.assessmentAttempts.clear(),
        db.candidateHistory.clear(),
        db.timeline.clear(),
        db.jobStages.clear(),
        db.appSettings.clear()
      ]);
    });
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export default db;