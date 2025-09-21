import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import existing flow components
import JobNode from '../components/flow/JobNode';
import CandidateNode from '../components/flow/CandidateNode';
import AssessmentNode from '../components/flow/AssessmentNode';
import StageTitleNode from '../components/flow/StageTitleNode';

// Custom node types
const nodeTypes = {
  jobNode: JobNode,
  candidateNode: CandidateNode,
  assessmentNode: AssessmentNode,
  stageTitleNode: StageTitleNode,
};

const JobFlowPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Custom node change handler that persists job reordering
  const handleNodesChange = useCallback(async (changes) => {
    // Apply the changes to React Flow first
    onNodesChange(changes);
    
    // Check if any job nodes were moved (position changes)
    const jobMoves = changes.filter(change => 
      change.type === 'position' && 
      change.dragging === false && // Only when drag ends
      nodes.find(node => node.id === change.id && node.type === 'jobNode')
    );
    
    // Check if any candidate nodes were moved between stages
    const candidateMoves = changes.filter(change => 
      change.type === 'position' && 
      change.dragging === false && // Only when drag ends
      nodes.find(node => node.id === change.id && node.type === 'candidateNode')
    );
    
    if (jobMoves.length > 0) {
      // For each moved job, update its order in the database
      for (const move of jobMoves) {
        const jobNode = nodes.find(n => n.id === move.id);
        if (jobNode && jobNode.data?.job) {
          await updateJobOrder(jobNode.data.job, move.position);
        }
      }
    }
    
    if (candidateMoves.length > 0) {
      // For each moved candidate node, determine new stage and update candidates
      for (const move of candidateMoves) {
        await handleCandidateStageMove(move.id, move.position);
      }
    }
  }, [nodes, onNodesChange]);

  // Helper function to handle candidate stage changes based on position
  const handleCandidateStageMove = async (nodeId, newPosition) => {
    try {
      // Find which stage this candidate node is closest to based on Y position
      const stageNodes = nodes.filter(node => node.type === 'stageTitleNode');
      
      let closestStage = null;
      let minDistance = Infinity;
      
      stageNodes.forEach(stageNode => {
        const distance = Math.abs(stageNode.position.y - newPosition.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestStage = stageNode.data?.stage;
        }
      });
      
      if (closestStage) {
        const candidateNode = nodes.find(n => n.id === nodeId);
        if (candidateNode && candidateNode.data?.candidates) {
          // Update all candidates in this node to the new stage
          for (const candidate of candidateNode.data.candidates) {
            if (candidate.stage !== closestStage.id) {
              console.log(`🔄 [Flow] Moving candidate ${candidate.id} to stage ${closestStage.id}`);
              await handleStageChange(candidate.id, closestStage.id);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ [Flow] Failed to move candidate between stages:', error);
    }
  };

  // Helper function to update job order based on position
  const updateJobOrder = async (job, newPosition) => {
    try {
      // Calculate new order based on Y position (vertical arrangement)
      // Jobs higher up (lower Y) should have lower order numbers
      const newOrder = Math.max(1, Math.floor(newPosition.y / 100));
      
      if (job.order !== newOrder) {
        console.log(`🔄 [Flow] Updating job ${job.id} order from ${job.order} to ${newOrder}`);
        
        const response = await fetch(`/api/jobs/${job.id}/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fromOrder: job.order, 
            toOrder: newOrder 
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update job order');
        }
        
        // Refresh jobs data to reflect changes
        await fetchAllJobs();
        console.log('✅ [Flow] Job order updated successfully');
      }
    } catch (error) {
      console.error('❌ [Flow] Failed to update job order:', error);
      // Optionally show user notification
    }
  };

  // Pipeline stages
  const stages = [
    { id: 'applied', name: 'Applied', color: '#3B82F6' },
    { id: 'screen', name: 'Screening', color: '#EAB308' },
    { id: 'tech', name: 'Technical', color: '#8B5CF6' },
    { id: 'offer', name: 'Offer', color: '#F97316' },
    { id: 'hired', name: 'Hired', color: '#10B981' },
    { id: 'rejected', name: 'Rejected', color: '#EF4444' }
  ];

  // Fetch all jobs for sidebar
  const fetchAllJobs = async () => {
    try {
      const response = await fetch('/api/jobs?pageSize=100');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setAllJobs(data.data || []);
    } catch (err) {
      console.error('Failed to fetch all jobs:', err);
    }
  };

  // Fetch current job details
  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      const jobData = await response.json();
      setJob(jobData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch job:', err);
    }
  };

  // Fetch candidates for this job
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`/api/candidates?jobId=${jobId}&pageSize=100`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      setCandidates(data.data || []);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAllJobs(),
        fetchJob(),
        fetchCandidates()
      ]);
      setLoading(false);
    };

    if (jobId) {
      initializeData();
    }
  }, [jobId]);

  // Initialize flow nodes and edges
  useEffect(() => {
    if (!job || candidates.length === undefined) return;

    const initialNodes = [];
    const initialEdges = [];

    // Job node at the top
    initialNodes.push({
      id: 'job-1',
      type: 'jobNode',
      position: { x: 400, y: 50 },
      data: {
        ...job,
        onEdit: handleEditJob,
        onArchive: handleArchiveJob,
      },
    });

    // Stage title nodes and candidate nodes
    stages.forEach((stage, stageIndex) => {
      const stageY = 300 + stageIndex * 300;
      const stageCandidates = candidates.filter(c => c.stage === stage.id);

      // Stage title node
      initialNodes.push({
        id: `stage-title-${stage.id}`,
        type: 'stageTitleNode',
        position: { x: 50, y: stageY - 50 },
        data: {
          title: `${stage.name} (${stageCandidates.length})`,
        },
      });

      // Candidate stage node
      initialNodes.push({
        id: `stage-${stage.id}`,
        type: 'candidateNode',
        position: { x: 400, y: stageY },
        data: {
          stage: stage.id,
          stageName: stage.name,
          candidates: stageCandidates,
          onShowResume: handleShowResume,
          onMoveToNext: handleMoveToNext,
          onEditStage: () => handleEditStage(stage.id),
          onDeleteStage: () => handleDeleteStage(stage.id),
        },
      });

      // Connect job to first stage
      if (stageIndex === 0) {
        initialEdges.push({
          id: 'job-to-first-stage',
          source: 'job-1',
          target: `stage-${stage.id}`,
          type: 'smoothstep',
        });
      }

      // Connect stages to each other
      if (stageIndex > 0) {
        const prevStage = stages[stageIndex - 1];
        initialEdges.push({
          id: `stage-${prevStage.id}-to-${stage.id}`,
          source: `stage-${prevStage.id}`,
          target: `stage-${stage.id}`,
          type: 'smoothstep',
        });
      }
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [job, candidates]);

  // Event handlers
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleEditJob = () => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleArchiveJob = async () => {
    if (confirm('Are you sure you want to archive this job?')) {
      try {
        await fetch(`/api/jobs/${jobId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'archived' })
        });
        navigate('/jobs');
      } catch (err) {
        alert('Failed to archive job');
      }
    }
  };

  const handleShowResume = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleMoveToNext = async (candidateId, currentStage) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      await handleStageChange(candidateId, nextStage.id);
    }
  };

  const handleStageChange = async (candidateId, newStage) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });

      if (!response.ok) throw new Error('Failed to update candidate');
      
      // Refresh candidates
      await fetchCandidates();
    } catch (err) {
      alert('Failed to update candidate stage: ' + err.message);
    }
  };

  const handleAddCandidate = () => {
    setShowAddCandidate(true);
  };

  const handleSaveCandidate = async (candidateData) => {
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...candidateData,
          jobId: parseInt(jobId),
          stage: 'applied'
        })
      });

      if (!response.ok) throw new Error('Failed to create candidate');
      
      await fetchCandidates();
      setShowAddCandidate(false);
    } catch (err) {
      alert('Failed to create candidate: ' + err.message);
    }
  };

  const handleSimulateFlow = () => {
    alert('Simulation feature coming soon! This will demonstrate candidate movement through the pipeline.');
  };

  const handleEditStage = (stageId) => {
    alert(`Edit stage: ${stageId} - Feature coming soon!`);
  };

  const handleDeleteStage = (stageId) => {
    alert(`Delete stage: ${stageId} - Feature coming soon!`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Job Flow</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/jobs"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Jobs Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900">All Jobs</h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>
        
        {!sidebarCollapsed && (
          <div className="p-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
            {allJobs.map(jobItem => (
              <div
                key={jobItem.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  jobItem.id.toString() === jobId 
                    ? 'bg-blue-50 border-blue-200 text-blue-900' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => navigate(`/jobs/${jobItem.id}/flow`)}
              >
                <div className="font-medium text-sm">{jobItem.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {jobItem.status} • {jobItem.location}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Created {new Date(jobItem.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {job?.title || 'Job'} - Pipeline Flow
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Visual pipeline management • {candidates.length} candidates total
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/jobs"
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← Back to Jobs
                </Link>
                <Link
                  to={`/jobs/${jobId}`}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Job Details
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* React Flow Container */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            className="bg-gray-50"
          >
            <Background variant="dots" gap={20} size={1} />
            <Controls />
            <MiniMap />
            
            {/* Control Panel */}
            <Panel position="top-right" className="bg-white rounded-lg shadow-lg border p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Pipeline Controls</h3>
              
              <div className="space-y-2">
                <button
                  onClick={handleAddCandidate}
                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Candidate
                </button>
                
                <button
                  onClick={handleSimulateFlow}
                  className="w-full px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Simulate Flow
                </button>
                
                <Link
                  to={`/assessments/${jobId}`}
                  className="block w-full px-3 py-2 text-xs font-medium text-center text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Manage Assessment
                </Link>
              </div>
              
              {/* Pipeline Stats */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Pipeline Stats</h4>
                <div className="space-y-1">
                  {stages.map(stage => {
                    const count = candidates.filter(c => c.stage === stage.id).length;
                    return (
                      <div key={stage.id} className="flex justify-between text-xs">
                        <span className="text-gray-600">{stage.name}:</span>
                        <span className="font-medium" style={{ color: stage.color }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Resume Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedCandidate.name} - Resume
                  </h2>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Information</h3>
                    <p className="text-sm text-gray-600">{selectedCandidate.email}</p>
                    {selectedCandidate.phone && (
                      <p className="text-sm text-gray-600">{selectedCandidate.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Current Stage</h3>
                    <p className="text-sm text-gray-600">
                      {stages.find(s => s.id === selectedCandidate.stage)?.name || selectedCandidate.stage}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Applied Job</h3>
                    <p className="text-sm text-gray-600">
                      {job?.title || 'Unknown Job'}
                    </p>
                  </div>
                  
                  {selectedCandidate.resume && (
                    <div>
                      <h3 className="font-medium text-gray-900">Resume/Notes</h3>
                      <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedCandidate.resume}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Candidate Modal */}
        {showAddCandidate && (
          <AddCandidateModal 
            onClose={() => setShowAddCandidate(false)}
            onSave={handleSaveCandidate}
          />
        )}
      </div>
    </div>
  );
};

// Add Candidate Modal Component
const AddCandidateModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Candidate</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/Notes
            </label>
            <textarea
              value={formData.resume}
              onChange={(e) => setFormData({...formData, resume: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Brief resume summary or notes..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFlowPage;