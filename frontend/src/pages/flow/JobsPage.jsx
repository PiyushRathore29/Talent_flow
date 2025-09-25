import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { dbHelpers } from "../../lib/database.js";
import { useToast } from "../../components/Toast.jsx";
import { jobsAPI } from "../../lib/api/indexedDBClient";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessments, setAssessments] = useState([]);

  // Toast hook
  const { showSuccess, showError, showWarning, ToastContainer } = useToast();

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState(""); // This will trigger the actual search
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("title");

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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

  // Load assessments to check which jobs have assessments
  const loadAssessments = useCallback(async () => {
    try {
      const { db } = await import("../../lib/database.js");
      const allAssessments = await db.assessments.toArray();
      setAssessments(allAssessments);
    } catch (error) {
      console.error("Failed to load assessments:", error);
    }
  }, []);

  // Check if a job has an assessment
  const hasAssessment = useCallback(
    (jobId) => {
      return assessments.some(
        (assessment) => assessment.jobId === parseInt(jobId)
      );
    },
    [assessments]
  );

  // Fetch jobs using MSW API with IndexedDB fallback
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(appliedSearch && { search: appliedSearch }),
        ...(statusFilter && { status: statusFilter }),
        ...(sortBy && { sort: sortBy }),
      });

      // Try MSW API first, fallback to IndexedDB
      try {
        const response = await fetch(`/api/jobs?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setJobs(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      } catch (apiError) {
        console.warn(
          "MSW API failed, using IndexedDB fallback:",
          apiError.message
        );
        // Fallback to IndexedDB
        const data = await jobsAPI.getAll({
          page: currentPage,
          pageSize: pageSize,
          ...(appliedSearch && { search: appliedSearch }),
          ...(statusFilter && { status: statusFilter }),
          ...(sortBy && { sort: sortBy }),
        });
        setJobs(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, appliedSearch, statusFilter, sortBy, pageSize]);

  // Load jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
    loadAssessments();
  }, [fetchJobs, loadAssessments]);

  // Fetch all jobs for reorder mode
  const fetchAllJobs = useCallback(async () => {
    try {
      // Use IndexedDB directly for reorder mode to get consistent ordering
      const jobs = await dbHelpers.getJobsOrderedByOrder();
      console.log("🗄️ Fetched jobs for reorder mode:", jobs);
      setAllJobs(jobs);
    } catch (err) {
      console.error("Failed to fetch all jobs from IndexedDB:", err);
      // Fallback to API if IndexedDB fails
      try {
        const data = await jobsAPI.getAll({ pageSize: 1000, sort: "order" });
        setAllJobs(data.data || []);
      } catch (apiErr) {
        console.error("API fallback also failed:", apiErr);
      }
    }
  }, []);

  // Load all jobs when entering reorder mode
  useEffect(() => {
    if (isReorderMode) {
      fetchAllJobs();
    }
  }, [isReorderMode, fetchAllJobs]);

  // Create new job
  const handleCreateJob = async (jobData) => {
    try {
      // Try MSW API first, fallback to IndexedDB
      try {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create job: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn(
          "MSW API failed, using IndexedDB fallback:",
          apiError.message
        );
        // Fallback to IndexedDB
        await jobsAPI.create(jobData);
      }

      await fetchJobs(); // Refresh list
      setShowCreateModal(false);

      // Show success toast
      showSuccess(`Job "${jobData.title}" created successfully! 🎉`, 5000);
    } catch (err) {
      console.error("Error creating job:", err);
      showError("Failed to create job: " + err.message, 6000);
    }
  };

  // Update job
  const handleUpdateJob = async (jobId, updates) => {
    try {
      // Try MSW API first, fallback to IndexedDB
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`Failed to update job: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn(
          "MSW API failed, using IndexedDB fallback:",
          apiError.message
        );
        // Fallback to IndexedDB
        await jobsAPI.update(jobId, updates);
      }

      await fetchJobs(); // Refresh list
      setEditingJob(null);

      // Show success toast
      showSuccess(
        `Job "${updates.title || "Job"}" updated successfully! ✅`,
        4000
      );
    } catch (err) {
      console.error("Error updating job:", err);
      showError("Failed to update job: " + err.message, 6000);
    }
  };

  // Handle job reordering with drag and drop
  const handleReorderJobs = async (newJobsOrder) => {
    try {
      console.log("🔄 Starting job reorder:", newJobsOrder);

      // Update local state immediately for smooth UX
      setAllJobs(newJobsOrder);

      // Prepare jobs with new order values
      const jobsWithNewOrders = newJobsOrder.map((job, index) => ({
        id: job.id,
        order: index + 1,
      }));

      console.log("📋 Jobs with new orders:", jobsWithNewOrders);

      // Save to IndexedDB directly
      await dbHelpers.reorderJobs(jobsWithNewOrders);
      console.log("✅ Jobs reordered in IndexedDB successfully");

      // Show success toast
      showSuccess(`Jobs reordered successfully! ✨ New order saved.`, 4000);

      // Also try to update via API for external sync (non-blocking)
      try {
        const updatePromises = newJobsOrder.map((job, index) => {
          const newOrder = index + 1;
          const fromOrder =
            job.order || allJobs.findIndex((j) => j.id === job.id) + 1;

          return jobsAPI.reorder(job.id, { fromOrder, toOrder: newOrder });
        });

        await Promise.all(updatePromises);
        console.log("✅ Jobs also updated via API");
      } catch (apiError) {
        console.warn("⚠️ API update failed (non-critical):", apiError);
        showWarning(
          "Jobs reordered locally, but sync to server failed. Changes may not persist.",
          6000
        );
      }

      // Refresh the main jobs list
      await fetchJobs();
    } catch (err) {
      console.error("❌ Error reordering jobs:", err);
      showError("Failed to save job order: " + err.message, 6000);
      // Reload to revert changes on error
      fetchAllJobs();
    }
  };

  // Auto-scroll handling with ref to avoid state issues
  const autoScrollIntervalRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Auto-scroll function
  const handleAutoScroll = (clientY) => {
    // Only auto-scroll if we're actively dragging
    if (!isDraggingRef.current) return;

    const scrollZone = 100; // Increased pixels from edge to trigger scroll
    const scrollSpeed = 12; // Increased pixels per scroll
    const viewportHeight = window.innerHeight;

    // Clear existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Check if we need to scroll up
    if (clientY < scrollZone) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (!isDraggingRef.current) {
          clearInterval(autoScrollIntervalRef.current);
          autoScrollIntervalRef.current = null;
          return;
        }
        window.scrollBy(0, -scrollSpeed);
      }, 16); // Faster for smoother scroll
    }
    // Check if we need to scroll down
    else if (clientY > viewportHeight - scrollZone) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (!isDraggingRef.current) {
          clearInterval(autoScrollIntervalRef.current);
          autoScrollIntervalRef.current = null;
          return;
        }
        window.scrollBy(0, scrollSpeed);
      }, 16); // Faster for smoother scroll
    }
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    isDraggingRef.current = false;
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  // Global mouse event handlers for better drag tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingRef.current && isReorderMode) {
        handleAutoScroll(e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        stopAutoScroll();
      }
    };

    // Add global listeners
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isReorderMode]);

  // Drag and drop handlers
  const handleDragStart = (e, job, index) => {
    isDraggingRef.current = true;
    setDraggedItem({ job, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ jobId: job.id, sourceIndex: index })
    );
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(targetIndex);

    // Only handle auto-scroll if we're actively dragging
    if (isDraggingRef.current) {
      handleAutoScroll(e.clientY);
    }
  };

  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the entire container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
      // Don't stop auto-scroll here as we might still be dragging
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { sourceIndex } = dragData;

      if (!draggedItem || sourceIndex === targetIndex) {
        setDraggedItem(null);
        setDragOverIndex(null);
        return;
      }

      const currentJobs = [...allJobs];

      // Remove the dragged item from its original position
      const [draggedJob] = currentJobs.splice(sourceIndex, 1);

      // Insert it at the target position
      currentJobs.splice(targetIndex, 0, draggedJob);

      // Update the jobs order
      handleReorderJobs(currentJobs);
    } catch (error) {
      console.error("Drop error:", error);
    } finally {
      setDraggedItem(null);
      setDragOverIndex(null);
      stopAutoScroll();
    }
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDragOverIndex(null);
    stopAutoScroll();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-wide mb-2">
                Jobs
              </h1>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide">
                Manage job postings • Search, filter, and organize your open
                positions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-all duration-200 tracking-wide"
              >
                ← Dashboard
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200 tracking-wide"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mb-2">
                Search (Press Enter)
              </label>
              <input
                type="text"
                placeholder="Search jobs... (Press Enter to search)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                disabled={isReorderMode}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={isReorderMode}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                disabled={isReorderMode}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="title">Title</option>
                <option value="updatedAt">Order</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setIsReorderMode(!isReorderMode)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 tracking-wide ${
                  isReorderMode
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isReorderMode ? "✓ Done Reordering" : "⚡ Reorder Jobs"}
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  handleClearSearch();
                  setStatusFilter("");
                  setSortBy("title");
                }}
                disabled={isReorderMode}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-all duration-200 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-small font-impact font-black uppercase text-red-800 dark:text-red-300 leading-none tracking-tight">
                  ERROR LOADING JOBS
                </h3>
                <div className="mt-2 text-small font-impact font-black uppercase text-red-700 dark:text-red-400 leading-none tracking-tight">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">
              {isReorderMode ? (
                <>🔄 Reorder Mode - Drag & Drop Jobs ({allJobs.length} Total)</>
              ) : (
                <>Jobs ({jobs.length} Results)</>
              )}
            </h2>
            {isReorderMode && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 tracking-wide">
                Drag and drop jobs to reorder them. Changes are saved
                automatically.
              </p>
            )}
          </div>

          <div
            className={`${
              isReorderMode
                ? "space-y-2 p-4"
                : "divide-y divide-gray-200 dark:divide-gray-800"
            }`}
          >
            {isReorderMode ? (
              // Reorder Mode - Kanban Style with Drop Zones
              <div className="p-4">
                {allJobs.length > 0 ? (
                  <div className="space-y-2">
                    {/* Drop zone at the top */}
                    <div
                      onDragOver={(e) => handleDragOver(e, 0)}
                      onDragEnter={(e) => handleDragEnter(e, 0)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 0)}
                      className={`h-12 border-2 border-dashed rounded-lg transition-all duration-200 flex items-center justify-center ${
                        dragOverIndex === 0
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {dragOverIndex === 0 && (
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          Drop here to place at position 1
                        </span>
                      )}
                    </div>

                    {allJobs.map((job, index) => (
                      <div key={job.id}>
                        {/* Job Item */}
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, job, index)}
                          onDragEnd={handleDragEnd}
                          className={`p-4 bg-white dark:bg-gray-800 border-2 rounded-lg cursor-move hover:shadow-md transition-all duration-200 ${
                            draggedItem?.job?.id === job.id
                              ? "opacity-50 transform rotate-2 shadow-lg border-blue-400"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span
                                  className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                                  title="Drag to reorder"
                                >
                                  ⋮⋮
                                </span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
                                  {job.title}
                                </h3>
                                <span
                                  className={`px-3 py-1 text-xs font-medium rounded-full tracking-wide ${
                                    job.status === "active"
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 tracking-wide">
                                Created:{" "}
                                {new Date(job.createdAt).toLocaleDateString()} •
                                ID: {job.id}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Drop zone after each item */}
                        <div
                          onDragOver={(e) => handleDragOver(e, index + 1)}
                          onDragEnter={(e) => handleDragEnter(e, index + 1)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index + 1)}
                          className={`h-12 border-2 border-dashed rounded-lg transition-all duration-200 flex items-center justify-center ${
                            dragOverIndex === index + 1
                              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          {dragOverIndex === index + 1 && (
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                              Drop here to place at position {index + 2}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide mb-2">
                      No Jobs to Reorder
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 tracking-wide">
                      Create some jobs first to use the reorder feature.
                    </p>
                  </div>
                )}
              </div>
            ) : // Normal Mode - Filtered Jobs
            jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => (window.location.href = `/jobs/${job.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors leading-relaxed tracking-wide">
                          {job.title}
                        </h3>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full leading-relaxed tracking-wide ${
                            job.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide">
                          Order: {job.order}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide">
                          Created:{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        {job.tags && job.tags.length > 0 && (
                          <>
                            <span className="text-gray-400 dark:text-gray-600">
                              •
                            </span>
                            <div className="flex space-x-1">
                              {job.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded tracking-wide"
                                >
                                  {tag}
                                </span>
                              ))}
                              {job.tags.length > 3 && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed tracking-wide">
                                  +{job.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/assessments/${job.id}`}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg tracking-wide ${
                          hasAssessment(job.id)
                            ? "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                        }`}
                      >
                        {hasAssessment(job.id)
                          ? "✓ Assessment Created"
                          : "Assessment Builder"}
                      </Link>
                      <Link
                        to={`/jobs/${job.id}/flow`}
                        className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border border-green-200 dark:border-green-800 rounded-lg tracking-wide"
                      >
                        Flow Editor
                      </Link>
                      <Link
                        to={`/candidates?jobId=${job.id}`}
                        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 tracking-wide"
                      >
                        View Candidates
                      </Link>
                      <button
                        onClick={() => setEditingJob(job)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 tracking-wide"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide mb-2">
                  No Jobs Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed tracking-wide mb-4">
                  Get started by creating your first job posting.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 tracking-wide"
                >
                  Create Job
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {!isReorderMode && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setCurrentPage(Math.max(1, currentPage - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed tracking-wide transition-all duration-200"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => {
                  setCurrentPage(Math.min(totalPages, currentPage + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed tracking-wide transition-all duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Create/Edit Job Modal */}
      {(showCreateModal || editingJob) && (
        <JobModal
          job={editingJob}
          onSave={
            editingJob
              ? (updates) => handleUpdateJob(editingJob.id, updates)
              : handleCreateJob
          }
          onClose={() => {
            setShowCreateModal(false);
            setEditingJob(null);
          }}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

// Job Modal Component
const JobModal = ({ job, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    status: job?.status || "active",
    tags: job?.tags?.join(", ") || "",
    description: job?.description || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Job title is required");
      return;
    }

    const jobData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    onSave(jobData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-black rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {job ? "Edit Job" : "Create New Job"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              placeholder="e.g., Senior React Developer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              placeholder="React, JavaScript, TypeScript"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              placeholder="Job description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
            >
              {job ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobsPage;
