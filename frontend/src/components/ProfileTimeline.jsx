import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProfileTimeline = ({ history }) => {
  return (
    <div>
      <h2 className="text-xl font-bold font-inter text-primary-500 mb-6">Application Timeline</h2>
      <ol className="relative border-l border-gray-200">
        {history.slice().reverse().map((item, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
              <CheckCircle className="w-4 h-4 text-primary-400" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              {item.stage}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
              On {new Date(item.date).toLocaleDateString()}
            </time>
            <p className="text-base font-normal text-gray-500">
              Status changed by {item.actor}.
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProfileTimeline;
