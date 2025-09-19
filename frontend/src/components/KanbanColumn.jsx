import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ id, title, candidates }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider">{title}</h3>
      </div>
      <div className="p-2 space-y-2 flex-1 min-h-[200px] bg-gray-50/50 rounded-b-xl">
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {candidates.map(candidate => (
            <KanbanCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>
        {candidates.length === 0 && (
            <div className="flex items-center justify-center h-full text-center text-sm text-gray-400 p-4">
                No candidates in this stage.
            </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
