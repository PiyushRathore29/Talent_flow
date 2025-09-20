import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dbHelpers } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

// Helper function to reconstruct job flow from database stages
const reconstructJobFlow = async (job) => {
  try {
    console.log('🔄 Reconstructing flow for job:', job.id);
    
    // Use the saved flow data as the primary source of truth
    const savedNodes = job.flowData?.nodes || [];
    const savedEdges = job.flowData?.edges || [];
    
    console.log('📊 Saved flow data - nodes:', savedNodes.length, 'edges:', savedEdges.length);
    
    // If we have saved flow data, use it directly
    if (savedNodes.length > 0) {
      console.log('✅ Using saved flow data directly');
      console.log('🔍 Saved nodes details:', savedNodes.map(n => ({ id: n.id, type: n.type, position: n.position, stage: n.data?.stage })));
      console.log('🔍 Saved edges details:', savedEdges.map(e => ({ id: e.id, source: e.source, target: e.target, type: e.type })));
      return {
        nodes: savedNodes,
        edges: savedEdges
      };
    }
    
    // Fallback: No saved flow data, reconstruct from database stages
    console.log('🔄 No saved flow data, reconstructing from database stages...');
    
    const stages = await dbHelpers.getJobStages(job.id);
    console.log('📋 Found stages in database:', stages);
    
    if (stages.length === 0) {
      // No stages at all, return empty flow
      console.log('⚠️ No stages found anywhere, returning empty flow');
      return { nodes: [], edges: [] };
    }
    
    // Reconstruct from database stages
    const stageNodes = stages.map(stage => ({
      id: stage.nodeId,
      type: stage.type,
      position: JSON.parse(stage.position),
      data: {
        stage: stage.name,
        candidates: [],
        assessment: stage.type === 'assessment' ? null : undefined
      }
    }));
    
    // Add job node if not present
    const jobNode = {
      id: `job-${job.id}`,
      type: 'job',
      position: { x: 350, y: 0 },
      data: {
        id: job.id.toString(),
        title: job.title,
        status: job.status || 'Active',
        applicants: 0,
        description: job.description || ''
      }
    };
    
    const allNodes = [jobNode, ...stageNodes];
    
    // Reconstruct edges between stages (basic linear flow)
    const edges = [];
    if (stageNodes.length > 0) {
      // Job to first stage
      edges.push({
        id: `e-${jobNode.id}-${stageNodes[0].id}`,
        source: jobNode.id,
        target: stageNodes[0].id,
        type: 'smoothstep',
        style: { stroke: '#CBD5E1', strokeWidth: 2 }
      });
      
      // Between stages
      for (let i = 0; i < stageNodes.length - 1; i++) {
        edges.push({
          id: `e-${stageNodes[i].id}-${stageNodes[i + 1].id}`,
          source: stageNodes[i].id,
          target: stageNodes[i + 1].id,
          type: 'addStageEdge'
        });
      }
    }
    
    console.log('✅ Reconstructed from database - nodes:', allNodes.length, 'edges:', edges.length);
    return { nodes: allNodes, edges };
    
  } catch (error) {
    console.error('❌ Failed to reconstruct job flow:', error);
    return { nodes: [], edges: [] };
  }
};

