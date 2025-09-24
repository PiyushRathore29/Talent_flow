import { db } from './database.js';
import { seedAssessments } from './seedAssessments.js';

// Sample data generators
const jobTitles = [
  'Senior Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist',
  'DevOps Engineer', 'Marketing Manager', 'Sales Representative', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'Quality Assurance Engineer', 'Business Analyst',
  'Customer Success Manager', 'Technical Writer', 'Project Manager', 'Scrum Master',
  'Mobile App Developer', 'Cloud Architect', 'Cybersecurity Specialist', 'Machine Learning Engineer',
  'Content Marketing Specialist', 'HR Generalist', 'Financial Analyst', 'Operations Manager',
  'UI/UX Designer'
];

const companies = [
  { name: 'TechCorp', domain: 'techcorp.com' },
  { name: 'InnovateLabs', domain: 'innovatelabs.io' },
  { name: 'DataFlow Solutions', domain: 'dataflow.com' }
];

const locations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL',
  'Boston, MA', 'Los Angeles, CA', 'Denver, CO', 'Remote', 'Miami, FL'
];

const skillTags = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'MongoDB', 'PostgreSQL', 'Redis', 'Microservices', 'Agile',
  'Leadership', 'Communication', 'Problem Solving', 'Team Management', 'Strategy'
];

const stages = [
  { id: 'applied', name: 'Applied' },
  { id: 'screen', name: 'Screening' },
  { id: 'tech', name: 'Technical' },
  { id: 'offer', name: 'Offer' },
  { id: 'hired', name: 'Hired' },
  { id: 'rejected', name: 'Rejected' }
];

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
  'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
  'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah',
  'Timothy', 'Dorothy', 'Ronald', 'Lisa', 'Jason', 'Nancy', 'Edward', 'Karen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];


// Utility functions
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Seeding functions
export const seedDatabase = async () => {
  try {
    // Clear existing data
    await clearDatabase();
    
    // Seed companies
    const companyIds = await seedCompanies();
    
    // Seed users
    const userIds = await seedUsers(companyIds);
    
    // Seed jobs
    const jobIds = await seedJobs(companyIds, userIds);
    
    // Seed job stages
    await seedJobStages(jobIds);
    
    // Seed candidates
    const candidateIds = await seedCandidates(companyIds, jobIds, userIds);
    
    // Seed candidate history
    await seedCandidateHistory(candidateIds, userIds);
    
    // Seed timeline entries for candidate creation
    await seedTimeline(candidateIds);
    
    // Seed assessments
    await seedAssessments();
    
    console.log('Database initialized');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  await Promise.all([
    db.users.clear(),
    db.companies.clear(),
    db.jobs.clear(),
    db.jobStages.clear(),
    db.candidates.clear(),
    db.candidateHistory.clear(),
    db.candidateNotes.clear(),
    db.timeline.clear(),
    db.assessments.clear(),
    db.assessmentSections.clear(),
    db.assessmentQuestions.clear(),
    db.assessmentResponses.clear(),
    db.assessmentAttempts.clear(),
    db.appSettings.clear()
  ]);
};

const seedCompanies = async () => {
  const companyIds = [];
  for (const company of companies) {
    const id = await db.companies.add({
      ...company,
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date())
    });
    companyIds.push(id);
  }
  return companyIds;
};

