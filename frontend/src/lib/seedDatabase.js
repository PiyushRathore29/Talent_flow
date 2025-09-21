import { db } from './database.js';

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

// Assessment question types and templates
const assessmentQuestions = {
  technical: [
    {
      title: 'Explain the difference between REST and GraphQL APIs',
      description: 'Provide a detailed comparison including pros and cons of each approach.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'What is your experience with cloud platforms?',
      description: 'Select all cloud platforms you have worked with professionally.',
      questionType: 'multiple_choice',
      options: ['AWS', 'Google Cloud', 'Microsoft Azure', 'DigitalOcean', 'Heroku', 'None'],
      isRequired: true
    },
    {
      title: 'Rate your proficiency in JavaScript',
      description: 'Please rate your JavaScript skills on a scale of 1-10.',
      questionType: 'scale',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      isRequired: true
    },
    {
      title: 'Describe your approach to debugging complex issues',
      description: 'Walk us through your systematic approach to identifying and fixing bugs.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'Which testing frameworks have you used?',
      description: 'Select all testing frameworks you are familiar with.',
      questionType: 'multiple_choice',
      options: ['Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit', 'PyTest', 'Other'],
      isRequired: true
    },
    {
      title: 'Explain the concept of microservices architecture',
      description: 'Describe microservices, their benefits, and challenges.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'How do you handle version control in team projects?',
      description: 'Describe your Git workflow and collaboration practices.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'What databases have you worked with?',
      description: 'Select all database technologies you have experience with.',
      questionType: 'multiple_choice',
      options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'Other'],
      isRequired: true
    },
    {
      title: 'Rate your experience with containerization',
      description: 'How would you rate your Docker/container experience?',
      questionType: 'scale',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      isRequired: true
    },
    {
      title: 'Describe a challenging project you led',
      description: 'Tell us about a complex project where you took the lead role.',
      questionType: 'text',
      isRequired: true
    }
  ],
  behavioral: [
    {
      title: 'Tell us about a time you faced a difficult deadline',
      description: 'Describe the situation, your actions, and the outcome.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'How do you handle conflict in a team?',
      description: 'Describe your approach to resolving team conflicts.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'What motivates you at work?',
      description: 'Select the factors that most motivate you professionally.',
      questionType: 'multiple_choice',
      options: ['Challenging Problems', 'Team Collaboration', 'Learning Opportunities', 'Recognition', 'Autonomy', 'Making Impact'],
      isRequired: true
    },
    {
      title: 'Describe your ideal work environment',
      description: 'What type of work environment helps you perform your best?',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'How do you prioritize tasks when everything is urgent?',
      description: 'Walk us through your prioritization process.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'Rate your preference for remote vs office work',
      description: 'What is your preferred work arrangement?',
      questionType: 'scale',
      options: ['Fully Remote', 'Mostly Remote', 'Hybrid', 'Mostly Office', 'Fully Office'],
      isRequired: true
    },
    {
      title: 'Tell us about a time you had to learn something completely new',
      description: 'Describe how you approach learning new skills or technologies.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'How do you give and receive feedback?',
      description: 'Describe your approach to feedback in professional settings.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'What role do you typically take in team projects?',
      description: 'Select the role you most often find yourself in.',
      questionType: 'multiple_choice',
      options: ['Leader', 'Coordinator', 'Individual Contributor', 'Mentor', 'Creative Thinker', 'Problem Solver'],
      isRequired: true
    },
    {
      title: 'Describe your long-term career goals',
      description: 'Where do you see yourself professionally in 3-5 years?',
      questionType: 'text',
      isRequired: true
    }
  ],
  cultural: [
    {
      title: 'What company values resonate most with you?',
      description: 'Select the values that are most important to you in a workplace.',
      questionType: 'multiple_choice',
      options: ['Innovation', 'Transparency', 'Work-Life Balance', 'Diversity & Inclusion', 'Growth Mindset', 'Collaboration'],
      isRequired: true
    },
    {
      title: 'How do you define success in your career?',
      description: 'Tell us what professional success means to you.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'Describe your communication style',
      description: 'How would you describe the way you communicate with colleagues?',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'What type of manager brings out your best work?',
      description: 'Describe the management style that helps you thrive.',
      questionType: 'text',
      isRequired: true
    },
    {
      title: 'How important is continuous learning to you?',
      description: 'Rate the importance of ongoing professional development.',
      questionType: 'scale',
      options: ['Not Important', 'Somewhat Important', 'Important', 'Very Important', 'Essential'],
      isRequired: true
    }
  ]
};

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
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await clearDatabase();
    
    // Seed companies
    console.log('📢 Seeding companies...');
    const companyIds = await seedCompanies();
    
    // Seed users
    console.log('👥 Seeding users...');
    const userIds = await seedUsers(companyIds);
    
    // Seed jobs
    console.log('💼 Seeding jobs...');
    const jobIds = await seedJobs(companyIds, userIds);
    
    // Seed job stages
    console.log('📊 Seeding job stages...');
    await seedJobStages(jobIds);
    
    // Seed assessments
    console.log('📝 Seeding assessments...');
    const assessmentIds = await seedAssessments(jobIds, companyIds, userIds);
    
    // Seed assessment questions
    console.log('❓ Seeding assessment questions...');
    await seedAssessmentQuestions(assessmentIds);
    
    // Seed candidates
    console.log('🎯 Seeding candidates...');
    const candidateIds = await seedCandidates(companyIds, jobIds, userIds);
    
    // Seed candidate history
    console.log('📈 Seeding candidate history...');
    await seedCandidateHistory(candidateIds, userIds);
    
    // Seed assessment responses
    console.log('✅ Seeding assessment responses...');
    await seedAssessmentResponses(assessmentIds, candidateIds);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Print summary
    await printSeedingSummary();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    db.users.clear(),
    db.companies.clear(),
    db.jobs.clear(),
    db.jobStages.clear(),
    db.candidates.clear(),
    db.candidateHistory.clear(),
    db.candidateNotes.clear(),
    db.assessments.clear(),
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

