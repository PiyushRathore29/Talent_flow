import React, { useState, useMemo } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useCandidates } from '../hooks/useCandidates';
import KanbanColumn from './KanbanColumn';
import { Search, Filter } from 'lucide-react';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];

const CandidatesBoard = () => {
  const { candidates, setCandidates } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');

  const candidatesByStage = useMemo(() => {
    let filteredCandidates = Object.values(candidates);

    if (searchTerm) {
      filteredCandidates = filteredCandidates.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStage !== 'All') {
      filteredCandidates = filteredCandidates.filter(c => c.currentStage === filterStage);
    }

    return STAGES.reduce((acc, stage) => {
      acc[stage] = filteredCandidates.filter(c => c.currentStage === stage);
      return acc;
    }, {});
  }, [candidates, searchTerm, filterStage]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const candidateId = active.id;
    const newStage = over.id;
    const oldStage = candidates[candidateId].currentStage;

    if (newStage !== oldStage) {
      setCandidates(prev => ({
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          currentStage: newStage,
          history: [...prev[candidateId].history, { stage: newStage, date: new Date().toISOString().split('T')[0], actor: 'HR Manager' }]
        }
      }));
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-24">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-8">
            <h1 className="text-heading font-impact font-black uppercase text-primary-500">Candidates Board</h1>
            <p className="mt-2 text-body text-primary-500/70">Manage all candidates across all job openings.</p>
        </div>
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <div className="relative flex-grow md:flex-grow-0 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50"
            />
          </div>
          <div className="relative flex-grow md:flex-grow-0 md:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50 appearance-none"
            >
              <option value="All">All Stages</option>
              {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
            </select>
          </div>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={STAGES} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {STAGES.map(stage => (
                <KanbanColumn
                  key={stage}
                  id={stage}
                  title={stage}
                  candidates={candidatesByStage[stage]}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CandidatesBoard;
