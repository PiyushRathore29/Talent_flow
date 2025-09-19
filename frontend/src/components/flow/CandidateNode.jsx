import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, GripVertical, FileText, ChevronsRight, Edit, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCandidates } from '../../hooks/useCandidates';

const CandidateCard = ({ candidateId, onShowResume, onMoveToNext }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { findCandidate } = useCandidates();
  const candidate = findCandidate(candidateId);

  if (!candidate) return null;

  return (
    <div
      className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center group/card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full">
           <User className="w-4 h-4 text-gray-500" />
        </div>
        <p className="font-semibold text-gray-700 text-sm truncate">{candidate.name}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={candidate.id}
        className="!w-6 !h-6 !bg-gray-200 !border-2 !border-white group-hover/card:!bg-primary-400 cursor-move"
      >
        <GripVertical className="w-4 h-4 text-gray-400 group-hover/card:text-white" />
      </Handle>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-md shadow-2xl border border-gray-100 z-20 p-1.5"
          >
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => onShowResume(candidate)} 
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-500" /> View Resume
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onMoveToNext(candidate.id)} 
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ChevronsRight className="w-4 h-4 text-gray-500" /> Move to Next
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CandidateNode = ({ id, data }) => {
  const { stage, candidateIds = [], onShowResume, onMoveToNext, onEditStage, onDeleteStage } = data;

  return (
    <div className="w-72 bg-white rounded-xl shadow-md border border-gray-200 group/stage">
      <Handle type="target" position={Position.Top} id={`${id}-top`} className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white" />
      <Handle type="target" position={Position.Left} id={id} className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white" />
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h4 className="font-semibold text-gray-400 uppercase text-xs tracking-wider flex-1">{stage}</h4>
        <div className="flex items-center opacity-0 group-hover/stage:opacity-100 transition-opacity">
            <button onClick={onEditStage} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <Edit className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDeleteStage} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>
      <div className="p-2 space-y-2 min-h-[120px]">
        {candidateIds.map(candidateId => (
          <CandidateCard key={candidateId} candidateId={candidateId} onShowResume={onShowResume} onMoveToNext={onMoveToNext} />
        ))}
        {candidateIds.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[100px] text-center text-sm text-gray-400 p-4">
                Drag candidates here
            </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 !bg-primary-400 !border-2 !border-white cursor-pointer" />
    </div>
  );
};

export default CandidateNode;