export const JobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState({});
  const [jobOrder, setJobOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load jobs for the current user's company
  useEffect(() => {
    const loadJobs = async () => {
      if (!user) {
        setJobs({});
        setJobOrder([]);
        setLoading(false);
        return;
      }

      try {
        let jobsList = [];
        
        if (user.role === 'hr' && user.companyId) {
          // HR users see jobs from their company
          jobsList = await dbHelpers.getJobsByCompany(user.companyId);
        } else if (user.role === 'candidate') {
          // Candidates see all jobs from all companies
          jobsList = await dbHelpers.getAllJobs();
        }

        // Convert array to object with id as key and set order
        const jobsObj = {};
        const orderArray = [];
        
        for (const job of jobsList) {
          // Reconstruct flow from database stages
          const { nodes, edges } = await reconstructJobFlow(job);
          
          jobsObj[job.id] = {
            ...job,
            // Use reconstructed flow data
            nodes: nodes,
            edges: edges,
            details: {
              id: job.id,
              title: job.title,
              description: job.description,
              location: job.location,
              salary: job.salary,
              type: job.type,
              status: job.status,
              applicants: job.applicants || 0,
              postedDate: job.postedDate,
              companyName: job.companyName,
              companyId: job.companyId
            }
          };
          orderArray.push(job.id.toString());
        }

        // Load candidates for each job and populate stage nodes
        for (const jobId of Object.keys(jobsObj)) {
          try {
            console.log(`🔄 Processing job ${jobId} - nodes before candidate loading:`, jobsObj[jobId].nodes.length);
            console.log(`🔍 Nodes in job ${jobId}:`, jobsObj[jobId].nodes.map(n => ({ id: n.id, type: n.type, stage: n.data?.stage })));
            
            const candidates = await dbHelpers.getCandidatesByJob(parseInt(jobId));
            
            // Load assessments for this job
            const assessments = await dbHelpers.getAssessmentsByJob(parseInt(jobId));
            console.log(`📊 Found ${assessments.length} assessments for job ${jobId}`);
            
            // Update nodes with candidate data and assessment data
            if (jobsObj[jobId].nodes && jobsObj[jobId].nodes.length > 0) {
              console.log(`🔄 Starting node processing for job ${jobId}...`);
              jobsObj[jobId].nodes = await Promise.all(jobsObj[jobId].nodes.map(async (node, index) => {
                console.log(`📍 Processing node ${index}: ${node.id} (type: ${node.type})`);
                
                if (node.type === 'candidate') {
                  // Find candidates for this stage
                  const stageCandidates = candidates.filter(candidate => 
                    candidate.currentStageId === node.id
                  );
                  console.log(`👥 Found ${stageCandidates.length} candidates for stage ${node.id}`);
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      candidates: stageCandidates
                    }
                  };
                }
                if (node.type === 'assessment') {
                  console.log(`🎯 Processing assessment node: ${node.id}`);
                  // Find candidates for this stage
                  const stageCandidates = candidates.filter(candidate => 
                    candidate.currentStageId === node.id
                  );
                  console.log(`👥 Found ${stageCandidates.length} candidates for assessment stage ${node.id}`);
                  
                  // Find assessment for this stage
                  const stageAssessment = assessments.find(assessment => 
                    assessment.stageId === node.id
                  );
                  console.log(`📝 Found assessment for stage ${node.id}:`, stageAssessment ? stageAssessment.title : 'NONE');
                  
                  // If assessment exists, load its questions
                  let assessmentWithQuestions = stageAssessment;
                  if (stageAssessment) {
                    try {
                      const questions = await dbHelpers.getQuestionsByAssessment(stageAssessment.id);
                      assessmentWithQuestions = { ...stageAssessment, questions };
                      console.log(`❓ Loaded ${questions.length} questions for assessment ${stageAssessment.id}`);
                    } catch (error) {
                      console.error(`Failed to load questions for assessment ${stageAssessment.id}:`, error);
                    }
                  }
                  
                  const processedNode = {
                    ...node,
                    data: {
                      ...node.data,
                      candidates: stageCandidates,
                      assessment: assessmentWithQuestions || null
                    }
                  };
                  console.log(`✅ Processed assessment node ${node.id}:`, processedNode);
                  return processedNode;
                }
                console.log(`🔄 Processing regular node: ${node.id} (type: ${node.type})`);
                return node;
              }));
              
              console.log(`✅ Finished processing job ${jobId} - nodes after processing:`, jobsObj[jobId].nodes.length);
              console.log(`🔍 Final nodes for job ${jobId}:`, jobsObj[jobId].nodes.map(n => ({ id: n.id, type: n.type, stage: n.data?.stage })));
              
              // Update total applicants count
              const totalApplicants = candidates.length;
              jobsObj[jobId].nodes = jobsObj[jobId].nodes.map(node => {
                if (node.type === 'job') {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      applicants: totalApplicants
                    }
                  };
                }
                return node;
              });
              
              // Update details
              jobsObj[jobId].details.applicants = totalApplicants;
            }
          } catch (error) {
            console.error(`Failed to load candidates for job ${jobId}:`, error);
          }
        }

        setJobs(jobsObj);
        setJobOrder(orderArray);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setJobs({});
        setJobOrder([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user]);

  const createJob = useCallback(async (jobData) => {
    try {
      if (!user?.companyId && user?.role === 'hr') {
        throw new Error('HR user must be associated with a company');
      }

      const newJobData = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location || '',
        salary: jobData.salary || '',
        type: jobData.type || 'Full-time',
        responsibilities: jobData.responsibilities || '',
        qualifications: jobData.qualifications || '',
        status: 'Active',
        companyId: user.companyId,
        companyName: user.companyName || '',
        createdBy: user.id,
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        flowData: {
          nodes: [],
          edges: []
        }
      };

      const jobId = await dbHelpers.createJob(newJobData);
      
      // Create initial flow structure
      const initialNodes = [
        {
          id: `job-${jobId}`,
          type: 'job',
          position: { x: 150, y: 50 },
          data: {
            ...newJobData,
            id: jobId
          }
        },
        {
          id: `job-${jobId}-stage-applied`,
          type: 'candidate',
          position: { x: 150, y: 200 },
          data: {
            stage: 'Applied',
            candidates: []
          }
        },
        {
          id: `job-${jobId}-stage-screening`,
          type: 'candidate',
          position: { x: 470, y: 200 },
          data: {
            stage: 'Screening',
            candidates: []
          }
        },
        {
          id: `job-${jobId}-stage-interview`,
          type: 'candidate',
          position: { x: 790, y: 200 },
          data: {
            stage: 'Interview',
            candidates: []
          }
        },
        {
          id: `job-${jobId}-stage-offer`,
          type: 'candidate',
          position: { x: 1110, y: 200 },
          data: {
            stage: 'Offer',
            candidates: []
          }
        },
        {
          id: `job-${jobId}-stage-hired`,
          type: 'candidate',
          position: { x: 1430, y: 200 },
          data: {
            stage: 'Hired',
            candidates: []
          }
        }
      ];

      const initialEdges = [
        {
          id: `job-${jobId}-applied-screening`,
          source: `job-${jobId}-stage-applied`,
          target: `job-${jobId}-stage-screening`,
          type: 'addStageEdge'
        },
        {
          id: `job-${jobId}-screening-interview`,
          source: `job-${jobId}-stage-screening`,
          target: `job-${jobId}-stage-interview`,
          type: 'addStageEdge'
        },
        {
          id: `job-${jobId}-interview-offer`,
          source: `job-${jobId}-stage-interview`,
          target: `job-${jobId}-stage-offer`,
          type: 'addStageEdge'
        },
        {
          id: `job-${jobId}-offer-hired`,
          source: `job-${jobId}-stage-offer`,
          target: `job-${jobId}-stage-hired`,
          type: 'addStageEdge'
        }
      ];

      // Update job with flow data
      await dbHelpers.updateJob(jobId, {
        flowData: {
          nodes: initialNodes,
          edges: initialEdges
        }
      });

      const createdJob = {
        id: jobId,
        ...newJobData,
        nodes: initialNodes,
        edges: initialEdges,
        details: {
          id: jobId,
          ...newJobData
        }
      };
      
      setJobs(prev => ({
        ...prev,
        [jobId]: createdJob
      }));
      
      setJobOrder(prev => [jobId.toString(), ...prev]);
      
      return createdJob;
    } catch (error) {
      console.error('Failed to create job:', error);
      throw error;
    }
  }, [user]);

  const updateJob = useCallback(async (jobId, updates) => {
    try {
      await dbHelpers.updateJob(jobId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      setJobs(prev => {
        const job = prev[jobId];
        if (!job) return prev;
        
        return {
          ...prev,
          [jobId]: {
            ...job,
            ...updates,
            details: {
              ...job.details,
              ...updates
            }
          }
        };
      });
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  }, []);

  const updateJobFlow = useCallback(async (jobId, flowData) => {
    try {
      await dbHelpers.updateJob(jobId, {
        flowData,
        updatedAt: new Date().toISOString()
      });
      
      setJobs(prev => {
        const job = prev[jobId];
        if (!job) return prev;
        
        return {
          ...prev,
          [jobId]: {
            ...job,
            nodes: flowData.nodes || job.nodes,
            edges: flowData.edges || job.edges
          }
        };
      });
    } catch (error) {
      console.error('Failed to update job flow:', error);
    }
  }, []);

  const deleteJob = useCallback(async (jobId) => {
    try {
      await dbHelpers.deleteJob(jobId);
      
      setJobs(prev => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });
      
      setJobOrder(prev => prev.filter(id => id !== jobId.toString()));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  }, []);

  const reorderJobs = useCallback((newOrder) => {
    setJobOrder(newOrder);
  }, []);

  const value = {
    jobs,
    jobOrder,
    loading,
    createJob,
    updateJob,
    updateJobFlow,
    deleteJob,
    reorderJobs
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};