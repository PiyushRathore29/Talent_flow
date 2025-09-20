import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position } from '@xyflow/react';
import { ClipboardList, Plus, Settings, Eye, Users, Clock, CheckCircle, FileText, ChevronsRight, GripVertical, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const AssessmentCandidateCard = ({ candidate, assessment, onShowResume, onMoveToNext, onViewResponses }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2
      });
    }
  }, [isHovered]);

  if (!candidate) return null;

  return (
    <>
      <div
        ref={cardRef}
        className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center group/card relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className={`w-2 h-2 rounded-full ${
          candidate.assessmentCompleted ? 'bg-green-500' : 'bg-yellow-500'
        }`} />
        <div className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full">
           <User className="w-4 h-4 text-gray-500" />
        </div>
        <p className="font-semibold text-gray-700 text-sm truncate">{candidate.userName || candidate.name || 'Unknown Candidate'}</p>
        {candidate.assessmentCompleted && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
            {candidate.assessmentScore || 'N/A'}%
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={candidate.id}
        className="!w-6 !h-6 !bg-orange-400 !border-2 !border-white group-hover/card:!bg-orange-500 cursor-move"
      >
        <GripVertical className="w-4 h-4 text-orange-600 group-hover/card:text-white" />
      </Handle>

      {/* Portal for hover menu */}
      {isHovered && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed w-48 bg-white rounded-md shadow-2xl border border-gray-100 p-1.5"
            style={{ 
              zIndex: 9999,
              top: menuPosition.top,
              left: menuPosition.left,
              transform: 'translateX(-50%)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
              {candidate.assessmentCompleted && assessment && (
                <li>
                  <button 
                    onClick={() => onViewResponses(assessment, candidate)} 
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500" /> View Responses
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
      </div>
    </>
  );
};

const AssessmentNode = ({ data }) => {
  const {
    stage,
    candidates = [],
    assessment = null,
    onShowResume,
    onMoveToNext,
    onEditStage,
    onDeleteStage,
    onCreateAssessment,
    onEditAssessment,
    onViewResponses
  } = data;

  const [isExpanded, setIsExpanded] = useState(true);

  const completedCandidates = candidates.filter(c => c.assessmentCompleted);
  const pendingCandidates = candidates.filter(c => !c.assessmentCompleted);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg border-2 border-orange-200 min-w-[280px] max-w-[320px] relative"
      style={{ overflow: 'visible' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-orange-400 !border-2 !border-white"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <h3 className="font-semibold text-sm">{stage}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-orange-400 rounded transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onEditStage}
              className="p-1 hover:bg-orange-400 rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Assessment Info */}
        <div className="mt-2 text-xs">
          {assessment ? (
            <div className="flex items-center justify-between">
              <span className="bg-orange-400 px-2 py-1 rounded text-white">
                {assessment.title}
              </span>
              <span className="text-orange-100">
                {assessment.questions?.length || 0} questions
              </span>
            </div>
          ) : (
            <span className="text-orange-200 italic">No assessment created</span>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 relative" style={{ overflow: 'visible' }}>
              {/* Assessment Actions */}
              <div className="mb-4 space-y-2">
                {!assessment ? (
                  <button
                    onClick={onCreateAssessment}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Assessment
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditAssessment(assessment)}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-100 text-orange-700 py-2 px-3 rounded-lg text-sm hover:bg-orange-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onViewResponses(assessment)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Responses
                    </button>
                  </div>
                )}
              </div>

              {/* Statistics */}
              {assessment && candidates.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 p-2 rounded border text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span className="font-semibold">{completedCandidates.length}</span>
                    </div>
                    <div className="text-green-500">Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded border text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-semibold">{pendingCandidates.length}</span>
                    </div>
                    <div className="text-yellow-500">Pending</div>
                  </div>
                </div>
              )}

              {/* Candidates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Candidates ({candidates.length})
                  </span>
                </div>

                {candidates.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-xs">
                    Drag candidates here
                  </div>
                ) : (
                  <div className="space-y-2 min-h-[120px] relative" style={{ overflow: 'visible' }}>
                    {candidates.map((candidate) => (
                      <AssessmentCandidateCard 
                        key={candidate.id} 
                        candidate={candidate} 
                        assessment={assessment}
                        onShowResume={onShowResume} 
                        onMoveToNext={onMoveToNext} 
                        onViewResponses={onViewResponses}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-orange-400 !border-2 !border-white"
      />
    </motion.div>
  );
};

export default AssessmentNode;