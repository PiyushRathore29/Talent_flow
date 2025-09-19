import React, { createContext, useContext, useState, useCallback } from 'react';
import { initialCandidates } from '../data/candidatesData';

const CandidateContext = createContext();

export const useCandidates = () => useContext(CandidateContext);

export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(initialCandidates);

  const findCandidate = useCallback((id) => {
    return candidates[id];
  }, [candidates]);

  const updateCandidate = useCallback((id, updates) => {
    setCandidates(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  }, []);

  const addNoteToCandidate = useCallback((candidateId, note) => {
    setCandidates(prev => {
        const candidate = prev[candidateId];
        if (!candidate) return prev;
        const newNote = { ...note, id: `note-${Date.now()}` };
        const updatedCandidate = {
            ...candidate,
            notes: [...candidate.notes, newNote]
        };
        return { ...prev, [candidateId]: updatedCandidate };
    });
  }, []);

  const value = {
    candidates,
    setCandidates,
    findCandidate,
    updateCandidate,
    addNoteToCandidate
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};
