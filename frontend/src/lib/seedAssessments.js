import { db } from './database.js';

// Assessment templates for different job types
const assessmentTemplates = {
  developer: {
    title: 'Technical Skills Assessment',
    description: 'Evaluate technical programming skills and problem-solving abilities',
    sections: [
      {
        id: 'technical-knowledge',
        title: 'Technical Knowledge',
        description: 'Core programming concepts and best practices',
        questions: [
          {
            id: 'q1',
            type: 'single-choice',
            title: 'What is the time complexity of binary search?',
            description: 'Select the correct time complexity',
            required: true,
            options: [
              { id: 'opt1', text: 'O(n)', value: 'O(n)' },
              { id: 'opt2', text: 'O(log n)', value: 'O(log n)' },
              { id: 'opt3', text: 'O(n²)', value: 'O(n²)' },
              { id: 'opt4', text: 'O(1)', value: 'O(1)' }
            ],
            validation: { required: true }
          },
          {
            id: 'q2',
            type: 'multi-choice',
            title: 'Which programming languages have you used professionally?',
            description: 'Select all that apply',
            required: false,
            options: [
              { id: 'opt1', text: 'JavaScript', value: 'javascript' },
              { id: 'opt2', text: 'Python', value: 'python' },
              { id: 'opt3', text: 'Java', value: 'java' },
              { id: 'opt4', text: 'C++', value: 'cpp' },
              { id: 'opt5', text: 'Go', value: 'go' }
            ],
            validation: { required: false, minSelections: 1 }
          },
          {
            id: 'q3',
            type: 'numeric',
            title: 'Years of professional programming experience',
            description: 'Enter the number of years',
            required: true,
            validation: { required: true, minValue: 0, maxValue: 20 }
          },
          {
            id: 'q4',
            type: 'long-text',
            title: 'Describe a challenging technical problem you solved',
            description: 'Explain the problem, your approach, and the solution',
            required: true,
            validation: { required: true, minLength: 100, maxLength: 1000 }
          }
        ]
      }
    ]
  },
  
  manager: {
    title: 'Leadership & Management Assessment',
    description: 'Evaluate leadership skills, team management, and strategic thinking',
    sections: [
      {
        id: 'leadership-skills',
        title: 'Leadership Skills',
        description: 'Assess leadership capabilities and management style',
        questions: [
          {
            id: 'q1',
            type: 'single-choice',
            title: 'How do you handle team conflicts?',
            description: 'Select your preferred approach',
            required: true,
            options: [
              { id: 'opt1', text: 'Address immediately with all parties', value: 'immediate' },
              { id: 'opt2', text: 'Meet individually first, then together', value: 'individual_first' },
              { id: 'opt3', text: 'Let the team resolve it themselves', value: 'team_resolve' },
              { id: 'opt4', text: 'Escalate to upper management', value: 'escalate' }
            ],
            validation: { required: true }
          },
          {
            id: 'q2',
            type: 'multi-choice',
            title: 'Which management methodologies have you implemented?',
            description: 'Select all that apply',
            required: false,
            options: [
              { id: 'opt1', text: 'Agile/Scrum', value: 'agile' },
              { id: 'opt2', text: 'Kanban', value: 'kanban' },
              { id: 'opt3', text: 'Waterfall', value: 'waterfall' },
              { id: 'opt4', text: 'Lean', value: 'lean' }
            ],
            validation: { required: false, minSelections: 1 }
          },
          {
            id: 'q3',
            type: 'long-text',
            title: 'Describe a time you successfully led a difficult project',
            description: 'Include challenges faced, your leadership approach, and outcomes',
            required: true,
            validation: { required: true, minLength: 150, maxLength: 1000 }
          }
        ]
      }
    ]
  },
  
  designer: {
    title: 'Design Skills Assessment',
    description: 'Evaluate design thinking, creativity, and technical design skills',
    sections: [
      {
        id: 'design-fundamentals',
        title: 'Design Fundamentals',
        description: 'Core design principles and user experience knowledge',
        questions: [
          {
            id: 'q1',
            type: 'single-choice',
            title: 'What is the primary goal of user-centered design?',
            description: 'Select the best answer',
            required: true,
            options: [
              { id: 'opt1', text: 'Make products look beautiful', value: 'beautiful' },
              { id: 'opt2', text: 'Solve user problems effectively', value: 'solve_problems' },
              { id: 'opt3', text: 'Use latest design trends', value: 'trends' },
              { id: 'opt4', text: 'Minimize development costs', value: 'costs' }
            ],
            validation: { required: true }
          },
          {
            id: 'q2',
            type: 'multi-choice',
            title: 'Which design tools have you used professionally?',
            description: 'Select all that apply',
            required: false,
            options: [
              { id: 'opt1', text: 'Figma', value: 'figma' },
              { id: 'opt2', text: 'Sketch', value: 'sketch' },
              { id: 'opt3', text: 'Adobe XD', value: 'xd' },
              { id: 'opt4', text: 'InVision', value: 'invision' },
              { id: 'opt5', text: 'Principle', value: 'principle' }
            ],
            validation: { required: false, minSelections: 1 }
          },
          {
            id: 'q3',
            type: 'long-text',
            title: 'Walk us through your design process for a recent project',
            description: 'Include research, ideation, prototyping, and testing phases',
            required: true,
            validation: { required: true, minLength: 200, maxLength: 1000 }
          }
        ]
      }
    ]
  },
  
  sales: {
    title: 'Sales & Communication Assessment',
    description: 'Evaluate sales skills, communication abilities, and customer relationship management',
    sections: [
      {
        id: 'sales-skills',
        title: 'Sales Skills',
        description: 'Assess sales techniques and customer interaction abilities',
        questions: [
          {
            id: 'q1',
            type: 'single-choice',
            title: 'What is your approach to handling customer objections?',
            description: 'Select your preferred method',
            required: true,
            options: [
              { id: 'opt1', text: 'Address immediately and directly', value: 'direct' },
              { id: 'opt2', text: 'Acknowledge and redirect to benefits', value: 'redirect' },
              { id: 'opt3', text: 'Use questions to understand concerns', value: 'questions' },
              { id: 'opt4', text: 'Provide extensive documentation', value: 'documentation' }
            ],
            validation: { required: true }
          },
          {
            id: 'q2',
            type: 'numeric',
            title: 'Years of sales experience',
            description: 'Enter the number of years',
            required: true,
            validation: { required: true, minValue: 0, maxValue: 30 }
          },
          {
            id: 'q3',
            type: 'long-text',
            title: 'Describe your biggest sales achievement',
            description: 'Include the situation, your approach, and the results achieved',
            required: true,
            validation: { required: true, minLength: 150, maxLength: 800 }
          }
        ]
      }
    ]
  },
  
  marketing: {
    title: 'Marketing & Analytics Assessment',
    description: 'Evaluate marketing knowledge, campaign management, and analytical skills',
    sections: [
      {
        id: 'marketing-fundamentals',
        title: 'Marketing Fundamentals',
        description: 'Core marketing concepts and digital marketing knowledge',
        questions: [
          {
            id: 'q1',
            type: 'single-choice',
            title: 'Which metric is most important for measuring campaign success?',
            description: 'Select the primary metric you would focus on',
            required: true,
            options: [
              { id: 'opt1', text: 'Click-through rate (CTR)', value: 'ctr' },
              { id: 'opt2', text: 'Return on investment (ROI)', value: 'roi' },
              { id: 'opt3', text: 'Impressions', value: 'impressions' },
              { id: 'opt4', text: 'Engagement rate', value: 'engagement' }
            ],
            validation: { required: true }
          },
          {
            id: 'q2',
            type: 'multi-choice',
            title: 'Which marketing channels have you managed?',
            description: 'Select all that apply',
            required: false,
            options: [
              { id: 'opt1', text: 'Social Media', value: 'social' },
              { id: 'opt2', text: 'Email Marketing', value: 'email' },
              { id: 'opt3', text: 'SEO/SEM', value: 'seo' },
              { id: 'opt4', text: 'Content Marketing', value: 'content' },
              { id: 'opt5', text: 'Paid Advertising', value: 'paid' }
            ],
            validation: { required: false, minSelections: 2 }
          },
          {
            id: 'q3',
            type: 'long-text',
            title: 'Describe a successful marketing campaign you led',
            description: 'Include objectives, strategy, execution, and measurable results',
            required: true,
            validation: { required: true, minLength: 200, maxLength: 1000 }
          }
        ]
      }
    ]
  }
};

