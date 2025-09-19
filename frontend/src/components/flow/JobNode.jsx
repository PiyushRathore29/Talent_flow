import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Edit, Archive, Users, Briefcase } from 'lucide-react';

const JobNode = ({ data }) => {
  const { title, status, applicants, description, onEdit, onArchive, id } = data;
  const isArchived = status === 'Archived';

  return (
    <div className={`w-[28rem] rounded-xl shadow-lg border ${isArchived ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'} transition-colors`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isArchived ? 'bg-gray-200' : 'bg-primary-400/10'}`}>
              <Briefcase className={`w-6 h-6 ${isArchived ? 'text-gray-400' : 'text-primary-400'}`} />
            </div>
            <div>
              <h3 className={`font-bold text-lg text-gray-800 ${isArchived ? 'line-through text-gray-500' : ''}`}>
                {title}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${isArchived ? 'bg-gray-200 text-gray-600' : 'bg-teal-100 text-teal-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isArchived ? 'bg-gray-400' : 'bg-teal-500'}`}></span>
                  {status}
                </span>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>{applicants} Applicants</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(data)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isArchived}>
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onArchive(id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>
        {description && (
          <p className={`mt-4 text-sm text-gray-700 ${isArchived ? 'text-gray-400' : ''}`}>
            {description}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 !bg-gray-300" />
    </div>
  );
};

export default JobNode;
