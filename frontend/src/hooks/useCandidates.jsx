import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dbHelpers } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

const CandidateContext = createContext();

export const useCandidates = () => useContext(CandidateContext);

export const CandidateProvider = ({ children }) => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);

  // Load candidates for the current user's company
  useEffect(() => {
    const loadCandidates = async () => {
      if (!user) {
        setCandidates({});
        setLoading(false);
        return;
      }

      try {
        let candidatesList = [];
        
        if (user.role === 'hr' && user.companyId) {
          // HR users see candidates from their company's jobs
          candidatesList = await dbHelpers.getCandidatesByCompany(user.companyId);
        } else if (user.role === 'candidate') {
          // Candidates see their own applications
          candidatesList = await dbHelpers.getCandidatesByUserId(user.id);
        }

        // Convert array to object with id as key for backward compatibility
        const candidatesObj = candidatesList.reduce((acc, candidate) => {
          acc[candidate.id] = candidate;
          return acc;
        }, {});

        setCandidates(candidatesObj);
      } catch (error) {
        console.error('Failed to load candidates:', error);
        setCandidates({});
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [user]);

  const findCandidate = useCallback((id) => {
    return candidates[id];
  }, [candidates]);

  const updateCandidate = useCallback(async (id, updates) => {
    try {
      await dbHelpers.updateCandidate(id, updates);
      setCandidates(prev => ({
        ...prev,
        [id]: { ...prev[id], ...updates }
      }));
    } catch (error) {
      console.error('Failed to update candidate:', error);
    }
  }, []);

  const addNoteToCandidate = useCallback(async (candidateId, note) => {
    try {
      const candidate = candidates[candidateId];
      if (!candidate) return;

      const newNote = {
        id: `note-${Date.now()}`,
        content: note.content,
        author: note.author || user?.firstName + ' ' + user?.lastName,
        timestamp: new Date().toISOString(),
        mentions: note.mentions || []
      };

      const updatedNotes = [...(candidate.notes || []), newNote];
      await dbHelpers.updateCandidate(candidateId, { notes: updatedNotes });

      setCandidates(prev => {
        const updatedCandidate = {
          ...prev[candidateId],
          notes: updatedNotes
        };
        return { ...prev, [candidateId]: updatedCandidate };
      });
    } catch (error) {
      console.error('Failed to add note to candidate:', error);
    }
  }, [candidates, user]);

  const moveCandidateToStage = useCallback(async (candidateId, newStage, actor = null, note = '') => {
    try {
      const candidate = candidates[candidateId];
      if (!candidate || candidate.currentStageId === newStage) return;

      // Use the database helper function to update stage and create history
      await dbHelpers.moveCandidateToStage(candidateId, newStage, user?.id, note);

      // Also update local state for immediate UI feedback
      const historyEntry = {
        id: `history-${Date.now()}`,
        stage: newStage,
        date: new Date().toISOString().split('T')[0],
        actor: actor || (user?.firstName + ' ' + user?.lastName),
        note: note || `Moved to ${newStage}`,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = [...(candidate.history || []), historyEntry];
      const updates = {
        currentStageId: newStage, // Use currentStageId to match database schema
        history: updatedHistory,
        updatedAt: new Date().toISOString()
      };

      setCandidates(prev => ({
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          ...updates
        }
      }));
    } catch (error) {
      console.error('Failed to move candidate to stage:', error);
    }
  }, [candidates, user]);

  const createCandidate = useCallback(async (candidateData) => {
    try {
      if (!user?.companyId && user?.role === 'hr') {
        throw new Error('HR user must be associated with a company');
      }

      const newCandidate = {
        ...candidateData,
        companyId: user.companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStage: candidateData.currentStage || 'APPLIED',
        history: candidateData.history || [{
          id: `history-${Date.now()}`,
          stage: candidateData.currentStage || 'APPLIED',
          date: new Date().toISOString().split('T')[0],
          actor: user.firstName + ' ' + user.lastName,
          note: 'Application submitted',
          timestamp: new Date().toISOString()
        }],
        notes: candidateData.notes || []
      };

      const candidateId = await dbHelpers.createCandidate(newCandidate, user.id);
      const createdCandidate = { ...newCandidate, id: candidateId };
      
      setCandidates(prev => ({
        ...prev,
        [candidateId]: createdCandidate
      }));

      return createdCandidate;
    } catch (error) {
      console.error('Failed to create candidate:', error);
      throw error;
    }
  }, [user]);

  const deleteCandidate = useCallback(async (candidateId) => {
    try {
      await dbHelpers.deleteCandidate(candidateId);
      setCandidates(prev => {
        const updated = { ...prev };
        delete updated[candidateId];
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete candidate:', error);
    }
  }, []);

  const value = {
    candidates,
    loading,
    setCandidates,
    findCandidate,
    updateCandidate,
    addNoteToCandidate,
    moveCandidateToStage,
    createCandidate,
    deleteCandidate
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};
