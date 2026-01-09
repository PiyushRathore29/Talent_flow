import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
// ✅ We get everything we need from the useCandidates hook
import { useCandidates } from "../../hooks/useCandidates";
import { Search, Filter, Loader } from "lucide-react";

const STAGES = [
  { id: "applied", name: "Applied" },
  { id: "screen", name: "Screening" },
  { id: "tech", name: "Technical" },
  { id: "offer", name: "Offer" },
  { id: "hired", name: "Hired" },
];

const CandidatesBoard = () => {
  // ✅ REWRITTEN: Get state and setters directly from the context.
  // The component no longer manages its own local filter state.
  const {
    candidates, // This is now the pre-filtered array from the server
    loading,
    moveCandidateToStage,
    searchTerm, // Filter state from context
    setSearchTerm, // State setter from context
    selectedStage, // Filter state from context
    setSelectedStage, // State setter from context
  } = useCandidates();

  // ❌ REMOVED: All client-side filtering logic with useEffect is gone.

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active || active.id === over.id) return;

    const candidateId = active.id;
    const newStage = over.id;
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const oldStage = candidate.stage;
    if (newStage === oldStage) return;

    const currentStageIndex = STAGES.findIndex((s) => s.id === oldStage);
    const newStageIndex = STAGES.findIndex((s) => s.id === newStage);

    if (newStageIndex < currentStageIndex) {
      alert("Cannot move candidate backwards in the pipeline");
      return;
    }

    moveCandidateToStage(
      candidateId,
      newStage,
      null,
      `Moved from ${oldStage} to ${newStage}`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-6 h-6 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">Loading candidates...</span>
      </div>
    );
  }

  // Group the already filtered candidates by stage for display
  const candidatesByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = candidates.filter((c) => c.stage === stage.id);
    return acc;
  }, {});

  // Determine which columns to render based on the filter
  const stagesToDisplay =
    selectedStage === "ALL"
      ? STAGES
      : STAGES.filter((stage) => stage.id === selectedStage);

  return (
    <div className="px-4 sm:px-8 lg:px-24 py-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-heading font-impact font-black uppercase text-primary-500">
            Candidates Board
          </h1>
          <p className="mt-2 text-body text-primary-500/70">
            Manage all candidates across job stages easily.
          </p>
        </div>

        {/* Search + Filter inputs now use state and setters from the context */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <div className="relative flex-grow md:flex-grow-0 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by candidate name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50"
            />
          </div>

          <div className="relative flex-grow md:flex-grow-0 md:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50 appearance-none"
            >
              {/* ✅ CHANGED: "All" value is now "ALL" to match the context state */}
              <option value="ALL">All Stages</option>
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The rest of the rendering logic remains the same */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stagesToDisplay.map((s) => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {stagesToDisplay.map((stage) => (
                <div
                  key={stage.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {stage.name}
                  </h3>
                  <div className="space-y-2">
                    {candidatesByStage[stage.id]?.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No candidates in this stage.
                      </p>
                    ) : (
                      candidatesByStage[stage.id].map((candidate) => (
                        <div
                          key={candidate.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {candidate.firstName} {candidate.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {candidate.email}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CandidatesBoard;