// Job type mapping for different job IDs
const jobTypeMapping = {
  1: 'developer',    // Senior Frontend Developer
  2: 'manager',      // Product Manager  
  3: 'designer',     // UX/UI Designer
  4: 'developer',    // Backend Developer
  5: 'sales',        // Sales Representative
  6: 'marketing',    // Marketing Manager
  7: 'developer',    // Full Stack Developer
  8: 'manager',      // Operations Manager
  9: 'developer',    // DevOps Engineer
  10: 'sales',       // Customer Success Manager
  11: 'designer',    // Graphic Designer
  12: 'developer',   // Mobile App Developer
  13: 'manager',     // Project Manager
  14: 'marketing',   // Content Marketing Specialist
  15: 'developer'    // Data Scientist
};

// Utility functions
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate unique question IDs
const generateQuestionId = (jobId, sectionId, questionIndex) => 
  `job-${jobId}-${sectionId}-q${questionIndex + 1}`;

const generateOptionId = (questionId, optionIndex) => 
  `${questionId}-opt${optionIndex + 1}`;

// Seed assessments for jobs 1-15
export const seedAssessments = async () => {
  try {
    // Clear existing assessments
    await db.assessments.clear();
    
    const assessmentIds = [];
    
    for (let jobId = 1; jobId <= 15; jobId++) {
      const jobType = jobTypeMapping[jobId];
      const template = assessmentTemplates[jobType];
      
      // Create assessment with job-specific details
      const assessment = {
        jobId: jobId,
        title: template.title,
        description: template.description,
        sections: template.sections.map((section, sectionIndex) => ({
          ...section,
          id: `job-${jobId}-${section.id}`,
          questions: section.questions.map((question, questionIndex) => ({
            ...question,
            id: generateQuestionId(jobId, section.id, questionIndex),
            options: question.options ? question.options.map((option, optionIndex) => ({
              ...option,
              id: generateOptionId(generateQuestionId(jobId, section.id, questionIndex), optionIndex)
            })) : undefined
          }))
        })),
        settings: {
          timeLimit: getRandomItem([30, 45, 60, 90]), // Random time limits
          allowBackNavigation: true,
          randomizeQuestions: Math.random() > 0.5, // Random setting
          showProgressBar: true,
          allowRetakes: Math.random() > 0.3, // 70% allow retakes
          showResults: Math.random() > 0.2, // 80% show results
          showCorrectAnswers: Math.random() > 0.7 // 30% show correct answers
        },
        status: getRandomItem(['active', 'draft', 'archived']),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        updatedAt: new Date()
      };
      
      // Add some variation to assessments
      if (Math.random() > 0.5) {
        // Add a second section to some assessments
        const additionalSection = {
          id: `job-${jobId}-additional`,
          title: 'Additional Questions',
          description: 'Supplementary evaluation questions',
          questions: [
            {
              id: generateQuestionId(jobId, 'additional', 0),
              type: 'short-text',
              title: 'What motivates you in your career?',
              description: 'Briefly describe your career motivations',
              required: false,
              validation: { required: false, maxLength: 200 }
            },
            {
              id: generateQuestionId(jobId, 'additional', 1),
              type: 'single-choice',
              title: 'Preferred work environment',
              description: 'Select your preferred work setup',
              required: false,
              options: [
                { id: generateOptionId(generateQuestionId(jobId, 'additional', 1), 0), text: 'Remote', value: 'remote' },
                { id: generateOptionId(generateQuestionId(jobId, 'additional', 1), 1), text: 'Hybrid', value: 'hybrid' },
                { id: generateOptionId(generateQuestionId(jobId, 'additional', 1), 2), text: 'Office', value: 'office' }
              ],
              validation: { required: false }
            }
          ]
        };
        
        assessment.sections.push(additionalSection);
      }
      
      const assessmentId = await db.assessments.add(assessment);
      assessmentIds.push(assessmentId);
    }
    
    return assessmentIds;
    
  } catch (error) {
    console.error('❌ Error seeding assessments:', error);
    throw error;
  }
};

// Export for use in main seeding
export default seedAssessments;

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.seedAssessments = seedAssessments;
  window.forceReSeedAssessments = async () => {
    await seedAssessments();
  };
}
