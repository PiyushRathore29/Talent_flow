import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { AnimatePresence } from "framer-motion";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "../../contexts/AuthContext";
import { dbHelpers } from "../../lib/database";
const {
  createJobStage,
  updateJobStage,
  getJobStages,
  deleteJobStageByNodeId,
  createAssessment,
  createAssessmentQuestion,
  getQuestionsByAssessment,
} = dbHelpers;
import EmployerDashboard from "../../components/EmployerDashboard";
import DashboardSidebar from "../../components/DashboardSidebar";
import JobModal from "../../components/JobModal";
import StageModal from "../../components/StageModal";
import AssessmentModal from "../../components/AssessmentModal";
import ResumeSidebar from "../../components/ResumeSidebar";
import { Plus, Loader } from "lucide-react";

const EmployerDashboardPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    jobs,
    jobOrder,
    loading,
    createJob,
    updateJob,
    updateJobFlow,
    deleteJob,
    reorderJobs,
  } = useJobs();

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [stageEdge, setStageEdge] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [resumeSidebarOpen, setResumeSidebarOpen] = useState(false);
  const [activeResume, setActiveResume] = useState(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [assessmentStageId, setAssessmentStageId] = useState(null);

  const activeJob = jobs[jobId];

  useEffect(() => {
    if (!loading && !activeJob && jobOrder.length > 0) {
      navigate(`/dashboard/employer/${jobOrder[0]}`, { replace: true });
    } else if (!loading && jobOrder.length === 0 && jobId !== "overview") {
      navigate("/dashboard/employer/overview", { replace: true });
    }
  }, [jobId, jobs, activeJob, navigate, jobOrder, loading]);

  const handleJobSelect = (id) => {
    navigate(`/dashboard/employer/${id}`);
  };

  const handleOpenJobModal = (jobDetails = null) => {
    setEditingJob(jobDetails);
    setIsJobModalOpen(true);
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
      } else {
        const newJob = await createJob(jobData);
        navigate(`/dashboard/employer/${newJob.id}`);
      }
      handleCloseJobModal();
    } catch (error) {
      console.error("Failed to save job:", error);
      // TODO: Show error message to user
    }
  };

  const handleArchiveJob = async (id) => {
    try {
      const job = jobs[id];
      const newStatus = job.details.status === "Active" ? "Archived" : "Active";
      await updateJob(id, { status: newStatus });
    } catch (error) {
      console.error("Failed to archive job:", error);
    }
  };

  const handleDeleteJob = async (idToDelete) => {
    try {
      await deleteJob(idToDelete);
      if (jobId === idToDelete) {
        if (jobOrder.length > 1) {
          const remainingJobs = jobOrder.filter(
            (id) => id !== idToDelete.toString()
          );
          navigate(`/dashboard/employer/${remainingJobs[0]}`, {
            replace: true,
          });
        } else {
          navigate("/dashboard/employer/overview", { replace: true });
        }
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const handleReorderJobs = useCallback(
    (newOrder) => {
      reorderJobs(newOrder);
    },
    [reorderJobs]
  );

  const onNodesChange = useCallback(
    (changes) => {
      if (!activeJob) return;

      const updatedNodes = applyNodeChanges(changes, activeJob.nodes);
      updateJobFlow(jobId, { nodes: updatedNodes, edges: activeJob.edges });
    },
    [jobId, activeJob, updateJobFlow]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      if (!activeJob) return;

      const updatedEdges = applyEdgeChanges(changes, activeJob.edges);
      updateJobFlow(jobId, { nodes: activeJob.nodes, edges: updatedEdges });
    },
    [jobId, activeJob, updateJobFlow]
  );

  const handleCandidateMove = useCallback(
    async (sourceNodeId, candidateId, targetNodeId) => {
      if (!activeJob || sourceNodeId === targetNodeId) return;

      const sourceNode = activeJob.nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode || !sourceNode.data.candidates) return;

      const candidateToMove = sourceNode.data.candidates.find(
        (c) => c.id === candidateId
      );
      if (!candidateToMove) return;

      try {
        // Update the candidate's stage in the database
        await dbHelpers.moveCandidateToStage(
          candidateId,
          targetNodeId,
          user?.id,
          `Moved from ${sourceNode.data.stage || "stage"} to ${
            activeJob.nodes.find((n) => n.id === targetNodeId)?.data.stage ||
            "stage"
          }`
        );

        // Update the UI
        let totalApplicants = 0;
        const newNodes = activeJob.nodes.map((node) => {
          let newNode = { ...node };
          if (node.id === sourceNodeId) {
            newNode.data = {
              ...node.data,
              candidates: node.data.candidates.filter(
                (c) => c.id !== candidateId
              ),
            };
          }
          if (node.id === targetNodeId) {
            newNode.data = {
              ...node.data,
              candidates: [...(node.data.candidates || []), candidateToMove],
            };
          }
          if (newNode.type === "candidate" && newNode.data.candidates) {
            totalApplicants += newNode.data.candidates.length;
          }
          return newNode;
        });

        const jobNodeIndex = newNodes.findIndex((n) => n.type === "job");
        if (jobNodeIndex > -1) {
          newNodes[jobNodeIndex] = {
            ...newNodes[jobNodeIndex],
            data: {
              ...newNodes[jobNodeIndex].data,
              applicants: totalApplicants,
            },
          };
        }

        updateJobFlow(jobId, { nodes: newNodes, edges: activeJob.edges });
        updateJob(jobId, { applicants: totalApplicants });
      } catch (error) {
        console.error("Failed to move candidate in database:", error);
        // TODO: Show error message to user
      }
    },
    [jobId, activeJob, updateJobFlow, updateJob, user]
  );

  const handleMoveToNextStage = useCallback(
    async (candidateId, currentStageId) => {
      if (!activeJob) return;
      const connectingEdge = activeJob.edges.find(
        (edge) => edge.source === currentStageId
      );
      if (connectingEdge) {
        await handleCandidateMove(
          currentStageId,
          candidateId,
          connectingEdge.target
        );
      }
    },
    [activeJob, handleCandidateMove]
  );

  const handleConnectStages = useCallback(
    (params) => {
      if (!activeJob) return;

      const newEdge = {
        id: `${params.source}-${params.target}`,
        ...params,
        type: "addStageEdge",
      };

      if (
        activeJob.edges.some(
          (e) => e.source === params.source && e.target === params.target
        )
      ) {
        return;
      }

      const updatedEdges = activeJob.edges.concat(newEdge);
      updateJobFlow(jobId, { nodes: activeJob.nodes, edges: updatedEdges });
    },
    [jobId, activeJob, updateJobFlow]
  );

  const handleSaveStage = useCallback(
    async ({ name, id, nodeType }) => {
      if (!activeJob) return;

      try {
        if (id) {
          // Editing existing stage
          // Update the visual node
          const updatedNodes = activeJob.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, stage: name } } : n
          );

          // Update the database stage
          const existingStages = await getJobStages(parseInt(jobId));
          const stageToUpdate = existingStages.find((s) => s.nodeId === id);
          if (stageToUpdate) {
            await updateJobStage(stageToUpdate.id, { name });
            console.log("Updated stage in database:", stageToUpdate.id);
          }

          // Update both the visual flow and persist to database
          updateJobFlow(jobId, { nodes: updatedNodes, edges: activeJob.edges });
        } else {
          // Adding new stage
          if (!stageEdge) {
            console.error("❌ No stageEdge found, cannot create stage");
            return;
          }

          const { source, target } = stageEdge;
          console.log("🚀 Creating new stage:", {
            name,
            nodeType,
            source,
            target,
          });

          const sourceNode = activeJob.nodes.find((n) => n.id === source);
          const xOffset = 320;
          const newNodeId = `job-${jobId}-stage-${Date.now()}`;
          console.log("📍 Generated node ID:", newNodeId);

          const newNode = {
            id: newNodeId,
            type: nodeType || "candidate", // Use the selected node type
            position: {
              x: sourceNode.position.x + xOffset,
              y: sourceNode.position.y,
            },
            data: {
              stage: name,
              candidates: [],
              assessment: nodeType === "assessment" ? null : undefined, // Initialize assessment field for assessment nodes
            },
          };
          console.log("🎯 Created visual node:", newNode);

          // Save stage to database
          console.log("📊 Fetching existing stages for job:", jobId);
          const existingStages = await getJobStages(parseInt(jobId));
          console.log("📋 Existing stages:", existingStages);

          const maxOrder =
            existingStages.length > 0
              ? Math.max(...existingStages.map((s) => s.order))
              : 0;
          console.log("📈 Max order found:", maxOrder);

          const stageData = {
            jobId: parseInt(jobId),
            name: name,
            order: maxOrder + 1,
            type: nodeType || "candidate",
            position: JSON.stringify(newNode.position),
            nodeId: newNodeId,
          };
          console.log("💾 Saving stage data to database:", stageData);

          const stageId = await createJobStage(stageData);
          console.log(
            "✅ Successfully created stage in database with ID:",
            stageId
          );

          // Verify the stage was saved by fetching it back
          const verifyStages = await getJobStages(parseInt(jobId));
          const savedStage = verifyStages.find((s) => s.id === stageId);
          if (savedStage) {
            console.log(
              "✅ VERIFICATION SUCCESS: Stage found in database:",
              savedStage
            );
          } else {
            console.error(
              "❌ VERIFICATION FAILED: Stage not found in database after creation!"
            );
          }

          const updatedNodes = activeJob.nodes
            .map((n) => {
              if (n.position.x >= newNode.position.x) {
                return {
                  ...n,
                  position: { ...n.position, x: n.position.x + xOffset },
                };
              }
              return n;
            })
            .concat(newNode);

          const updatedEdges = activeJob.edges
            .filter((e) => e.id !== stageEdge.id)
            .concat([
              {
                id: `${source}-${newNode.id}`,
                source,
                target: newNode.id,
                type: "addStageEdge",
              },
              {
                id: `${newNode.id}-${target}`,
                source: newNode.id,
                target,
                type: "addStageEdge",
              },
            ]);

          // Update both the visual flow and persist to database
          updateJobFlow(jobId, { nodes: updatedNodes, edges: updatedEdges });
          console.log("✅ Updated job flow with new stage");
        }
      } catch (error) {
        console.error("Failed to save stage:", error);
        // TODO: Show error message to user
      }

      setIsStageModalOpen(false);
      setEditingStage(null);
      setStageEdge(null);
    },
    [jobId, activeJob, stageEdge, updateJobFlow]
  );

  const handleOpenAddStageModal = useCallback(
    (edgeId) => {
      if (!activeJob) return;
      const edge = activeJob.edges.find((e) => e.id === edgeId);
      if (edge) {
        setStageEdge(edge);
        setEditingStage(null);
        setIsStageModalOpen(true);
      }
    },
    [activeJob]
  );

  const handleOpenEditStageModal = useCallback((stageId, stageName) => {
    setEditingStage({ id: stageId, name: stageName });
    setIsStageModalOpen(true);
  }, []);

  const handleDeleteStage = useCallback(
    async (stageId) => {
      if (!activeJob) return;

      const stageToDelete = activeJob.nodes.find((n) => n.id === stageId);

      if (
        stageToDelete.data.candidates &&
        stageToDelete.data.candidates.length > 0
      ) {
        alert("Cannot delete a stage that contains candidates.");
        return;
      }

      try {
        // Delete the stage from the database
        await deleteJobStageByNodeId(stageId);
        console.log("✅ Deleted stage from database:", stageId);

        const incomingEdge = activeJob.edges.find((e) => e.target === stageId);
        const outgoingEdge = activeJob.edges.find((e) => e.source === stageId);

        const remainingNodes = activeJob.nodes.filter((n) => n.id !== stageId);
        let remainingEdges = activeJob.edges.filter(
          (e) => e.source !== stageId && e.target !== stageId
        );

        if (incomingEdge && outgoingEdge) {
          remainingEdges.push({
            id: `${incomingEdge.source}-${outgoingEdge.target}`,
            source: incomingEdge.source,
            target: outgoingEdge.target,
            type: "addStageEdge",
          });
        }

        // Update both the visual flow and persist to database
        updateJobFlow(jobId, { nodes: remainingNodes, edges: remainingEdges });
        console.log("✅ Updated job flow after stage deletion");
      } catch (error) {
        console.error("Failed to delete stage:", error);
        // TODO: Show error message to user
      }
    },
    [jobId, activeJob, updateJobFlow]
  );

  const handleShowResume = (candidate) => {
    setActiveResume(candidate);
    setResumeSidebarOpen(true);
  };

  const handleCloseResume = () => {
    setResumeSidebarOpen(false);
  };

  // Assessment handlers
  const handleCreateAssessment = useCallback((stageId) => {
    setAssessmentStageId(stageId);
    setEditingAssessment(null);
    setIsAssessmentModalOpen(true);
  }, []);

  const handleEditAssessment = useCallback((stageId, assessment) => {
    setAssessmentStageId(stageId);
    setEditingAssessment(assessment);
    setIsAssessmentModalOpen(true);
  }, []);

  const handleViewResponses = useCallback(
    (assessment, candidate = null) => {
      // Navigate to assessment responses viewer
      const url = candidate
        ? `/assessment/${assessment.id}/responses?candidate=${candidate.id}`
        : `/assessment/${assessment.id}/responses`;
      navigate(url);
    },
    [navigate]
  );

  const handleCloseAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
    setEditingAssessment(null);
    setAssessmentStageId(null);
  };

  const handleSaveAssessment = async (assessmentData) => {
    try {
      console.log("Saving assessment:", assessmentData);
      console.log("Assessment stage ID:", assessmentStageId);
      console.log("User company ID:", user.companyId);

      // Separate questions from assessment data
      const { questions, ...assessmentInfo } = assessmentData;

      if (editingAssessment) {
        // Update existing assessment
        await dbHelpers.updateAssessment(editingAssessment.id, assessmentInfo);
        console.log("Updated existing assessment");

        // Delete existing questions and create new ones
        const existingQuestions = await dbHelpers.getQuestionsByAssessment(
          editingAssessment.id
        );
        for (const question of existingQuestions) {
          await dbHelpers.deleteAssessmentQuestion(question.id);
        }

        // Create new questions
        for (const question of questions) {
          await dbHelpers.createAssessmentQuestion({
            ...question,
            assessmentId: editingAssessment.id,
          });
        }

        // Update the node with the updated assessment
        const updatedNodes = activeJob.nodes.map((node) => {
          if (node.id === assessmentStageId) {
            return {
              ...node,
              data: {
                ...node.data,
                assessment: {
                  ...editingAssessment,
                  ...assessmentInfo,
                  questions,
                },
              },
            };
          }
          return node;
        });

        updateJobFlow(jobId, { nodes: updatedNodes, edges: activeJob.edges });
      } else {
        // Create new assessment
        const assessmentId = await dbHelpers.createAssessment({
          ...assessmentInfo,
          jobId: parseInt(jobId),
          stageId: assessmentStageId,
          companyId: user.companyId,
          createdById: user.id,
        });

        console.log("Created new assessment with ID:", assessmentId);

        // Create questions for the assessment
        for (const question of questions) {
          await dbHelpers.createAssessmentQuestion({
            ...question,
            assessmentId: assessmentId,
          });
        }

        console.log("Created questions for assessment");

        // Update the node with the new assessment
        const updatedNodes = activeJob.nodes.map((node) => {
          if (node.id === assessmentStageId) {
            return {
              ...node,
              data: {
                ...node.data,
                assessment: {
                  id: assessmentId,
                  ...assessmentInfo,
                  questions,
                  jobId: parseInt(jobId),
                  stageId: assessmentStageId,
                  companyId: user.companyId,
                  createdById: user.id,
                },
              },
            };
          }
          return node;
        });

        updateJobFlow(jobId, { nodes: updatedNodes, edges: activeJob.edges });
        console.log("Updated job flow with assessment");
      }

      handleCloseAssessmentModal();
    } catch (error) {
      console.error("Failed to save assessment:", error);
      // TODO: Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center font-inter">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "hr") {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center font-inter">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            This page is only available for HR users.
          </p>
        </div>
      </div>
    );
  }

  const orderedJobs = jobOrder.map((id) => jobs[id]?.details).filter(Boolean);

  return (
    <div className="h-screen w-screen bg-gray-50 font-inter flex overflow-hidden">
      <DashboardSidebar
        jobs={orderedJobs}
        activeJobId={jobId}
        onJobSelect={handleJobSelect}
        onNewJob={() => handleOpenJobModal()}
        onEditJob={(job) => handleOpenJobModal(job)}
        onArchiveJob={handleArchiveJob}
        onDeleteJob={handleDeleteJob}
        onReorder={handleReorderJobs}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main
        className="flex-1 h-full transition-all duration-300 ease-in-out"
        style={{ paddingLeft: isSidebarOpen ? "22rem" : "0rem" }}
      >
        <ReactFlowProvider>
          {activeJob ? (
            <EmployerDashboard
              key={jobId}
              job={activeJob}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onCandidateMove={handleCandidateMove}
              onConnectStages={handleConnectStages}
              onMoveToNextStage={handleMoveToNextStage}
              onEditJob={(jobData) => handleOpenJobModal(jobData)}
              onArchiveJob={handleArchiveJob}
              onShowResume={handleShowResume}
              onAddStage={handleOpenAddStageModal}
              onEditStage={handleOpenEditStageModal}
              onDeleteStage={handleDeleteStage}
              onCreateAssessment={handleCreateAssessment}
              onEditAssessment={handleEditAssessment}
              onViewResponses={handleViewResponses}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-3xl font-bold text-primary-500">
                No Jobs Available
              </h2>
              <p className="text-gray-500 mt-2">
                Create a new job to get started.
              </p>
              <button
                onClick={() => handleOpenJobModal()}
                className="mt-6 flex items-center justify-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-lg text-base font-inter font-semibold hover:bg-primary-400/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Job
              </button>
            </div>
          )}
        </ReactFlowProvider>
      </main>
      <JobModal
        isOpen={isJobModalOpen}
        onClose={handleCloseJobModal}
        onSave={handleSaveJob}
        job={editingJob}
      />
      <StageModal
        isOpen={isStageModalOpen}
        onClose={() => {
          setIsStageModalOpen(false);
          setEditingStage(null);
        }}
        onSave={handleSaveStage}
        stage={editingStage}
      />
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={handleCloseAssessmentModal}
        onSave={handleSaveAssessment}
        assessment={editingAssessment}
      />
      <AnimatePresence>
        {resumeSidebarOpen && (
          <ResumeSidebar onClose={handleCloseResume} candidate={activeResume} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployerDashboardPage;
