import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { AnimatePresence } from 'framer-motion';
import EmployerDashboard from '../components/EmployerDashboard';
import DashboardSidebar from '../components/DashboardSidebar';
import JobModal from '../components/JobModal';
import StageModal from '../components/StageModal';
import ResumeSidebar from '../components/ResumeSidebar';
import { initialJobsData, createNewJobData } from '../data/initialDashboardData';
import { Plus } from 'lucide-react';

const EmployerDashboardPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(initialJobsData);
  const [jobOrder, setJobOrder] = useState(Object.keys(initialJobsData));
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [stageEdge, setStageEdge] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [resumeSidebarOpen, setResumeSidebarOpen] = useState(false);
  const [activeResume, setActiveResume] = useState(null);

  const activeJob = jobs[jobId];

  useEffect(() => {
    if (!activeJob && jobOrder.length > 0) {
      navigate(`/dashboard/employer/${jobOrder[0]}`, { replace: true });
    }
  }, [jobId, jobs, activeJob, navigate, jobOrder]);

  const handleJobSelect = (id) => {
    navigate(`/dashboard/employer/${id}`);
  };

  const handleOpenJobModal = (jobDetails = null) => {
    setEditingJob(jobDetails);
    setIsJobModalOpen(true);
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      setJobs(prevJobs => ({
        ...prevJobs,
        [editingJob.id]: {
          ...prevJobs[editingJob.id],
          details: { ...prevJobs[editingJob.id].details, ...jobData },
          nodes: prevJobs[editingJob.id].nodes.map(n => n.id === `job-${editingJob.id}` ? { ...n, data: { ...n.data, ...jobData } } : n)
        }
      }));
    } else {
      const newJobId = Date.now().toString();
      const newJob = createNewJobData(newJobId, jobData.title, jobData.description);
      setJobs(prevJobs => ({ ...prevJobs, [newJobId]: newJob }));
      setJobOrder(prevOrder => [newJobId, ...prevOrder]);
      navigate(`/dashboard/employer/${newJobId}`);
    }
    handleCloseJobModal();
  };

  const handleArchiveJob = (id) => {
    setJobs(prevJobs => {
      const jobToUpdate = prevJobs[id];
      const newStatus = jobToUpdate.details.status === 'Active' ? 'Archived' : 'Active';
      const updatedDetails = { ...jobToUpdate.details, status: newStatus };
      return {
        ...prevJobs,
        [id]: {
          ...jobToUpdate,
          details: updatedDetails,
          nodes: jobToUpdate.nodes.map(n => n.id === `job-${id}` ? { ...n, data: { ...n.data, status: newStatus } } : n)
        }
      };
    });
  };

  const handleDeleteJob = (idToDelete) => {
    setJobs(prevJobs => {
      const newJobs = { ...prevJobs };
      delete newJobs[idToDelete];
      return newJobs;
    });
    setJobOrder(prevOrder => {
      const newOrder = prevOrder.filter(id => id !== idToDelete);
      if (jobId === idToDelete && newOrder.length > 0) {
        navigate(`/dashboard/employer/${newOrder[0]}`, { replace: true });
      } else if (newOrder.length === 0) {
        navigate('/dashboard/employer');
      }
      return newOrder;
    });
  };
  
  const handleReorderJobs = useCallback((newOrder) => {
    setJobOrder(newOrder);
  }, []);

  const onNodesChange = useCallback((changes) => {
    setJobs(prev => {
      const currentJob = prev[jobId];
      if (!currentJob) return prev;
      const updatedNodes = applyNodeChanges(changes, currentJob.nodes);
      return {
        ...prev,
        [jobId]: { ...currentJob, nodes: updatedNodes }
      };
    });
  }, [jobId]);

  const onEdgesChange = useCallback((changes) => {
    setJobs(prev => {
      const currentJob = prev[jobId];
      if (!currentJob) return prev;
      const updatedEdges = applyEdgeChanges(changes, currentJob.edges);
      return {
        ...prev,
        [jobId]: { ...currentJob, edges: updatedEdges }
      };
    });
  }, [jobId]);
  
  const handleCandidateMove = useCallback((sourceNodeId, candidateId, targetNodeId) => {
    setJobs(prevJobs => {
      const currentJobData = prevJobs[jobId];
      if (!currentJobData || sourceNodeId === targetNodeId) return prevJobs;
  
      const sourceNode = currentJobData.nodes.find(n => n.id === sourceNodeId);
      if (!sourceNode || !sourceNode.data.candidates) return prevJobs;
  
      const candidateToMove = sourceNode.data.candidates.find(c => c.id === candidateId);
      if (!candidateToMove) return prevJobs;
  
      let totalApplicants = 0;
      const newNodes = currentJobData.nodes.map(node => {
        let newNode = { ...node };
        if (node.id === sourceNodeId) {
          newNode.data = { ...node.data, candidates: node.data.candidates.filter(c => c.id !== candidateId) };
        }
        if (node.id === targetNodeId) {
          newNode.data = { ...node.data, candidates: [...(node.data.candidates || []), candidateToMove] };
        }
        if (newNode.type === 'candidate' && newNode.data.candidates) {
            totalApplicants += newNode.data.candidates.length;
        }
        return newNode;
      });

      const jobNodeIndex = newNodes.findIndex(n => n.type === 'job');
      if (jobNodeIndex > -1) {
        newNodes[jobNodeIndex] = { ...newNodes[jobNodeIndex], data: { ...newNodes[jobNodeIndex].data, applicants: totalApplicants } };
      }
      
      const updatedDetails = { ...currentJobData.details, applicants: totalApplicants };

      return { ...prevJobs, [jobId]: { ...currentJobData, details: updatedDetails, nodes: newNodes } };
    });
  }, [jobId]);

  const handleMoveToNextStage = useCallback((candidateId, currentStageId) => {
    const currentJobData = jobs[jobId];
    if (!currentJobData) return;
    const connectingEdge = currentJobData.edges.find(edge => edge.source === currentStageId);
    if (connectingEdge) {
      handleCandidateMove(currentStageId, candidateId, connectingEdge.target);
    }
  }, [jobId, jobs, handleCandidateMove]);

  const handleConnectStages = useCallback((params) => {
    setJobs(prevJobs => {
      const currentJobData = prevJobs[jobId];
      if (!currentJobData) return prevJobs;

      const newEdge = {
        id: `${params.source}-${params.target}`,
        ...params,
        type: 'addStageEdge'
      };

      if (currentJobData.edges.some(e => e.source === params.source && e.target === params.target)) {
        return prevJobs;
      }

      const updatedEdges = currentJobData.edges.concat(newEdge);
      return { ...prevJobs, [jobId]: { ...currentJobData, edges: updatedEdges } };
    });
  }, [jobId]);

  const handleSaveStage = useCallback(({ name, id }) => {
    if (id) { // Editing existing stage
      setJobs(prevJobs => {
        const currentJobData = prevJobs[jobId];
        const updatedNodes = currentJobData.nodes.map(n => 
          n.id === id ? { ...n, data: { ...n.data, stage: name } } : n
        );
        return { ...prevJobs, [jobId]: { ...currentJobData, nodes: updatedNodes } };
      });
    } else { // Adding new stage
      if (!stageEdge) return;
      const { source, target } = stageEdge;
      
      setJobs(prevJobs => {
        const currentJobData = prevJobs[jobId];
        const sourceNode = currentJobData.nodes.find(n => n.id === source);
        const xOffset = 320;

        const newNode = {
          id: `job-${jobId}-stage-${Date.now()}`,
          type: 'candidate',
          position: { x: sourceNode.position.x + xOffset, y: sourceNode.position.y },
          data: { stage: name, candidates: [] },
        };

        const updatedNodes = currentJobData.nodes
          .map(n => {
            if (n.position.x >= newNode.position.x) {
              return { ...n, position: { ...n.position, x: n.position.x + xOffset } };
            }
            return n;
          })
          .concat(newNode);

        const updatedEdges = currentJobData.edges
          .filter(e => e.id !== stageEdge.id)
          .concat([
            { id: `${source}-${newNode.id}`, source, target: newNode.id, type: 'addStageEdge' },
            { id: `${newNode.id}-${target}`, source: newNode.id, target, type: 'addStageEdge' },
          ]);
        
        return { ...prevJobs, [jobId]: { ...currentJobData, nodes: updatedNodes, edges: updatedEdges } };
      });
    }
    setIsStageModalOpen(false);
    setEditingStage(null);
    setStageEdge(null);
  }, [jobId, stageEdge]);

  const handleOpenAddStageModal = useCallback((edgeId) => {
    const edge = jobs[jobId]?.edges.find(e => e.id === edgeId);
    if (edge) {
      setStageEdge(edge);
      setEditingStage(null);
      setIsStageModalOpen(true);
    }
  }, [jobId, jobs]);

  const handleOpenEditStageModal = useCallback((stageId, stageName) => {
    setEditingStage({ id: stageId, name: stageName });
    setIsStageModalOpen(true);
  }, []);

  const handleDeleteStage = useCallback((stageId) => {
    setJobs(prevJobs => {
      const currentJobData = prevJobs[jobId];
      const stageToDelete = currentJobData.nodes.find(n => n.id === stageId);

      if (stageToDelete.data.candidates && stageToDelete.data.candidates.length > 0) {
        alert("Cannot delete a stage that contains candidates.");
        return prevJobs;
      }

      const incomingEdge = currentJobData.edges.find(e => e.target === stageId);
      const outgoingEdge = currentJobData.edges.find(e => e.source === stageId);

      const remainingNodes = currentJobData.nodes.filter(n => n.id !== stageId);
      let remainingEdges = currentJobData.edges.filter(e => e.source !== stageId && e.target !== stageId);

      if (incomingEdge && outgoingEdge) {
        remainingEdges.push({
          id: `${incomingEdge.source}-${outgoingEdge.target}`,
          source: incomingEdge.source,
          target: outgoingEdge.target,
          type: 'addStageEdge',
        });
      }
      
      return { ...prevJobs, [jobId]: { ...currentJobData, nodes: remainingNodes, edges: remainingEdges } };
    });
  }, [jobId]);

  const handleShowResume = (candidate) => {
    setActiveResume(candidate);
    setResumeSidebarOpen(true);
  };

  const handleCloseResume = () => {
    setResumeSidebarOpen(false);
  };

  if (jobOrder.length > 0 && !activeJob) {
    return <div className="h-screen w-screen bg-white flex items-center justify-center font-inter text-primary-500">Loading...</div>;
  }
  
  const orderedJobs = jobOrder.map(id => jobs[id]?.details).filter(Boolean);

  return (
    <div className="h-screen w-screen bg-gray-50 font-inter flex overflow-hidden">
      <DashboardSidebar
        jobs={orderedJobs}
        activeJobId={jobId}
        onJobSelect={handleJobSelect}
        onNewJob={() => handleOpenJobModal()}
        onEditJob={(job) => handleOpenJobModal(job)}
        onArchiveJob={handleArchiveJob}
        onDeleteJob={handleDeleteJob}
        onReorder={handleReorderJobs}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 h-full transition-all duration-300 ease-in-out" style={{ paddingLeft: isSidebarOpen ? '22rem' : '0rem' }}>
        <ReactFlowProvider>
          {activeJob ? (
            <EmployerDashboard
              key={jobId}
              job={activeJob}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onCandidateMove={handleCandidateMove}
              onConnectStages={handleConnectStages}
              onMoveToNextStage={handleMoveToNextStage}
              onEditJob={(jobData) => handleOpenJobModal(jobData)}
              onArchiveJob={handleArchiveJob}
              onShowResume={handleShowResume}
              onAddStage={handleOpenAddStageModal}
              onEditStage={handleOpenEditStageModal}
              onDeleteStage={handleDeleteStage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-3xl font-bold text-primary-500">No Jobs Available</h2>
                <p className="text-gray-500 mt-2">Create a new job to get started.</p>
                <button
                    onClick={() => handleOpenJobModal()}
                    className="mt-6 flex items-center justify-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-lg text-base font-inter font-semibold hover:bg-primary-400/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create New Job
                </button>
            </div>
          )}
        </ReactFlowProvider>
      </main>
      <JobModal isOpen={isJobModalOpen} onClose={handleCloseJobModal} onSave={handleSaveJob} job={editingJob} />
      <StageModal isOpen={isStageModalOpen} onClose={() => { setIsStageModalOpen(false); setEditingStage(null); }} onSave={handleSaveStage} stage={editingStage} />
      <AnimatePresence>
        {resumeSidebarOpen && <ResumeSidebar onClose={handleCloseResume} candidate={activeResume} />}
      </AnimatePresence>
    </div>
  );
};

export default EmployerDashboardPage;
