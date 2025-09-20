import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ClipboardList, Plus, Settings, Eye, Users, Clock, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
      className="bg-white rounded-xl shadow-lg border-2 border-orange-200 min-w-[280px] max-w-[320px]"
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
            <div className="p-4">
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
                      onClick={onEditAssessment}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-100 text-orange-700 py-2 px-3 rounded-lg text-sm hover:bg-orange-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={onViewResponses}
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
                    No candidates in this stage
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="bg-gray-50 p-2 rounded border flex items-center justify-between text-xs group/candidate"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${
                            candidate.assessmentCompleted ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="font-medium text-gray-700 truncate">
                            {candidate.userName || candidate.name || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {candidate.assessmentCompleted && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              {candidate.assessmentScore || 'N/A'}%
                            </span>
                          )}
                          <button
                            onClick={() => onShowResume(candidate)}
                            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover/candidate:opacity-100 transition-all"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>

                        <Handle
                          type="source"
                          position={Position.Right}
                          id={candidate.id}
                          className="!w-4 !h-4 !bg-orange-400 !border-2 !border-white opacity-0 group-hover/candidate:opacity-100 transition-opacity cursor-move"
                        />
                      </div>
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