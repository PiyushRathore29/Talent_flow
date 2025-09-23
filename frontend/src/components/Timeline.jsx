import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  UserPlus, 
  ArrowRight, 
  Clock, 
  User,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy
} from 'lucide-react';

const Timeline = ({ entries, candidateId = null, showCandidate = true, limit = null }) => {
  // Limit entries if specified
  const displayEntries = limit ? entries.slice(0, limit) : entries;

  if (!displayEntries || displayEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-medium">No timeline entries yet</p>
        <p className="text-xs mt-1">Activity will appear here as candidates progress through stages</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayEntries.map((entry, index) => (
        <TimelineEntry 
          key={entry.id} 
          entry={entry} 
          isLast={index === displayEntries.length - 1}
          showCandidate={showCandidate}
        />
      ))}
    </div>
  );
};

const TimelineEntry = ({ entry, isLast, showCandidate }) => {
  const getIcon = () => {
    switch (entry.actionType) {
      case 'candidate_created':
        return <UserPlus className="w-4 h-4" />;
      case 'stage_progression':
        // Different icons based on stage
        if (entry.toStage === 'hired') {
          return <Trophy className="w-4 h-4" />;
        } else if (entry.toStage === 'rejected') {
          return <XCircle className="w-4 h-4" />;
        } else if (entry.toStage === 'offer') {
          return <CheckCircle2 className="w-4 h-4" />;
        }
        return <ArrowRight className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getIconColor = () => {
    switch (entry.actionType) {
      case 'candidate_created':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'stage_progression':
        if (entry.toStage === 'hired') {
          return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
        } else if (entry.toStage === 'rejected') {
          return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
        } else if (entry.toStage === 'offer') {
          return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
        } else if (entry.toStage === 'tech') {
          return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
        } else if (entry.toStage === 'screen') {
          return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
        }
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getStageDisplayName = (stageId) => {
    const stageMap = {
      'applied': 'Applied',
      'screen': 'Screening',
      'tech': 'Technical',
      'offer': 'Offer',
      'hired': 'Hired',
      'rejected': 'Rejected'
    };
    return stageMap[stageId] || stageId;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000; // Within 24 hours
    
    if (isRecent) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}
      
      {/* Timeline Entry */}
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconColor()} transition-colors duration-200`}>
          {getIcon()}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-colors duration-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {/* Action Description */}
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {showCandidate && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {entry.candidateName}
                  </span>
                )}
                {showCandidate && ' • '}
                {entry.actionType === 'candidate_created' && (
                  <span>was created and applied</span>
                )}
                {entry.actionType === 'stage_progression' && (
                  <span>
                    moved from <span className="font-semibold text-gray-700 dark:text-gray-300">{getStageDisplayName(entry.fromStage)}</span> to{' '}
                    <span className={`font-semibold ${
                      entry.toStage === 'hired' ? 'text-green-600 dark:text-green-400' :
                      entry.toStage === 'rejected' ? 'text-red-600 dark:text-red-400' :
                      entry.toStage === 'offer' ? 'text-orange-600 dark:text-orange-400' :
                      'text-gray-700 dark:text-gray-300'
                    }`}>
                      {getStageDisplayName(entry.toStage)}
                    </span>
                  </span>
                )}
              </div>
              
              {/* Job Info */}
              {entry.jobTitle && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {entry.jobTitle}
                </div>
              )}
              
              {/* Metadata */}
              {entry.metadata?.candidateEmail && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Email: {entry.metadata.candidateEmail}
                </div>
              )}
            </div>
            
            {/* Timestamp */}
            <div className="flex-shrink-0 ml-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimestamp(entry.timestamp)}
                </div>
              </div>
            </div>
          </div>
          
          {/* HR User Info */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            <User className="w-3 h-3 mr-1" />
            Action by: {entry.hrUserName}
          </div>
        </div>
      </div>
    </div>
  );
};

// Timeline Stats Component
export const TimelineStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.today}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Today</div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisWeek}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">This Week</div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisMonth}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">This Month</div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total</div>
      </div>
    </div>
  );
};

export default Timeline;