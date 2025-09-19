export const initialJobsData = {
  '1': {
    details: { id: '1', title: 'Senior Frontend Developer', status: 'Active', applicants: 2, description: 'Join our team to build amazing user interfaces.' },
    nodes: [
      { id: 'job-1', type: 'job', position: { x: 350, y: 0 }, data: { id: '1', title: 'Senior Frontend Developer', status: 'Active', applicants: 2, description: 'Join our team to build amazing user interfaces.' } },
      { id: 'job-1-stage-1', type: 'candidate', position: { x: 0, y: 250 }, data: { stage: 'APPLIED', candidateIds: ['cand-1', 'cand-2'] } },
      { id: 'job-1-stage-2', type: 'candidate', position: { x: 400, y: 250 }, data: { stage: 'SCREENING', candidateIds: [] } },
      { id: 'job-1-stage-3', type: 'candidate', position: { x: 800, y: 250 }, data: { stage: 'INTERVIEW', candidateIds: [] } },
      { id: 'job-1-stage-4', type: 'candidate', position: { x: 1200, y: 250 }, data: { stage: 'OFFER', candidateIds: [] } },
    ],
    edges: [
      { id: 'e-job1-s1', source: 'job-1', target: 'job-1-stage-1', type: 'smoothstep', style: { stroke: '#CBD5E1', strokeWidth: 2 } },
      { id: 'e-job1-s1-s2', source: 'job-1-stage-1', target: 'job-1-stage-2', type: 'addStageEdge' },
      { id: 'e-job1-s2-s3', source: 'job-1-stage-2', target: 'job-1-stage-3', type: 'addStageEdge' },
      { id: 'e-job1-s3-s4', source: 'job-1-stage-3', target: 'job-1-stage-4', type: 'addStageEdge' },
    ]
  },
  '2': {
    details: { id: '2', title: 'Product Manager', status: 'Active', applicants: 1, description: 'Lead the vision and roadmap for our core product.' },
    nodes: [
      { id: 'job-2', type: 'job', position: { x: 350, y: 0 }, data: { id: '2', title: 'Product Manager', status: 'Active', applicants: 1, description: 'Lead the vision and roadmap for our core product.' } },
      { id: 'job-2-stage-1', type: 'candidate', position: { x: 0, y: 250 }, data: { stage: 'APPLIED', candidateIds: ['cand-3'] } },
      { id: 'job-2-stage-2', type: 'candidate', position: { x: 400, y: 250 }, data: { stage: 'SCREENING', candidateIds: [] } },
      { id: 'job-2-stage-3', type: 'candidate', position: { x: 800, y: 250 }, data: { stage: 'INTERVIEW', candidateIds: [] } },
    ],
    edges: [
      { id: 'e-job2-s1', source: 'job-2', target: 'job-2-stage-1', type: 'smoothstep', style: { stroke: '#CBD5E1', strokeWidth: 2 } },
      { id: 'e-job2-s1-s2', source: 'job-2-stage-1', target: 'job-2-stage-2', type: 'addStageEdge' },
      { id: 'e-job2-s2-s3', source: 'job-2-stage-2', target: 'job-2-stage-3', type: 'addStageEdge' },
    ]
  },
  '3': {
    details: { id: '3', title: 'UX/UI Designer', status: 'Archived', applicants: 0, description: 'Design beautiful and intuitive user experiences.' },
    nodes: [
        { id: 'job-3', type: 'job', position: { x: 0, y: 0 }, data: { id: '3', title: 'UX/UI Designer', status: 'Archived', applicants: 0, description: 'Design beautiful and intuitive user experiences.' } },
    ],
    edges: []
  }
};

export const createNewJobData = (id, title, description) => {
  const jobDetails = { id, title, description, status: 'Active', applicants: 0 };
  return {
    details: jobDetails,
    nodes: [
      { id: `job-${id}`, type: 'job', position: { x: 350, y: 0 }, data: jobDetails },
      { id: `job-${id}-stage-1`, type: 'candidate', position: { x: 0, y: 250 }, data: { stage: 'APPLIED', candidateIds: [] } },
      { id: `job-${id}-stage-2`, type: 'candidate', position: { x: 400, y: 250 }, data: { stage: 'SCREENING', candidateIds: [] } },
      { id: `job-${id}-stage-3`, type: 'candidate', position: { x: 800, y: 250 }, data: { stage: 'INTERVIEW', candidateIds: [] } },
    ],
    edges: [
      { id: `e-job${id}-s1`, source: `job-${id}`, target: `job-${id}-stage-1`, type: 'smoothstep', style: { stroke: '#CBD5E1', strokeWidth: 2 } },
      { id: `e-job${id}-s1-s2`, source: `job-${id}-stage-1`, target: `job-${id}-stage-2`, type: 'addStageEdge' },
      { id: `e-job${id}-s2-s3`, source: `job-${id}-stage-2`, target: `job-${id}-stage-3`, type: 'addStageEdge' },
    ]
  };
};
