import React from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import { Plus } from 'lucide-react';

const AddStageEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (event) => {
    event.stopPropagation();
    data.onAddStage(id);
  };

  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill="none"
        strokeWidth={3}
        stroke="#4A61E2"
        className="react-flow__edge-path"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <button
            onClick={onEdgeClick}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-primary-400/50 hover:border-primary-400 text-primary-400 transition-all duration-200 shadow-md hover:scale-110 opacity-50 group-hover:opacity-100"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default AddStageEdge;