const seedAssessments = async (jobIds, companyIds, userIds) => {
  const assessmentIds = [];
  const employerIds = userIds.slice(0, 5);
  
  const assessmentTypes = [
    { title: 'Technical Skills Assessment', description: 'Evaluate technical competencies and problem-solving abilities' },
    { title: 'Behavioral Interview Questions', description: 'Assess cultural fit and soft skills' },
    { title: 'Cultural Fit Evaluation', description: 'Determine alignment with company values and culture' }
  ];
  
  // Create at least 3 assessments, but distribute across different jobs
  for (let i = 0; i < Math.max(3, Math.floor(jobIds.length * 0.6)); i++) {
    const assessment = getRandomItem(assessmentTypes);
    const jobId = jobIds[i % jobIds.length];
    
    const id = await db.assessments.add({
      jobId,
      stageId: 2, // Technical stage
      companyId: getRandomItem(companyIds),
      title: assessment.title,
      description: assessment.description,
      instructions: 'Please answer all questions thoroughly and honestly. Take your time to provide detailed responses.',
      timeLimit: 45, // minutes
      passingScore: 70,
      isRequired: true,
      settings: {
        allowRetakes: false,
        randomizeQuestions: true,
        showResults: false
      },
      createdById: getRandomItem(employerIds),
      createdAt: getRandomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date()
    });
    assessmentIds.push(id);
  }
  
  return assessmentIds;
};

const seedAssessmentQuestions = async (assessmentIds) => {
  for (let i = 0; i < assessmentIds.length; i++) {
    const assessmentId = assessmentIds[i];
    let questionSet;
    
    // Distribute question types across assessments
    if (i % 3 === 0) {
      questionSet = assessmentQuestions.technical;
    } else if (i % 3 === 1) {
      questionSet = assessmentQuestions.behavioral;
    } else {
      questionSet = assessmentQuestions.cultural;
    }
    
    // Add 10-15 questions per assessment
    const questionsToAdd = getRandomItems(questionSet, Math.min(questionSet.length, 10 + Math.floor(Math.random() * 6)));
    
    for (let j = 0; j < questionsToAdd.length; j++) {
      const question = questionsToAdd[j];
      await db.assessmentQuestions.add({
        assessmentId,
        questionType: question.questionType,
        title: question.title,
        description: question.description,
        options: question.options || null,
        validation: question.questionType === 'text' ? { minLength: 50 } : null,
        conditionalLogic: null,
        order: j + 1,
        isRequired: question.isRequired,
        createdAt: new Date()
      });
    }
  }
};

const seedCandidates = async (companyIds, jobIds, userIds) => {
  const candidateIds = [];
  const candidateUserIds = userIds.slice(5); // Skip employer users
  
  for (let i = 0; i < 100; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const jobId = getRandomItem(jobIds);
    const appliedDate = getRandomDate(new Date(2024, 0, 1), new Date());
    
    const id = await db.candidates.add({
      companyId: getRandomItem(companyIds),
      jobId,
      userId: candidateUserIds[i % candidateUserIds.length],
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@email.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      stage: getRandomItem(stages).id,
      currentStageId: Math.floor(Math.random() * 6) + 1,
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

const seedAssessmentResponses = async (assessmentIds, candidateIds) => {
  // Create responses for about 60% of candidates
  const respondingCandidates = getRandomItems(candidateIds, Math.floor(candidateIds.length * 0.6));
  
  for (const candidateId of respondingCandidates) {
    const assessmentId = getRandomItem(assessmentIds);
    const startedAt = getRandomDate(new Date(2024, 0, 1), new Date());
    const submittedAt = new Date(startedAt.getTime() + (Math.random() * 3600000)); // 0-60 minutes later
    
    await db.assessmentResponses.add({
      assessmentId,
      candidateId,
      questionResponses: {}, // This would contain actual answers in a real scenario
      submittedAt,
      timeTaken: Math.floor((submittedAt - startedAt) / 1000 / 60), // minutes
      score: Math.floor(Math.random() * 40) + 60, // 60-100 score
      isCompleted: true,
      startedAt
    });
  }
};

const printSeedingSummary = async () => {
  const counts = {
    companies: await db.companies.count(),
    users: await db.users.count(),
    jobs: await db.jobs.count(),
    jobStages: await db.jobStages.count(),
    candidates: await db.candidates.count(),
    candidateHistory: await db.candidateHistory.count(),
    assessments: await db.assessments.count(),
    assessmentQuestions: await db.assessmentQuestions.count(),
    assessmentResponses: await db.assessmentResponses.count()
  };
  
  console.log('\n📊 SEEDING SUMMARY:');
  console.log('==================');
  console.log(`👥 Companies: ${counts.companies}`);
  console.log(`🧑‍💼 Users: ${counts.users}`);
  console.log(`💼 Jobs: ${counts.jobs}`);
  console.log(`📊 Job Stages: ${counts.jobStages}`);
  console.log(`🎯 Candidates: ${counts.candidates}`);
  console.log(`📈 Candidate History: ${counts.candidateHistory}`);
  console.log(`📝 Assessments: ${counts.assessments}`);
  console.log(`❓ Assessment Questions: ${counts.assessmentQuestions}`);
  console.log(`✅ Assessment Responses: ${counts.assessmentResponses}`);
  console.log('==================\n');
};

// Export for use in main app
export default seedDatabase;