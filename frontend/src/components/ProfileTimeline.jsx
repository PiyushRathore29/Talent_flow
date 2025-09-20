import React from 'react';
import { CheckCircle, Clock, UserCheck, FileText, Award, UserPlus } from 'lucide-react';

const getStageIcon = (stage) => {
  switch (stage) {
    case 'APPLIED': return FileText;
    case 'SCREENING': return Clock;
    case 'INTERVIEW': return UserCheck;
    case 'OFFER': return Award;
    case 'HIRED': return UserPlus;
    default: return CheckCircle;
  }
};

const getStageColor = (stage) => {
  switch (stage) {
    case 'APPLIED': return 'bg-blue-100 text-blue-500';
    case 'SCREENING': return 'bg-yellow-100 text-yellow-500';
    case 'INTERVIEW': return 'bg-purple-100 text-purple-500';
    case 'OFFER': return 'bg-green-100 text-green-500';
    case 'HIRED': return 'bg-emerald-100 text-emerald-500';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const ProfileTimeline = ({ history }) => {
  return (
    <div>
      <h2 className="text-xl font-bold font-inter text-primary-500 mb-6">Application Timeline</h2>
      <ol className="relative border-l border-gray-200">
        {history.slice().reverse().map((item, index) => {
          const Icon = getStageIcon(item.stage);
          const colorClass = getStageColor(item.stage);
          
          return (
            <li key={index} className="mb-10 ml-6">
              <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8 ring-white ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                {item.stage.replace('_', ' ')}
                {index === 0 && <span className="bg-primary-100 text-primary-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded">Current</span>}
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                {new Date(item.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              <p className="text-base font-normal text-gray-500">
                Changed by <span className="font-medium text-gray-700">{item.actor}</span>
                {item.note && (
                  <span className="block mt-1 text-sm text-gray-600 italic">"{item.note}"</span>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProfileTimeline;
