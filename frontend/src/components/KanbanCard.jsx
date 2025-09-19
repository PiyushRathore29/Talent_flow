import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { User, GripVertical } from 'lucide-react';

const KanbanCard = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: candidate.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 touch-none">
      <div className="flex items-center justify-between">
        <Link to={`/candidates/${candidate.id}`} className="flex items-center gap-3 overflow-hidden flex-1 group">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-primary-400 transition-colors">{candidate.name}</p>
            <p className="text-xs text-gray-500 truncate">{candidate.jobTitle}</p>
          </div>
        </Link>
        <div {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
