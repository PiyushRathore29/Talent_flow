import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Users, TrendingUp, Target, Calendar, ChevronDown } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AuthenticatedHeader from "../../components/AuthenticatedHeader";
import Footer from "../../components/Footer";
import CandidatesBoard from "../../components/CandidatesBoard";
import { useToast } from "../../components/Toast";
import { dbHelpers } from "../../lib/database";

// Create Candidate Button Component
const CreateCandidateButton = ({ onCreate, jobs, defaultJobId }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    stage: "applied",
    jobId: defaultJobId
      ? parseInt(defaultJobId)
      : jobs.length > 0
      ? jobs[0].id
      : 1,
  });

  // Update default jobId when jobs are loaded or defaultJobId changes
  useEffect(() => {
    if (defaultJobId) {
      setFormData((prev) => ({ ...prev, jobId: parseInt(defaultJobId) }));
    } else if (jobs.length > 0 && !formData.jobId) {
      setFormData((prev) => ({ ...prev, jobId: jobs[0].id }));
    }
  }, [jobs, defaultJobId, formData.jobId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    onCreate(formData);
    setFormData({
      name: "",
      email: "",
      stage: "applied",
      jobId: defaultJobId
        ? parseInt(defaultJobId)
        : jobs.length > 0
        ? jobs[0].id
        : 1,
    });
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
      >
        Add Candidate
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-black rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-4">
              Add New Candidate
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
                  Apply to Job *
                </label>
                <select
                  value={formData.jobId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jobId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  required
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData({ ...formData, stage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <option value="applied">Applied</option>
                  <option value="screen">Screening</option>
                  <option value="tech">Technical</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const CandidatesPage = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  // Toast system
  const { showSuccess, showError, ToastContainer } = useToast();

  // State variables
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState(""); // This will trigger the actual search
  const [stageFilter, setStageFilter] = useState("");

  // View mode
  const [viewMode, setViewMode] = useState("kanban"); // 'list' or 'kanban'

  // Drag and drop state
  const [activeId, setActiveId] = useState(null);
  const [draggedCandidate, setDraggedCandidate] = useState(null);

  // Handle search on Enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setAppliedSearch(search);
      setCurrentPage(1); // Reset to first page when searching
    }
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag and drop handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const candidate = candidates.find((c) => c.id === active.id);
    setActiveId(active.id);
    setDraggedCandidate(candidate);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    // If no drop target or dropped on itself, do nothing
    if (!over || active.id === over.id) {
      setActiveId(null);
      setDraggedCandidate(null);
      return;
    }

    const candidateId = active.id;
    const newStage = over.id;

    // Validate that the drop target is a valid stage
    const validStages = stages.map((stage) => stage.id);
    if (!validStages.includes(newStage)) {
      console.log("Invalid drop target, candidate will stay in original stage");
      setActiveId(null);
      setDraggedCandidate(null);
      return;
    }

    // Find candidate and update optimistically
    const candidate = allCandidates.find((c) => c.id === candidateId);
    if (!candidate) {
      setActiveId(null);
      setDraggedCandidate(null);
      return;
    }

    const oldStage = candidate.stage;
    const stageName = stages.find((s) => s.id === newStage)?.name || newStage;

    // Check if this is a forward movement (prevent moving backwards)
    const currentStageIndex = stages.findIndex((s) => s.id === oldStage);
    const newStageIndex = stages.findIndex((s) => s.id === newStage);

    if (newStageIndex < currentStageIndex) {
      console.log("❌ Cannot move candidate backwards in the pipeline");
      setActiveId(null);
      setDraggedCandidate(null);
      showError("Cannot move candidate backwards in the pipeline");
      return;
    }

    // Optimistic update - immediately update local state
    const updatedCandidate = { ...candidate, stage: newStage };
    const updatedAllCandidates = allCandidates.map((c) =>
      c.id === candidateId ? updatedCandidate : c
    );
    setAllCandidates(updatedAllCandidates);

    // Also update paginated candidates if it contains this candidate
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? updatedCandidate : c))
    );

    try {
      // Update candidate stage in IndexedDB
      await dbHelpers.updateCandidate(candidateId, { stage: newStage });

      // Show success toast
      showSuccess(`${candidate?.name || "Candidate"} moved to ${stageName}`);

      // Log to timeline (non-blocking)
      const job = jobs.find((j) => j.id === candidate.jobId);
      if (job) {
        const oldStageName =
          stages.find((s) => s.id === oldStage)?.name || oldStage;
        try {
          await dbHelpers.logStageChange(
            candidate,
            oldStageName,
            stageName,
            job
          );
        } catch (timelineError) {
          console.error("Failed to log timeline entry:", timelineError);
        }
      }
    } catch (error) {
      console.error("Error updating candidate stage:", error);
      showError(`Error updating candidate stage: ${error.message}`);

      // Revert optimistic update on error
      setAllCandidates(allCandidates);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? candidate : c))
      );
    }

    setActiveId(null);
    setDraggedCandidate(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedCandidate(null);
  };

  // Utility functions
  const handleStageChange = async (candidateId, newStage) => {
    console.log(
      `🔄 Stage change requested: Candidate ${candidateId} -> ${newStage}`
    );

    // Find candidate info for logging and UI updates
    const candidate = allCandidates.find((c) => c.id === candidateId);
    if (!candidate) {
      showError("Candidate not found");
      return;
    }

    const job = jobs.find((j) => j.id === candidate?.jobId);
    const stageName = stages.find((s) => s.id === newStage)?.name || newStage;
    const oldStageName =
      stages.find((s) => s.id === candidate?.stage)?.name || candidate?.stage;

    // Optimistic update - immediately update local state
    const updatedCandidate = { ...candidate, stage: newStage };
    const updatedAllCandidates = allCandidates.map((c) =>
      c.id === candidateId ? updatedCandidate : c
    );
    setAllCandidates(updatedAllCandidates);

    // Also update paginated candidates if it contains this candidate
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? updatedCandidate : c))
    );

    try {
      // Update candidate stage in IndexedDB
      await dbHelpers.updateCandidate(candidateId, { stage: newStage });

      console.log(
        `✅ Successfully updated candidate ${candidateId} to stage ${newStage} in IndexedDB`
      );

      // Show success toast
      showSuccess(`${candidate?.name || "Candidate"} moved to ${stageName}`);

      // Log to timeline (non-blocking)
      if (candidate && job) {
        try {
          await dbHelpers.logStageChange(
            candidate,
            oldStageName,
            stageName,
            job
          );
          console.log("📝 Timeline entry created for stage change");
        } catch (timelineError) {
          console.error("Failed to log timeline entry:", timelineError);
        }
      }
    } catch (error) {
      console.error("❌ Error updating candidate stage:", error);
      showError(`Error updating candidate stage: ${error.message}`);

      // Revert optimistic update on error
      setAllCandidates(allCandidates);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? candidate : c))
      );
    }
  };

  const handleCreateCandidate = async (candidateData) => {
    // Create temporary ID for optimistic update
    const tempId = Date.now();

    try {
      // Create candidate object for optimistic update
      const newCandidate = {
        id: tempId,
        name: candidateData.name,
        email: candidateData.email,
        jobId: candidateData.jobId,
        stage: candidateData.stage,
        currentStageId: candidateData.stage,
        phone: "",
        resumeUrl: null,
        createdAt: new Date(),
        appliedDate: new Date(),
      };

      // Optimistic update - add to local state immediately
      setAllCandidates((prev) => [newCandidate, ...prev]);

      // If the new candidate should appear in current filtered view, add it
      const shouldShowInCurrentView =
        (!jobId || candidateData.jobId === parseInt(jobId)) &&
        (!stageFilter || candidateData.stage === stageFilter) &&
        (!appliedSearch ||
          candidateData.name
            .toLowerCase()
            .includes(appliedSearch.toLowerCase()) ||
          candidateData.email
            .toLowerCase()
            .includes(appliedSearch.toLowerCase()));

      if (shouldShowInCurrentView) {
        setCandidates((prev) => [newCandidate, ...prev]);
      }

      // Create candidate object for database
      const candidateForDB = {
        name: candidateData.name,
        email: candidateData.email,
        jobId: candidateData.jobId,
        stage: candidateData.stage,
        currentStageId: candidateData.stage,
        phone: "",
        resumeUrl: null,
      };

      // Store in IndexedDB
      const realCandidateId = await dbHelpers.createCandidate(
        candidateForDB,
        1
      ); // Using userId 1 as default

      if (realCandidateId) {
        // Update the candidate with real ID
        const updatedCandidate = { ...newCandidate, id: realCandidateId };

        setAllCandidates((prev) =>
          prev.map((c) => (c.id === tempId ? updatedCandidate : c))
        );

        if (shouldShowInCurrentView) {
          setCandidates((prev) =>
            prev.map((c) => (c.id === tempId ? updatedCandidate : c))
          );
        }

        // Show success toast
        showSuccess(`New candidate ${candidateData.name} created`);

        // Log to timeline (non-blocking)
        const job = jobs.find((j) => j.id === candidateData.jobId);
        if (job) {
          try {
            await dbHelpers.addTimelineEntry({
              candidateId: realCandidateId,
              candidateName: candidateData.name,
              action: "created",
              details: `New candidate application received for ${job.title}`,
              timestamp: new Date(),
            });
            console.log("📝 Timeline entry created for candidate creation");
          } catch (timelineError) {
            console.error("Failed to log timeline entry:", timelineError);
          }
        }
      } else {
        throw new Error("Failed to create candidate in database");
      }
    } catch (error) {
      console.error("Error creating candidate:", error);
      showError(`Error creating candidate: ${error.message}`);

      // Revert optimistic update on error
      setAllCandidates((prev) => prev.filter((c) => c.id !== tempId));
      setCandidates((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch jobs first
        const jobsResponse = await fetch("/api/jobs");
        const jobsData = await jobsResponse.json();
        const allJobs = jobsData.data || jobsData;
        setJobs(allJobs);

        // If jobId is provided, find the specific job
        if (jobId) {
          const specificJob = allJobs.find((job) => job.id === parseInt(jobId));
          setCurrentJob(specificJob);
        }

        // Fetch candidates
        const candidatesResponse = await fetch("/api/candidates");
        const candidatesData = await candidatesResponse.json();
        const allCandidates = candidatesData.data || candidatesData;

        // Filter candidates by jobId if provided
        const filteredCandidates = jobId
          ? allCandidates.filter(
              (candidate) => candidate.jobId === parseInt(jobId)
            )
          : allCandidates;

        setCandidates(filteredCandidates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Kanban stages
  const stages = [
    { id: "applied", name: "Applied", color: "bg-blue-500" },
    { id: "screen", name: "Screening", color: "bg-yellow-500" },
    { id: "tech", name: "Technical", color: "bg-purple-500" },
    { id: "offer", name: "Offer", color: "bg-orange-500" },
    { id: "hired", name: "Hired", color: "bg-green-500" },
    { id: "rejected", name: "Rejected", color: "bg-red-500" },
  ];

  // Analytics state
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [allCandidates, setAllCandidates] = useState([]);

  // Calculate analytics data
  const getAnalyticsData = () => {
    // Pipeline data
    const pipelineData = stages.map((stage) => ({
      stage: stage.name,
      count: allCandidates.filter((c) => c.stage === stage.id).length,
      color: stage.color.replace("bg-", "#"),
    }));

    // Application trends (mock data - in real app would be based on application dates)
    const trendsData = [
      { month: "Jan", applications: 45 },
      { month: "Feb", applications: 52 },
      { month: "Mar", applications: 61 },
      { month: "Apr", applications: 58 },
      { month: "May", applications: 67 },
      { month: "Jun", applications: 74 },
    ];

    // Conversion rates
    const totalApplied = allCandidates.filter(
      (c) => c.stage === "applied"
    ).length;
    const totalHired = allCandidates.filter((c) => c.stage === "hired").length;
    const conversionRate =
      totalApplied > 0 ? ((totalHired / totalApplied) * 100).toFixed(1) : 0;

    return { pipelineData, trendsData, conversionRate };
  };

  const { pipelineData, trendsData, conversionRate } = getAnalyticsData();

  // Fetch candidates from IndexedDB
  const fetchCandidates = async () => {
    try {
      setLoading(true);

      // Fetch all candidates from IndexedDB for analytics and display
      const allCandidatesData = await dbHelpers.getAllCandidates();

      // Normalize stage field for compatibility (some might have 'currentStage', others 'stage')
      const normalizedCandidates = allCandidatesData.map((candidate) => ({
        ...candidate,
        stage: candidate.stage || candidate.currentStage || "applied", // Ensure stage field exists
      }));

      // Filter by jobId if provided
      const filteredAllCandidates = jobId
        ? normalizedCandidates.filter(
            (candidate) => candidate.jobId === parseInt(jobId)
          )
        : normalizedCandidates;

      setAllCandidates(filteredAllCandidates);

      // Apply search and stage filters
      let filteredCandidates = [...filteredAllCandidates];

      if (appliedSearch) {
        const searchLower = appliedSearch.toLowerCase();
        filteredCandidates = filteredCandidates.filter(
          (candidate) =>
            candidate.name?.toLowerCase().includes(searchLower) ||
            candidate.email?.toLowerCase().includes(searchLower)
        );
      }

      if (stageFilter) {
        filteredCandidates = filteredCandidates.filter(
          (candidate) => candidate.stage === stageFilter
        );
      }

      // Apply pagination
      const totalCandidates = filteredCandidates.length;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCandidates = filteredCandidates.slice(
        startIndex,
        endIndex
      );

      setCandidates(paginatedCandidates);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch candidates from IndexedDB:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs for displaying job titles
  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs?pageSize=100");
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs(); // Fetch jobs on component mount
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, appliedSearch, stageFilter, jobId]);

  // Group candidates by stage for kanban view (use allCandidates for full dataset)
  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = allCandidates.filter(
      (candidate) => candidate.stage === stage.id
    );
    return acc;
  }, {});

  // Debug logging
  console.log("All Candidates data:", allCandidates.length, "candidates");
  console.log("Sample candidate data structure:", allCandidates[0]);
  console.log(
    "Candidates by stage:",
    Object.keys(candidatesByStage).map((stageId) => ({
      stage: stageId,
      count: candidatesByStage[stageId].length,
      candidates: candidatesByStage[stageId].map((c) => ({
        name: c.name,
        stage: c.stage,
        currentStageId: c.currentStageId,
      })),
    }))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-impact font-black uppercase text-primary-500 dark:text-primary-400 leading-none tracking-tight">
                {currentJob ? `${currentJob.title} - Candidates` : "Candidates"}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {currentJob
                  ? `Candidates who applied for ${currentJob.title}`
                  : "Manage candidate pipeline • GET /candidates?search=&stage=&page="}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                ← Dashboard
              </Link>
              {currentJob && (
                <Link
                  to="/candidates"
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  All Candidates
                </Link>
              )}
              <div className="flex rounded-md border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === "kanban"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  List
                </button>
              </div>
              <CreateCandidateButton
                onCreate={handleCreateCandidate}
                jobs={jobs}
                defaultJobId={jobId}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Candidate Analytics
              </h2>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <ChevronDown
                  className={`w-4 h-4 mr-1 transition-transform ${
                    showAnalytics ? "rotate-180" : ""
                  }`}
                />
                {showAnalytics ? "Hide" : "Show"} Analytics
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 p-6 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Total Candidates
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {allCandidates.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg transition-colors duration-200">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 p-6 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Active Pipeline
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {
                        allCandidates.filter(
                          (c) => !["hired", "rejected"].includes(c.stage)
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg transition-colors duration-200">
                    <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 p-6 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Hired
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {allCandidates.filter((c) => c.stage === "hired").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg transition-colors duration-200">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 p-6 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {conversionRate}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg transition-colors duration-200">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pipeline Chart */}
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 p-6 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Candidate Pipeline
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-600"
                    />
                    <XAxis
                      dataKey="stage"
                      tick={{ fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      axisLine={{ stroke: "currentColor" }}
                      tickLine={{ stroke: "currentColor" }}
                    />
                    <YAxis
                      tick={{ fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      axisLine={{ stroke: "currentColor" }}
                      tickLine={{ stroke: "currentColor" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg)",
                        border: "1px solid var(--tooltip-border)",
                        borderRadius: "8px",
                        color: "var(--tooltip-text)",
                      }}
                      className="[--tooltip-bg:theme(colors.white)] dark:[--tooltip-bg:theme(colors.gray.800)] [--tooltip-border:theme(colors.gray.200)] dark:[--tooltip-border:theme(colors.gray.700)] [--tooltip-text:theme(colors.gray.900)] dark:[--tooltip-text:theme(colors.white)]"
                    />
                    <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Application Trends */}
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 p-6 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Application Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendsData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-600"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      axisLine={{ stroke: "currentColor" }}
                      tickLine={{ stroke: "currentColor" }}
                    />
                    <YAxis
                      tick={{ fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      axisLine={{ stroke: "currentColor" }}
                      tickLine={{ stroke: "currentColor" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg)",
                        border: "1px solid var(--tooltip-border)",
                        borderRadius: "8px",
                        color: "var(--tooltip-text)",
                      }}
                      className="[--tooltip-bg:theme(colors.white)] dark:[--tooltip-bg:theme(colors.gray.800)] [--tooltip-border:theme(colors.gray.200)] dark:[--tooltip-border:theme(colors.gray.700)] [--tooltip-text:theme(colors.gray.900)] dark:[--tooltip-text:theme(colors.white)]"
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#0d9488"
                      strokeWidth={2}
                      dot={{ fill: "#0d9488", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
                Search (Press Enter)
              </label>
              <input
                type="text"
                placeholder="Search candidates... (Press Enter to search)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
                Stage
              </label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <option value="">All Stages</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  handleClearSearch();
                  setStageFilter("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 transition-colors duration-200">
            <div className="flex">
              <div className="text-red-400 dark:text-red-300">⚠️</div>
              <div className="ml-3">
                <h3 className="text-hero font-impact font-black uppercase text-primary-500 dark:text-primary-400 leading-none tracking-tight">
                  Error loading candidates
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === "kanban" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <KanbanView
              stages={stages}
              candidatesByStage={candidatesByStage}
              jobs={jobs}
              onStageChange={handleStageChange}
            />
            <DragOverlay>
              {activeId && draggedCandidate ? (
                <CandidateCard
                  candidate={draggedCandidate}
                  stages={stages}
                  jobs={jobs}
                  onStageChange={handleStageChange}
                  isDragOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <ListView
            candidates={candidates}
            stages={stages}
            jobs={jobs}
            onStageChange={handleStageChange}
          />
        )}
      </div>
    </div>
  );
};

// Kanban Board View Component
const KanbanView = React.memo(
  ({ stages, candidatesByStage, jobs, onStageChange }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stages.map((stage) => (
          <DroppableColumn
            key={stage.id}
            stage={stage}
            candidatesByStage={candidatesByStage}
            jobs={jobs}
            onStageChange={onStageChange}
            stages={stages}
          />
        ))}
      </div>
    );
  }
);

// Droppable Column Component
const DroppableColumn = React.memo(
  ({ stage, candidatesByStage, jobs, onStageChange, stages }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: stage.id,
    });

    const candidates = candidatesByStage[stage.id] || [];
    const candidateIds = candidates.map((c) => c.id);

    return (
      <div
        ref={setNodeRef}
        className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-4 transition-all duration-300 ease-in-out min-h-[400px] flex flex-col transform ${
          isOver
            ? "bg-gray-200 dark:bg-gray-800 ring-2 ring-primary-300 dark:ring-primary-600 scale-105 shadow-lg"
            : "hover:shadow-md"
        }`}
      >
        <div className="flex items-center mb-4">
          <div
            className={`w-3 h-3 rounded-full ${stage.color} mr-2 transition-all duration-200`}
          ></div>
          <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
            {stage.name}
          </h3>
          <span
            className={`ml-auto bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300 transition-all duration-200 ${
              isOver
                ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 transform scale-110"
                : ""
            }`}
          >
            {candidates.length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <SortableContext
            items={candidateIds}
            strategy={verticalListSortingStrategy}
          >
            {candidates.map((candidate, index) => (
              <DraggableCandidateCard
                key={candidate.id}
                candidate={candidate}
                stages={stages}
                jobs={jobs}
                onStageChange={onStageChange}
              />
            ))}
          </SortableContext>

          {/* Empty state with drop hint */}
          {candidates.length === 0 && (
            <div
              className={`text-center py-8 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 ${
                isOver
                  ? "border-primary-400 dark:border-primary-500 text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 transform scale-105"
                  : "hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <p className="text-sm transition-all duration-200">
                {isOver ? "✨ Drop candidate here" : "No candidates"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// List View Component
const ListView = ({ candidates, stages, jobs, onStageChange }) => {
  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-200">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
          Candidates ({candidates.length} total)
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {candidates.length > 0 ? (
          candidates.map((candidate) => {
            const candidateJob = jobs.find((job) => job.id === candidate.jobId);
            return (
              <div
                key={candidate.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {candidate.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {candidate.name}
                      </Link>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {candidate.email}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Applied to: {candidateJob?.title || "Unknown Job"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <select
                      value={candidate.stage}
                      onChange={(e) =>
                        onStageChange(candidate.id, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>

                    <Link
                      to={`/candidates/${candidate.id}/timeline`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Store referrer context based on current URL
                        const urlParams = new URLSearchParams(
                          window.location.search
                        );
                        const jobId = urlParams.get("jobId");

                        if (jobId) {
                          // User is viewing job-specific candidates
                          sessionStorage.setItem(
                            "candidateReferrer",
                            JSON.stringify({ type: "job", jobId })
                          );
                        } else {
                          // User is viewing general candidates
                          sessionStorage.setItem(
                            "candidateReferrer",
                            JSON.stringify({ type: "general" })
                          );
                        }
                      }}
                    >
                      Timeline
                    </Link>

                    {candidateJob && (
                      <Link
                        to={`/jobs/${candidateJob.id}/flow`}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                      >
                        Job Flow
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">
              👥
            </div>
            <h3 className="text-xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-2">
              No candidates found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Candidates will appear here as they apply to jobs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Draggable Candidate Card Wrapper
const DraggableCandidateCard = React.memo(
  ({ candidate, stages, jobs, onStageChange }) => {
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
      transition: transition || "transform 300ms ease-in-out",
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 1000 : "auto",
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative transition-all duration-300 ease-in-out ${
          isDragging ? "rotate-2 scale-105 shadow-2xl" : "hover:scale-102"
        }`}
      >
        <CandidateCard
          candidate={candidate}
          stages={stages}
          jobs={jobs}
          onStageChange={onStageChange}
          isDraggable
          isDragging={isDragging}
          dragAttributes={attributes}
          dragListeners={listeners}
        />
      </div>
    );
  }
);

// Candidate Card Component
const CandidateCard = React.memo(
  ({
    candidate,
    stages,
    jobs,
    onStageChange,
    isDraggable = false,
    isDragOverlay = false,
    isDragging = false,
    dragAttributes = {},
    dragListeners = {},
  }) => {
    const candidateJob = jobs.find((job) => job.id === candidate.jobId);
    const currentStageInfo = stages.find((s) => s.id === candidate.stage);

    return (
      <div
        className={`bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-800 transition-all duration-300 ease-in-out relative transform hover:scale-[1.02] ${
          isDragOverlay
            ? "shadow-lg rotate-3 scale-105"
            : "hover:shadow-md dark:hover:shadow-lg"
        } ${
          isDragging ? "shadow-2xl ring-2 ring-blue-300 dark:ring-blue-600" : ""
        }`}
      >
        {/* Draggable Upper Half */}
        <div
          {...dragAttributes}
          {...dragListeners}
          className={`p-4 pb-2 cursor-grab active:cursor-grabbing ${
            isDraggable ? "hover:bg-gray-50 dark:hover:bg-gray-900/50" : ""
          }`}
        >
          {/* Drag indicator */}
          {isDraggable && (
            <div className="absolute top-2 right-2 text-gray-400 opacity-50">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </div>
          )}

          {/* Header with Name */}
          <div className="flex items-center justify-between mb-3">
            <Link
              to={`/candidates/${candidate.id}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm truncate flex-1"
              title={candidate.name}
              onClick={(e) => e.stopPropagation()}
            >
              {candidate.name}
            </Link>
          </div>

          {/* Email */}
          <div
            className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate transition-colors duration-200"
            title={candidate.email}
          >
            {candidate.email}
          </div>

          {/* Job Title */}
          {candidateJob && (
            <div
              className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3 truncate transition-colors duration-200"
              title={candidateJob.title}
            >
              {candidateJob.title}
            </div>
          )}

          {/* Current Stage Badge */}
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 transform ${
                candidate.stage === "applied"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : candidate.stage === "screen"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : candidate.stage === "tech"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  : candidate.stage === "offer"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                  : candidate.stage === "hired"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {currentStageInfo?.name || candidate.stage}
            </span>
          </div>
        </div>

        {/* Clickable Lower Half */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {/* Stage Dropdown - only show in list view */}
            {!isDraggable && stages && (
              <select
                value={candidate.stage}
                onChange={(e) => onStageChange(candidate.id, e.target.value)}
                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            )}

            {/* Action Links */}
            <div className="flex space-x-2 ml-auto">
              <Link
                to={`/candidates/${candidate.id}/timeline`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 whitespace-nowrap hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  // Store referrer context based on current URL
                  const currentUrl = window.location.href;
                  const urlParams = new URLSearchParams(window.location.search);
                  const jobId = urlParams.get("jobId");

                  if (jobId) {
                    // User is viewing job-specific candidates
                    sessionStorage.setItem(
                      "candidateReferrer",
                      JSON.stringify({ type: "job", jobId })
                    );
                  } else {
                    // User is viewing general candidates
                    sessionStorage.setItem(
                      "candidateReferrer",
                      JSON.stringify({ type: "general" })
                    );
                  }
                }}
              >
                Timeline
              </Link>
              {candidateJob && (
                <Link
                  to={`/jobs/${candidateJob.id}/flow`}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 whitespace-nowrap hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Flow
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CandidatesPage;
