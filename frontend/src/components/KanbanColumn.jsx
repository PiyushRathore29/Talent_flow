import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";

const KanbanColumn = React.memo(({ id, title, candidates }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const candidateIds = candidates.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl shadow-md border border-gray-200 flex flex-col transition-all duration-300 ${
        isOver
          ? "ring-2 ring-blue-300 scale-105 shadow-lg bg-blue-50"
          : "hover:shadow-lg"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider">
          {title}
        </h3>
      </div>
      <div
        className={`p-2 space-y-2 flex-1 min-h-[200px] bg-gray-50/50 rounded-b-xl transition-all duration-300 ${
          isOver ? "bg-blue-100/50" : ""
        }`}
      >
        <SortableContext
          items={candidateIds}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map((candidate) => (
            <KanbanCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>
        {candidates.length === 0 && (
          <div
            className={`flex items-center justify-center h-full text-center text-sm p-4 transition-all duration-300 ${
              isOver
                ? "text-blue-500 border-2 border-dashed border-blue-300 rounded-lg"
                : "text-gray-400"
            }`}
          >
            {isOver ? "✨ Drop candidate here" : "No candidates in this stage."}
          </div>
        )}
      </div>
    </div>
  );
});

export default KanbanColumn;