const seedUsers = async (companyIds) => {
  const userIds = [];
  
  // Create admin/employer users
  for (let i = 0; i < 5; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const id = await db.users.add({
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      firstName,
      lastName,
      role: 'employer',
      companyId: getRandomItem(companyIds),
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
      lastLogin: getRandomDate(new Date(2024, 0, 1), new Date())
    });
    userIds.push(id);
  }
  
  // Create candidate users
  for (let i = 0; i < 50; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const id = await db.users.add({
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.candidate${i}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.candidate${i}@email.com`,
      firstName,
      lastName,
      role: 'candidate',
      companyId: null,
      createdAt: getRandomDate(new Date(2023, 6, 1), new Date()),
      lastLogin: getRandomDate(new Date(2024, 0, 1), new Date())
    });
    userIds.push(id);
  }
  
  return userIds;
};

const seedJobs = async (companyIds, userIds) => {
  const jobIds = [];
  const employerIds = userIds.slice(0, 5); // First 5 users are employers
  
  for (let i = 0; i < 25; i++) {
    const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());
    const id = await db.jobs.add({
      title: jobTitles[i],
      companyId: getRandomItem(companyIds),
      status: Math.random() > 0.3 ? 'active' : 'archived',
      location: getRandomItem(locations),
      department: getRandomItem(['Engineering', 'Product', 'Marketing', 'Sales', 'Operations', 'HR']),
      employmentType: getRandomItem(['Full-time', 'Part-time', 'Contract', 'Intern']),
      experience: getRandomItem(['Entry', 'Mid', 'Senior', 'Lead']),
      salary: {
        min: 50000 + Math.floor(Math.random() * 100000),
        max: 100000 + Math.floor(Math.random() * 150000),
        currency: 'USD'
      },
      description: `We are looking for a talented ${jobTitles[i]} to join our growing team. This role offers excellent opportunities for professional growth and the chance to work on cutting-edge projects.`,
      requirements: getRandomItems(skillTags, 5),
      benefits: ['Health Insurance', 'Dental Insurance', '401k Matching', 'Flexible PTO', 'Remote Work Options'],
      tags: getRandomItems(skillTags, 3),
      order: i + 1,
      createdById: getRandomItem(employerIds),
      createdAt,
      updatedAt: getRandomDate(createdAt, new Date())
    });
    jobIds.push(id);
  }
  
  return jobIds;
};

const seedJobStages = async (jobIds) => {
  for (const jobId of jobIds) {
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      await db.jobStages.add({
        jobId,
        name: stage.name,
        order: i + 1,
        type: 'default',
        position: { x: 400, y: 300 + i * 300 },
        nodeId: `stage-${stage.id}-${jobId}`,
        createdAt: new Date()
      });
    }
  }
};



const seedCandidates = async (companyIds, jobIds, userIds) => {
  const candidateIds = [];
  const candidateUserIds = userIds.slice(5); // Skip employer users
  
  // Generate 1000 candidates distributed across all jobs
  for (let i = 0; i < 1000; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    // Distribute candidates evenly across all jobs
    const jobId = jobIds[i % jobIds.length];
    const appliedDate = getRandomDate(new Date(2024, 0, 1), new Date());
    
    const id = await db.candidates.add({
      companyId: getRandomItem(companyIds),
      jobId,
      userId: candidateUserIds[i % candidateUserIds.length],
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@email.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      stage: 'applied', // All candidates start in applied stage
      currentStage: 'Applied', // Consistent naming
      currentStageId: 1, // Applied stage ID
      appliedDate,
      createdAt: appliedDate,
      resume: `Experienced professional with ${Math.floor(Math.random() * 10) + 1} years in the industry. Strong background in ${getRandomItems(skillTags, 3).join(', ')}. Proven track record of delivering high-quality results and working effectively in team environments.`,
      skills: getRandomItems(skillTags, Math.floor(Math.random() * 5) + 3),
      experience: `${Math.floor(Math.random() * 15) + 1} years`,
      expectedSalary: 50000 + Math.floor(Math.random() * 100000),
      availability: getRandomItem(['Immediate', '2 weeks', '1 month', '2 months'])
    });
    candidateIds.push(id);
  }
  
  return candidateIds;
};

const seedCandidateHistory = async (candidateIds, userIds) => {
  const employerIds = userIds.slice(0, 5);
  
  for (const candidateId of candidateIds) {
    // Create 1-3 history entries per candidate
    const historyCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < historyCount; i++) {
      const fromStage = Math.floor(Math.random() * 5) + 1;
      const toStage = Math.min(fromStage + 1, 6);
      
      await db.candidateHistory.add({
        candidateId,
        fromStageId: i === 0 ? null : fromStage,
        toStageId: toStage,
        changedBy: getRandomItem(employerIds),
        changedAt: getRandomDate(new Date(2024, 0, 1), new Date()),
        note: getRandomItem([
          'Initial application received',
          'Passed initial screening',
          'Technical interview completed',
          'Strong performance in assessment',
          'Reference check completed',
          'Offer extended',
          'Candidate accepted position',
          'Unfortunately, not a fit for this role'
        ])
      });
    }
  }
};


const seedTimeline = async (candidateIds) => {
  // Create timeline entries for all candidate creations
  for (const candidateId of candidateIds) {
    // Get the candidate details to create timeline entry
    const candidate = await db.candidates.get(candidateId);
    
    if (candidate) {
      await db.timeline.add({
        candidateId: candidateId,
        candidateName: candidate.name,
        action: 'created',
        fromStage: null,
        toStage: 'Applied',
        details: 'New candidate application received',
        timestamp: candidate.appliedDate || candidate.createdAt
      });
    }
  }
};

const printSeedingSummary = async () => {
  // Summary removed to reduce console output
};


// Export for use in main app
export default seedDatabase;


// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.forceReSeedDatabase = async () => {
    await seedDatabase();
  };
}