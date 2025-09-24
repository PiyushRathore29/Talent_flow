import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { User, GripVertical } from "lucide-react";

const KanbanCard = React.memo(({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 touch-none transition-all duration-300 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "rotate-2 scale-105 shadow-2xl ring-2 ring-blue-300"
          : "hover:scale-102"
      }`}
      title="Drag to move between stages"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="font-semibold text-gray-800 text-sm truncate hover:text-primary-400 transition-colors">
            {candidate.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{candidate.jobTitle}</p>
        </div>
        {/* Drag indicator */}
        <div className="text-gray-400 opacity-50">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

export default KanbanCard;
