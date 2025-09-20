import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls as FlowControls,
} from '@xyflow/react';
import JobNode from './flow/JobNode';
import CandidateNode from './flow/CandidateNode';
import AssessmentNode from './flow/AssessmentNode';
import AddStageEdge from './flow/AddStageEdge';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  job: JobNode,
  candidate: CandidateNode,
  assessment: AssessmentNode,
};

const edgeTypes = {
  addStageEdge: AddStageEdge,
};

const EmployerDashboard = ({ job, onNodesChange, onEdgesChange, onCandidateMove, onConnectStages, onMoveToNextStage, onEditJob, onArchiveJob, onShowResume, onAddStage, onEditStage, onDeleteStage, onCreateAssessment, onEditAssessment, onViewResponses }) => {
  const onConnect = useCallback((params) => {
    const { source, target, sourceHandle } = params;
    if (sourceHandle) {
      onCandidateMove(source, sourceHandle, target);
    } else if (onConnectStages) {
      onConnectStages(params);
    }
  }, [onCandidateMove, onConnectStages]);

  const nodesWithCallbacks = job.nodes.map(node => {
    if (node.type === 'job') {
      return { ...node, data: { ...node.data, ...job.details, onEdit: onEditJob, onArchive: onArchiveJob } };
    }
    if (node.type === 'candidate') {
      return { ...node, data: { ...node.data, onShowResume, onMoveToNext: (candidateId) => onMoveToNextStage(candidateId, node.id), onEditStage: () => onEditStage(node.id, node.data.stage), onDeleteStage: () => onDeleteStage(node.id) } };
    }
    if (node.type === 'assessment') {
      return { 
        ...node, 
        data: { 
          ...node.data, 
          onShowResume, 
          onMoveToNext: (candidateId) => onMoveToNextStage(candidateId, node.id), 
          onEditStage: () => onEditStage(node.id, node.data.stage, 'assessment'), 
          onDeleteStage: () => onDeleteStage(node.id),
          onCreateAssessment: () => onCreateAssessment(node.id),
          onEditAssessment: () => onEditAssessment(node.id, node.data.assessment),
          onViewResponses: (assessment, candidate) => onViewResponses(assessment, candidate)
        } 
      };
    }
    return node;
  });

  const edgesWithCallbacks = job.edges.map(edge => {
    if (edge.type === 'addStageEdge') {
      return { ...edge, data: { ...edge.data, onAddStage } };
    }
    return edge;
  });

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edgesWithCallbacks}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-gray-50"
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{ stroke: '#4A61E2', strokeWidth: 2, strokeDasharray: '5 5' }}
        deleteKeyCode={null}
        nodesDraggable={true}
        nodesConnectable={true}
      >
        <Background color="#ddd" gap={24} />
        <FlowControls position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

export default EmployerDashboard;
