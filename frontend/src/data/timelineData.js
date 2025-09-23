// Timeline data for tracking candidate activities
export const timelineData = [
  {
    id: 1,
    candidateId: 1,
    candidateName: "Jennifer Thompson",
    action: "created",
    actionType: "candidate_created",
    description: "New candidate Jennifer Thompson created",
    fromStage: null,
    toStage: "applied",
    timestamp: "2024-01-15T10:30:00Z",
    hrUserId: 1,
    hrUserName: "Admin User",
    metadata: {
      jobId: 1,
      jobTitle: "Senior Frontend Developer"
    }
  },
  {
    id: 2,
    candidateId: 1,
    candidateName: "Jennifer Thompson",
    action: "stage_changed",
    actionType: "stage_progression",
    description: "Moved to Screening stage",
    fromStage: "applied",
    toStage: "screen",
    timestamp: "2024-01-16T14:20:00Z",
    hrUserId: 1,
    hrUserName: "Admin User",
    metadata: {}
  },
  {
    id: 3,
    candidateId: 2,
    candidateName: "Michael Johnson",
    action: "created",
    actionType: "candidate_created",
    description: "New candidate Michael Johnson created",
    fromStage: null,
    toStage: "applied",
    timestamp: "2024-01-17T09:15:00Z",
    hrUserId: 1,
    hrUserName: "Admin User",
    metadata: {
      jobId: 2,
      jobTitle: "Backend Developer"
    }
  },
  {
    id: 4,
    candidateId: 1,
    candidateName: "Jennifer Thompson",
    action: "stage_changed",
    actionType: "stage_progression",
    description: "Moved to Technical stage",
    fromStage: "screen",
    toStage: "tech",
    timestamp: "2024-01-18T11:45:00Z",
    hrUserId: 1,
    hrUserName: "Admin User",
    metadata: {}
  },
  {
    id: 5,
    candidateId: 3,
    candidateName: "Sarah Wilson",
    action: "created",
    actionType: "candidate_created",
    description: "New candidate Sarah Wilson created",
    fromStage: null,
    toStage: "applied",
    timestamp: "2024-01-19T16:30:00Z",
    hrUserId: 1,
    hrUserName: "Admin User",
    metadata: {
      jobId: 1,
      jobTitle: "Senior Frontend Developer"
    }
  }
];

// Generate more timeline entries dynamically
let nextId = 6;

export const addTimelineEntry = (entry) => {
  const newEntry = {
    id: nextId++,
    timestamp: new Date().toISOString(),
    hrUserId: 1, // Default to admin user for now
    hrUserName: "Admin User",
    ...entry
  };
  
  timelineData.unshift(newEntry); // Add to beginning for chronological order
  return newEntry;
};

export const getTimelineEntries = (candidateId = null, limit = null) => {
  let filteredData = candidateId 
    ? timelineData.filter(entry => entry.candidateId === candidateId)
    : timelineData;
  
  // Sort by timestamp descending (newest first)
  filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return limit ? filteredData.slice(0, limit) : filteredData;
};

export const getTimelineStats = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayEntries = timelineData.filter(entry => 
    new Date(entry.timestamp) >= today
  );
  
  const weekEntries = timelineData.filter(entry => 
    new Date(entry.timestamp) >= thisWeek
  );
  
  const monthEntries = timelineData.filter(entry => 
    new Date(entry.timestamp) >= thisMonth
  );

  return {
    today: todayEntries.length,
    thisWeek: weekEntries.length,
    thisMonth: monthEntries.length,
    total: timelineData.length
  };
};