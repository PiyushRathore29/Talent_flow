// Sample team members for @mentions
export const teamMembers = [
  { id: 'tm-1', name: 'Jane Doe', role: 'Senior HR Manager', email: 'jane.doe@company.com' },
  { id: 'tm-2', name: 'John Smith', role: 'Technical Lead', email: 'john.smith@company.com' },
  { id: 'tm-3', name: 'Sarah Wilson', role: 'Hiring Manager', email: 'sarah.wilson@company.com' },
  { id: 'tm-4', name: 'Mike Johnson', role: 'HR Coordinator', email: 'mike.johnson@company.com' },
  { id: 'tm-5', name: 'Lisa Chen', role: 'Product Manager', email: 'lisa.chen@company.com' }
];

export const initialCandidates = {
  'cand-1': {
    id: 'cand-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1 (555) 123-4567',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    currentStage: 'SCREENING',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-20',
    history: [
      { stage: 'APPLIED', date: '2025-07-20', actor: 'System', note: 'Application submitted' },
      { stage: 'SCREENING', date: '2025-07-22', actor: 'John Smith', note: 'Moved to screening after initial review' },
    ],
    notes: [
      { 
        id: 'note-1', 
        text: 'Strong portfolio, looks promising. Let\'s get @Jane Doe to review the technical assessment.', 
        author: 'John Smith', 
        date: '2025-07-21',
        mentions: ['tm-1']
      },
      { 
        id: 'note-2', 
        text: 'Scheduled phone screening for tomorrow at 2 PM. @Sarah Wilson will conduct the interview.', 
        author: 'Mike Johnson', 
        date: '2025-07-22',
        mentions: ['tm-3']
      },
    ]
  },
  'cand-2': {
    id: 'cand-2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    phone: '+1 (555) 234-5678',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    currentStage: 'INTERVIEW',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-19',
    history: [
      { stage: 'APPLIED', date: '2025-07-19', actor: 'System', note: 'Application submitted' },
      { stage: 'SCREENING', date: '2025-07-20', actor: 'Sarah Wilson', note: 'Initial screening completed' },
      { stage: 'INTERVIEW', date: '2025-07-23', actor: 'Jane Doe', note: 'Advanced to technical interview' },
    ],
    notes: [
      { 
        id: 'note-3', 
        text: 'Great communication skills and solid React experience. Ready for technical round with @John Smith.', 
        author: 'Sarah Wilson', 
        date: '2025-07-21',
        mentions: ['tm-2']
      },
    ]
  },
  'cand-3': {
    id: 'cand-3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '+1 (555) 345-6789',
    jobId: '2',
    jobTitle: 'Product Manager',
    currentStage: 'OFFER',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-18',
    history: [
      { stage: 'APPLIED', date: '2025-07-18', actor: 'System', note: 'Application submitted' },
      { stage: 'SCREENING', date: '2025-07-19', actor: 'Lisa Chen', note: 'Product screening passed' },
      { stage: 'INTERVIEW', date: '2025-07-21', actor: 'Lisa Chen', note: 'Interview completed successfully' },
      { stage: 'OFFER', date: '2025-07-24', actor: 'Jane Doe', note: 'Offer extended' },
    ],
    notes: [
      { 
        id: 'note-4', 
        text: 'Excellent product vision and stakeholder management experience. Recommended for hire. @Jane Doe please prepare offer.', 
        author: 'Lisa Chen', 
        date: '2025-07-22',
        mentions: ['tm-1']
      },
      { 
        id: 'note-5', 
        text: 'Offer sent via email. Waiting for candidate response. Follow up scheduled for next week.', 
        author: 'Jane Doe', 
        date: '2025-07-24',
        mentions: []
      },
    ]
  },
  'cand-4': {
    id: 'cand-4',
    name: 'Diana Martinez',
    email: 'diana.m@example.com',
    phone: '+1 (555) 456-7890',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    currentStage: 'HIRED',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-15',
    history: [
      { stage: 'APPLIED', date: '2025-07-15', actor: 'System', note: 'Application submitted' },
      { stage: 'SCREENING', date: '2025-07-16', actor: 'Sarah Wilson', note: 'Fast-tracked based on referral' },
      { stage: 'INTERVIEW', date: '2025-07-18', actor: 'John Smith', note: 'Excellent technical interview' },
      { stage: 'OFFER', date: '2025-07-19', actor: 'Jane Doe', note: 'Offer extended and accepted' },
      { stage: 'HIRED', date: '2025-07-20', actor: 'Jane Doe', note: 'Onboarding initiated' },
    ],
    notes: [
      { 
        id: 'note-6', 
        text: 'Exceptional candidate with 8+ years experience. Strong recommendation from @John Smith. Fast-track approved.', 
        author: 'Sarah Wilson', 
        date: '2025-07-16',
        mentions: ['tm-2']
      },
      { 
        id: 'note-7', 
        text: 'Offer accepted! Start date confirmed for next Monday. @Mike Johnson please initiate onboarding process.', 
        author: 'Jane Doe', 
        date: '2025-07-20',
        mentions: ['tm-4']
      },
    ]
  },
};
