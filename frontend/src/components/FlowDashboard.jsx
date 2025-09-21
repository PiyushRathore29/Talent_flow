import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, BarChart3 } from 'lucide-react';

import JobNode from '../components/flow/JobNode';
import CandidateNode from '../components/flow/CandidateNode';
import StageTitleNode from '../components/flow/StageTitleNode';
import AssessmentNode from '../components/flow/AssessmentNode';
import AddStageEdge from '../components/flow/AddStageEdge';
import AuthenticatedHeader from '../components/AuthenticatedHeader';
import StageModal from '../components/StageModal';
import JobModal from '../components/JobModal';
import AssessmentModal from '../components/AssessmentModal';
import ResumeSidebar from '../components/ResumeSidebar';

const nodeTypes = {
  job: JobNode,
  candidate: CandidateNode,
  stageTitle: StageTitleNode,
  assessment: AssessmentNode
};

const edgeTypes = {
  addStage: AddStageEdge
};

const FlowDashboard = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [job, setJob] = useState(null);
  const [stages, setStages] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showStageModal, setShowStageModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showResumeSidebar, setShowResumeSidebar] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editingStage, setEditingStage] = useState(null);

  // Custom nodes change handler for database persistence
  const handleNodesChange = useCallback(async (changes) => {
    // Handle job reordering
    const positionChanges = changes.filter(change => 
      change.type === 'position' && change.dragging === false
    );
    
    for (const change of positionChanges) {
      const node = nodes.find(n => n.id === change.id);
      if (node?.type === 'job') {
        try {
          await fetch(`/api/jobs/${node.data.job.id}/reorder`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              position: { x: change.position.x, y: change.position.y } 
            })
          });
        } catch (error) {
          console.error('Failed to update job position:', error);
        }
      }
    }

    // Apply all changes to nodes
    onNodesChange(changes);
  }, [nodes, onNodesChange]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (jobId) {
      fetchJobFlow();
    }
  }, [jobId]);

  const fetchJobFlow = async () => {
    try {
      setLoading(true);
      const [jobResponse, candidatesResponse, assessmentsResponse] = await Promise.all([
        fetch(`/api/jobs/${jobId}`),
        fetch('/api/candidates'),
        fetch('/api/assessments')
      ]);

      if (!jobResponse.ok) {
        throw new Error('Job not found');
      }

      const jobData = await jobResponse.json();
      const candidatesData = await candidatesResponse.json();
      const assessmentsData = await assessmentsResponse.json();

      setJob(jobData);
      const jobCandidates = candidatesData.filter(c => c.jobId === parseInt(jobId));
      setCandidates(jobCandidates);
      setAssessments(assessmentsData);

      // Create stages with candidates
      const stagesWithCandidates = jobData.stages.map(stage => ({
        ...stage,
        candidates: jobCandidates.filter(c => c.stage === stage.id)
      }));
      setStages(stagesWithCandidates);

      // Generate nodes and edges
      generateNodesAndEdges(jobData, stagesWithCandidates, assessmentsData);
    } catch (error) {
      console.error('Error fetching job flow:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateNodesAndEdges = (jobData, stagesData, assessmentsData) => {
    const newNodes = [];
    const newEdges = [];

    // Job node
    newNodes.push({
      id: `job-${jobData.id}`,
      type: 'job',
      position: jobData.position || { x: 100, y: 50 },
      data: { 
        job: jobData,
        onEdit: () => setShowJobModal(true)
      }
    });

    // Stage nodes
    stagesData.forEach((stage, index) => {
      const stageY = 200 + (index * 400);
      
      // Stage title
      newNodes.push({
        id: `stage-title-${stage.id}`,
        type: 'stageTitle',
        position: { x: 50, y: stageY },
        data: { 
          stage: stage.name,
          onEdit: () => {
            setEditingStage(stage);
            setShowStageModal(true);
          },
          onDelete: () => handleDeleteStage(stage.id)
        }
      });

      // Candidate node
      newNodes.push({
        id: `candidates-${stage.id}`,
        type: 'candidate',
        position: { x: 300, y: stageY },
        data: { 
          stage: stage.id,
          stageName: stage.name,
          candidates: stage.candidates || [],
          onShowResume: handleShowResume,
          onMoveToNext: handleMoveToNext,
          onEditStage: () => {
            setEditingStage(stage);
            setShowStageModal(true);
          },
          onDeleteStage: () => handleDeleteStage(stage.id)
        }
      });

      // Connect job to first stage
      if (index === 0) {
        newEdges.push({
          id: `job-to-stage-${stage.id}`,
          source: `job-${jobData.id}`,
          target: `candidates-${stage.id}`,
          type: 'smoothstep'
        });
      }

      // Connect stages
      if (index > 0) {
        newEdges.push({
          id: `stage-${stagesData[index - 1].id}-to-${stage.id}`,
          source: `candidates-${stagesData[index - 1].id}`,
          target: `candidates-${stage.id}`,
          type: 'smoothstep'
        });
      }
    });

    // Assessment nodes
    assessmentsData.forEach((assessment, index) => {
      newNodes.push({
        id: `assessment-${assessment.id}`,
        type: 'assessment',
        position: { x: 800, y: 200 + (index * 150) },
        data: { 
          assessment,
          onEdit: () => setShowAssessmentModal(true)
        }
      });
    });

    // Add stage edge (for adding new stages)
    if (stagesData.length > 0) {
      const lastStage = stagesData[stagesData.length - 1];
      newEdges.push({
        id: 'add-stage-edge',
        source: `candidates-${lastStage.id}`,
        target: 'add-stage-target',
        type: 'addStage',
        data: { onAddStage: handleAddStage }
      });

      // Invisible target node for add stage edge
      newNodes.push({
        id: 'add-stage-target',
        type: 'default',
        position: { x: 300, y: 200 + (stagesData.length * 400) },
        style: { opacity: 0, pointerEvents: 'none' },
        data: {}
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleShowResume = (candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeSidebar(true);
  };

  const handleMoveToNext = async (candidateId, currentStage) => {
    try {
      const currentStageIndex = stages.findIndex(s => s.id === currentStage);
      if (currentStageIndex < stages.length - 1) {
        const nextStage = stages[currentStageIndex + 1];
        
        await fetch(`/api/candidates/${candidateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: nextStage.id })
        });

        // Refresh the flow
        fetchJobFlow();
      }
    } catch (error) {
      console.error('Error moving candidate:', error);
    }
  };

  const handleAddStage = () => {
    setEditingStage(null);
    setShowStageModal(true);
  };

  const handleDeleteStage = async (stageId) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      try {
        await fetch(`/api/jobs/${jobId}/stages/${stageId}`, {
          method: 'DELETE'
        });
        fetchJobFlow();
      } catch (error) {
        console.error('Error deleting stage:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading job flow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <AuthenticatedHeader />
      
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          className="bg-gray-50"
        >
          <Panel position="top-left" className="flex space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </button>
          </Panel>
          
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Modals */}
      {showStageModal && (
        <StageModal
          stage={editingStage}
          jobId={jobId}
          onClose={() => {
            setShowStageModal(false);
            setEditingStage(null);
          }}
          onSave={() => {
            setShowStageModal(false);
            setEditingStage(null);
            fetchJobFlow();
          }}
        />
      )}

      {showJobModal && (
        <JobModal
          job={job}
          onClose={() => setShowJobModal(false)}
          onSave={() => {
            setShowJobModal(false);
            fetchJobFlow();
          }}
        />
      )}

      {showAssessmentModal && (
        <AssessmentModal
          onClose={() => setShowAssessmentModal(false)}
          onSave={() => {
            setShowAssessmentModal(false);
            fetchJobFlow();
          }}
        />
      )}

      {showResumeSidebar && selectedCandidate && (
        <ResumeSidebar
          candidate={selectedCandidate}
          onClose={() => {
            setShowResumeSidebar(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

export default FlowDashboard;