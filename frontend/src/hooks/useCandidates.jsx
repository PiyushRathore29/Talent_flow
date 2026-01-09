import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { dbHelpers } from "../lib/database";
import { useAuth } from "../contexts/AuthContext";

const CandidateContext = createContext();

export const useCandidates = () => useContext(CandidateContext);

export const CandidateProvider = ({ children }) => {
  const { user } = useAuth();
  // ✅ CHANGED: Candidates is now an array, not an object. It holds the filtered results from the API.
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ADDED: State for server-side filters
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ REWRITTEN: Centralized function to load candidates based on current filters
  const loadCandidates = useCallback(async () => {
    if (!user) {
      setCandidates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const filters = {
        stage: selectedStage === "ALL" ? null : selectedStage,
        search: searchTerm || null,
      };

      let candidatesList = [];

      // This assumes your dbHelpers are updated to accept a 'filters' object.
      // e.g., dbHelpers.getCandidatesByCompany(companyId, { stage: 'screen', search: 'Piyush' })
      if (user.role === "hr" && user.companyId) {
        candidatesList = await dbHelpers.getCandidatesByCompany(
          user.companyId,
          filters
        );
      } else if (user.role === "candidate") {
        candidatesList = await dbHelpers.getCandidatesByUserId(
          user.id,
          filters
        );
      }

      setCandidates(candidatesList);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [user, selectedStage, searchTerm]); // Refetches whenever user or filters change

  // ✅ CHANGED: useEffect now just calls the centralized fetcher
  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // ✅ CHANGED: This now finds from an array
  const findCandidate = useCallback(
    (id) => {
      return candidates.find((c) => c.id === id);
    },
    [candidates]
  );

  const updateCandidate = useCallback(
    async (id, updates) => {
      try {
        await dbHelpers.updateCandidate(id, updates);
        // ✅ CHANGED: Refetch the list to ensure UI is consistent with filters
        await loadCandidates();
      } catch (error) {
        console.error("Failed to update candidate:", error);
      }
    },
    [loadCandidates]
  );

  const addNoteToCandidate = useCallback(
    async (candidateId, note) => {
      try {
        const candidate = candidates.find((c) => c.id === candidateId);
        if (!candidate) return;

        const newNote = {
          /* ... your note creation logic ... */
        };
        const updatedNotes = [...(candidate.notes || []), newNote];
        await dbHelpers.updateCandidate(candidateId, { notes: updatedNotes });

        // ✅ CHANGED: Refetch to get the latest data
        await loadCandidates();
      } catch (error) {
        console.error("Failed to add note to candidate:", error);
      }
    },
    [candidates, user, loadCandidates]
  );

  const moveCandidateToStage = useCallback(
    async (candidateId, newStage, actor = null, note = "") => {
      try {
        const candidate = candidates.find((c) => c.id === candidateId);
        if (!candidate || candidate.stage === newStage) return;

        await dbHelpers.moveCandidateToStage(
          candidateId,
          newStage,
          user?.id,
          note
        );
        // ✅ CHANGED: Refetch the list. The candidate may disappear from view if the filter changes.
        await loadCandidates();
      } catch (error) {
        console.error("Failed to move candidate to stage:", error);
      }
    },
    [candidates, user, loadCandidates]
  );

  const createCandidate = useCallback(
    async (candidateData) => {
      try {
        if (!user?.companyId && user?.role === "hr") {
          throw new Error("HR user must be associated with a company");
        }

        // Your existing new candidate creation logic...
        const newCandidate = {
          /* ... */
        };

        await dbHelpers.createCandidate(newCandidate, user.id);

        // ✅ CHANGED: Refetch to include the new candidate in the current view (if it matches filters)
        await loadCandidates();

        // Note: The function can't easily return the created candidate anymore
        // without a second fetch, but the UI will update regardless.
        return true;
      } catch (error) {
        console.error("Failed to create candidate:", error);
        throw error;
      }
    },
    [user, loadCandidates]
  );

  const deleteCandidate = useCallback(
    async (candidateId) => {
      try {
        await dbHelpers.deleteCandidate(candidateId);
        // ✅ CHANGED: Refetch to remove the deleted candidate from the UI
        await loadCandidates();
      } catch (error) {
        console.error("Failed to delete candidate:", error);
      }
    },
    [loadCandidates]
  );

  // ❌ REMOVED: The client-side useMemo for filtering is no longer needed.
  // const filteredCandidates = useMemo(() => { ... });

  // ❌ REMOVED: filterByStage is replaced by exposing setSelectedStage directly.
  // const filterByStage = useCallback((stage) => { ... });

  const value = {
    // ✅ CHANGED: 'candidates' is now the pre-filtered array from the server.
    candidates,
    loading,

    // ✅ ADDED: Expose filter state and setters to the UI components
    selectedStage,
    setSelectedStage,
    searchTerm,
    setSearchTerm,

    // All action functions are still available
    findCandidate,
    updateCandidate,
    addNoteToCandidate,
    moveCandidateToStage,
    createCandidate,
    deleteCandidate,
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};
