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
    currentStage: 'applied',
    stage: 'applied',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-20',
    history: [
      { stage: 'APPLIED', date: '2025-07-20', actor: 'System', note: 'Application submitted' },
    ],
    notes: [
      { 
        id: 'note-1', 
        text: 'Application received. Strong portfolio in the initial review. Ready for screening process.', 
        author: 'John Smith', 
        date: '2025-07-21',
        mentions: []
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
    currentStage: 'tech',
    stage: 'tech',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-19',
    history: [
      { stage: 'APPLIED', date: '2025-07-19', actor: 'System', note: 'Application submitted' },
      { stage: 'TECH', date: '2025-07-21', actor: 'John Smith', note: 'Moved to technical stage for assessment' },
    ],
    notes: [
      { 
        id: 'note-3', 
        text: 'Application looks promising. Strong background in React development based on resume review.', 
        author: 'Sarah Wilson', 
        date: '2025-07-21',
        mentions: []
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
    currentStage: 'applied',
    stage: 'applied',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-18',
    history: [
      { stage: 'APPLIED', date: '2025-07-18', actor: 'System', note: 'Application submitted' },
    ],
    notes: [
      { 
        id: 'note-4', 
        text: 'Product management background looks solid. Experience with stakeholder management is evident from resume.', 
        author: 'Lisa Chen', 
        date: '2025-07-22',
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
    currentStage: 'applied',
    stage: 'applied',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    appliedDate: '2025-07-15',
    history: [
      { stage: 'APPLIED', date: '2025-07-15', actor: 'System', note: 'Application submitted' },
    ],
    notes: [
      { 
        id: 'note-6', 
        text: 'Application submitted. Resume shows 8+ years of frontend development experience. Looks very promising.', 
        author: 'Sarah Wilson', 
        date: '2025-07-16',
        mentions: []
      },
    ]
  },
};
