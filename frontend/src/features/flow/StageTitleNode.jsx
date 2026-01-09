import React from 'react';
import { Handle, Position } from '@xyflow/react';

const StageTitleNode = ({ data }) => {
  return (
    <div className="w-96">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      <h2 className="text-subheading font-inter font-semibold text-primary-500 leading-tight tracking-tighter">
        {data.title}
      </h2>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};

export default StageTitleNode;
