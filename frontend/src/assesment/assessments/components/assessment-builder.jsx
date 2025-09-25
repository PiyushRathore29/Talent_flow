import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Plus, Save, FileText, ArrowLeft } from "lucide-react";
import { useAppStore } from "../../../lib/store";
import { SectionManager } from "./section-manager";
import { QuestionEditor } from "./question-editor";
import { AssessmentPreviewPane } from "./assessment-preview-pane";
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
export const AssessmentBuilder = ({ jobId, assessmentId }) => {
  console.log("🏗️ AssessmentBuilder rendered with:", {
    jobId,
    assessmentId,
  });
  const navigate = useNavigate();
  const {
    assessments,
    assessmentBuilder,
    setCurrentAssessment,
    setAssessmentBuilder,
    createAssessment,
    updateAssessment,
    setLoading,
    setError,
  } = useAppStore();
  const [localAssessment, setLocalAssessment] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewResponses, setPreviewResponses] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(jobId);
  const [jobs, setJobs] = useState([]);
  const [showJobSelection, setShowJobSelection] = useState(!jobId);

  // Auto-save preview responses to demonstrate IndexedDB storage
  const handlePreviewResponseChange = async (questionId, value) => {
    setPreviewResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Optionally save to IndexedDB for preview purposes
    if (localAssessment?.id) {
      try {
        const { saveAssessmentResponse } = useAppStore.getState();
        await saveAssessmentResponse(localAssessment.id, "preview-user", {
          ...previewResponses,
          [questionId]: value,
        });
      } catch (error) {
        console.warn("Failed to save preview response:", error);
      }
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  console.log("HIII");

  // Load jobs and check URL parameters
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { jobsData } = await import("../../../data/jobsData.js");
        setJobs(jobsData || []);

        // Check URL parameters for jobId
        const urlParams = new URLSearchParams(window.location.search);
        const urlJobId = urlParams.get("jobId");
        if (urlJobId && !jobId) {
          setSelectedJobId(parseInt(urlJobId));
          setShowJobSelection(false);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      }
    };

    loadJobs();
  }, [jobId]);

  // Initialize assessment
  useEffect(() => {
    if (assessmentId) {
      const existingAssessment = (assessments || []).find(
        (a) => a.id === assessmentId
      );
      if (existingAssessment) {
        setLocalAssessment(existingAssessment);
        setCurrentAssessment(existingAssessment);
        setAssessmentBuilder({
          currentAssessment: existingAssessment,
          selectedSection: existingAssessment.sections[0]?.id || null,
          selectedQuestion: null,
          previewMode: false,
        });
      }
    } else if (selectedJobId) {
      // Create new assessment only when job is selected
      const selectedJob = jobs.find((job) => job.id === selectedJobId);
      const newAssessment = {
        id: nanoid(),
        jobId: selectedJobId,
        title: `Assessment for ${
          selectedJob?.category || selectedJob?.title || "Job"
        }`,
        description: `Assessment to evaluate candidates for the ${
          selectedJob?.category || selectedJob?.title
        } position.`,
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setLocalAssessment(newAssessment);
      setCurrentAssessment(newAssessment);
      setAssessmentBuilder({
        currentAssessment: newAssessment,
        selectedSection: null,
        selectedQuestion: null,
        previewMode: false,
      });
      setShowJobSelection(false);
    }
    // If no assessmentId and no selectedJobId, keep showing job selection
  }, [
    assessmentId,
    assessments,
    selectedJobId,
    jobs,
    setCurrentAssessment,
    setAssessmentBuilder,
  ]);
  const handleAssessmentChange = (field, value) => {
    if (!localAssessment) return;
    const updatedAssessment = {
      ...localAssessment,
      [field]: value,
      updatedAt: new Date(),
    };
    setLocalAssessment(updatedAssessment);
    setCurrentAssessment(updatedAssessment);
    setAssessmentBuilder({
      currentAssessment: updatedAssessment,
    });
    setHasUnsavedChanges(true);

    // Clear preview responses when assessment structure changes
    if (field === "sections") {
      setPreviewResponses({});
    }
  };
  const handleSectionReorder = (event) => {
    const { active, over } = event;
    if (!over || !localAssessment) return;
    const oldIndex = localAssessment.sections.findIndex(
      (s) => s.id === active.id
    );
    const newIndex = localAssessment.sections.findIndex(
      (s) => s.id === over.id
    );
    if (oldIndex !== newIndex) {
      const reorderedSections = arrayMove(
        localAssessment.sections,
        oldIndex,
        newIndex
      ).map((section, index) => ({
        ...section,
        order: index,
      }));
      handleAssessmentChange("sections", reorderedSections);
    }
  };
  const addSection = () => {
    console.log("HIII");
    if (!localAssessment) return;
    const newSection = {
      id: nanoid(),
      title: `Section ${localAssessment.sections.length + 1}`,
      description: "",
      questions: [],
      order: localAssessment.sections.length,
    };
    console.log("HIII");
    const updatedSections = [...localAssessment.sections, newSection];
    handleAssessmentChange("sections", updatedSections);
    setAssessmentBuilder({
      selectedSection: newSection.id,
    });
  };
  const updateSection = (sectionId, updates) => {
    if (!localAssessment) return;
    const updatedSections = localAssessment.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            ...updates,
          }
        : section
    );
    handleAssessmentChange("sections", updatedSections);
  };
  const deleteSection = (sectionId) => {
    if (!localAssessment) return;
    const updatedSections = localAssessment.sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({
        ...section,
        order: index,
      }));
    handleAssessmentChange("sections", updatedSections);

    // Update selected section if deleted
    if (assessmentBuilder.selectedSection === sectionId) {
      setAssessmentBuilder({
        selectedSection: updatedSections[0]?.id || null,
        selectedQuestion: null,
      });
    }
  };
  const saveAssessment = async () => {
    if (!localAssessment) return;
    try {
      setLoading("saveAssessment", true);
      setError("saveAssessment", null);
      if (assessmentId) {
        await updateAssessment(localAssessment.id, localAssessment);
      } else {
        await createAssessment(localAssessment);
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save assessment:", error);
    } finally {
      setLoading("saveAssessment", false);
    }
  };

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setShowJobSelection(false);

    // Update URL with selected job
    const url = new URL(window.location);
    url.searchParams.set("jobId", jobId);
    window.history.replaceState({}, "", url);
  };

  // Show job selection interface when no job is selected
  if (showJobSelection && jobs.length > 0) {
    console.log("🎯 Showing job selection interface with", jobs.length, "jobs");
    return /*#__PURE__*/ _jsx("div", {
      className: "h-full flex flex-col bg-gray-50 dark:bg-[#000319]",
      children: /*#__PURE__*/ _jsxs("div", {
        className: "flex-1 flex items-center justify-center p-8",
        children: [
          /*#__PURE__*/ _jsxs("div", {
            className: "max-w-2xl w-full",
            children: [
              /*#__PURE__*/ _jsxs("div", {
                className: "text-center mb-8",
                children: [
                  /*#__PURE__*/ _jsx("h1", {
                    className:
                      "text-3xl font-bold text-gray-900 dark:text-white mb-4",
                    children: "Create Assessment",
                  }),
                  /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-600 dark:text-gray-400",
                    children:
                      "Select a job position to create an assessment for:",
                  }),
                ],
              }),
              /*#__PURE__*/ _jsx("div", {
                className: "grid gap-4",
                children: jobs.map((job) =>
                  /*#__PURE__*/ _jsxs("div", {
                    key: job.id,
                    onClick: () => handleJobSelect(job.id),
                    className:
                      "p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-gray-700/80 hover:shadow-md",
                    children: [
                      /*#__PURE__*/ _jsx("h3", {
                        className:
                          "text-lg font-semibold text-gray-900 dark:text-white mb-2",
                        children: job.category || job.title,
                      }),
                      /*#__PURE__*/ _jsx("p", {
                        className: "text-gray-600 dark:text-gray-400 mb-2",
                        children: job.company,
                      }),
                      /*#__PURE__*/ _jsxs("div", {
                        className:
                          "flex items-center text-sm text-gray-500 dark:text-gray-500",
                        children: [
                          /*#__PURE__*/ _jsx("span", { children: job.type }),
                          " • ",
                          /*#__PURE__*/ _jsx("span", {
                            children: job.location,
                          }),
                        ],
                      }),
                    ],
                  })
                ),
              }),
              /*#__PURE__*/ _jsxs("div", {
                className: "text-center mt-8",
                children: [
                  /*#__PURE__*/ _jsx(Button, {
                    variant: "outline",
                    onClick: () => navigate("/assessments"),
                    className:
                      "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                    children: "Back to Assessments",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  }

  if (!localAssessment) {
    return /*#__PURE__*/ _jsx("div", {
      className:
        "flex items-center justify-center h-64 bg-white dark:bg-[#000319]",
      children: /*#__PURE__*/ _jsxs("div", {
        className: "text-center",
        children: [
          /*#__PURE__*/ _jsx("div", {
            className:
              "animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4",
          }),
          /*#__PURE__*/ _jsx("p", {
            className: "text-gray-400",
            children: "Loading assessment...",
          }),
        ],
      }),
    });
  }
  return /*#__PURE__*/ _jsxs("div", {
    className: "h-full flex flex-col bg-gray-50 dark:bg-[#000319]",
    children: [
      /*#__PURE__*/ _jsxs("div", {
        className:
          "border-b p-6 shadow-sm bg-white dark:bg-[#0d1025] border-gray-200 dark:border-gray-700",
        children: [
          /*#__PURE__*/ _jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              /*#__PURE__*/ _jsxs("div", {
                className: "flex items-start gap-4 flex-1 max-w-3xl",
                children: [
                  /*#__PURE__*/ _jsxs(Button, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => navigate("/assessments"),
                    className:
                      "mt-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex-shrink-0",
                    children: [
                      /*#__PURE__*/ _jsx(ArrowLeft, {
                        className: "h-4 w-4 mr-2",
                      }),
                      !assessmentId ? "Cancel Creation" : "Back to Assessments",
                    ],
                  }),
                  /*#__PURE__*/ _jsxs("div", {
                    className: "flex-1",
                    children: [
                      !assessmentId,
                      /*#__PURE__*/ _jsx(Input, {
                        value: localAssessment.title,
                        onChange: (e) =>
                          handleAssessmentChange("title", e.target.value),
                        className:
                          "text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-gray-500 text-gray-900 dark:text-white",
                        placeholder: !assessmentId
                          ? "Enter assessment title..."
                          : "Assessment Title",
                      }),
                      /*#__PURE__*/ _jsx(Textarea, {
                        value: localAssessment.description,
                        onChange: (e) =>
                          handleAssessmentChange("description", e.target.value),
                        className:
                          "mt-3 border-none p-0 resize-none focus-visible:ring-0 bg-transparent placeholder:text-gray-500 text-gray-700 dark:text-gray-300",
                        placeholder: !assessmentId
                          ? "Describe what this assessment will evaluate..."
                          : "Add a description to help candidates understand this assessment...",
                        rows: 2,
                      }),
                    ],
                  }),
                ],
              }),
              /*#__PURE__*/ _jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  hasUnsavedChanges &&
                    /*#__PURE__*/ _jsxs(Badge, {
                      variant: "outline",
                      className:
                        "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900 animate-pulse",
                      children: [
                        /*#__PURE__*/ _jsx("div", {
                          className:
                            "w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full mr-2",
                        }),
                        "Unsaved Changes",
                      ],
                    }),
                  /*#__PURE__*/ _jsxs(Button, {
                    onClick: saveAssessment,
                    disabled: !hasUnsavedChanges,
                    size: "sm",
                    className:
                      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                    children: [
                      /*#__PURE__*/ _jsx(Save, {
                        className: "h-4 w-4 mr-2",
                      }),
                      "Save Assessment",
                    ],
                  }),
                ],
              }),
            ],
          }),
          /*#__PURE__*/ _jsx("div", {
            className:
              "mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400",
            children: /*#__PURE__*/ _jsxs("div", {
              className: "flex items-center gap-6",
              children: [
                /*#__PURE__*/ _jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "w-2 h-2 bg-blue-500 rounded-full",
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                      children: [
                        localAssessment.sections.length,
                        " section",
                        localAssessment.sections.length !== 1 ? "s" : "",
                      ],
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "w-2 h-2 bg-green-500 rounded-full",
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                      children: [
                        localAssessment.sections.reduce(
                          (total, section) => total + section.questions.length,
                          0
                        ),
                        " ",
                        "questions",
                      ],
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "w-2 h-2 bg-purple-500 rounded-full",
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                      children: [
                        "~",
                        localAssessment.sections.reduce(
                          (total, section) => total + section.questions.length,
                          0
                        ) * 2,
                        " ",
                        "min duration",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      /*#__PURE__*/ _jsx("div", {
        className: "flex-1 flex overflow-hidden",
        children: /*#__PURE__*/ _jsxs(_Fragment, {
          children: [
            /*#__PURE__*/ _jsx("div", {
              className:
                "w-1/4 border-r border-gray-700 overflow-y-auto bg-white dark:bg-[#0d1025]",
              children: /*#__PURE__*/ _jsxs("div", {
                className: "p-6",
                children: [
                  /*#__PURE__*/ _jsxs("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                      /*#__PURE__*/ _jsx("h3", {
                        className:
                          "text-lg font-semibold text-gray-900 dark:text-white",
                        children: "Assessment Sections",
                      }),
                      /*#__PURE__*/ _jsxs(Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: addSection,
                        className:
                          "bg-sky-100 dark:bg-blue-900/20 border border-sky-300 dark:border-blue-500/30 text-sky-700 dark:text-blue-400 hover:bg-sky-200 dark:hover:bg-blue-800/30 hover:border-sky-400 dark:hover:border-blue-400 transition-all duration-200",
                        children: [
                          /*#__PURE__*/ _jsx(Plus, {
                            className: "h-4 w-4 mr-2",
                          }),
                          "Add Section",
                        ],
                      }),
                    ],
                  }),
                  /*#__PURE__*/ _jsx(DndContext, {
                    sensors: sensors,
                    collisionDetection: closestCorners,
                    onDragEnd: handleSectionReorder,
                    children: /*#__PURE__*/ _jsx(SortableContext, {
                      items: localAssessment.sections.map((s) => s.id),
                      strategy: verticalListSortingStrategy,
                      children: /*#__PURE__*/ _jsx("div", {
                        className: "space-y-2",
                        children: localAssessment.sections.map((section) =>
                          /*#__PURE__*/ _jsx(
                            SectionManager,
                            {
                              section: section,
                              isSelected:
                                assessmentBuilder.selectedSection ===
                                section.id,
                              onSelect: () =>
                                setAssessmentBuilder({
                                  selectedSection: section.id,
                                  selectedQuestion: null,
                                }),
                              onUpdate: (updates) =>
                                updateSection(section.id, updates),
                              onDelete: () => deleteSection(section.id),
                            },
                            section.id
                          )
                        ),
                      }),
                    }),
                  }),
                  localAssessment.sections.length === 0 &&
                    /*#__PURE__*/ _jsxs("div", {
                      className:
                        "text-center py-12 px-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl shadow-sm",
                      children: [
                        /*#__PURE__*/ _jsx("div", {
                          className:
                            "w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4",
                          children: /*#__PURE__*/ _jsx(Plus, {
                            className:
                              "w-8 h-8 text-blue-600 dark:text-blue-400",
                          }),
                        }),
                        /*#__PURE__*/ _jsx("h4", {
                          className:
                            "text-lg font-medium text-gray-900 dark:text-white mb-2",
                          children: "No sections yet",
                        }),
                        /*#__PURE__*/ _jsx("p", {
                          className: "text-gray-600 dark:text-gray-400 mb-4",
                          children:
                            "Create your first section to start building your assessment",
                        }),
                        /*#__PURE__*/ _jsxs(Button, {
                          onClick: addSection,
                          className:
                            "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors",
                          children: [
                            /*#__PURE__*/ _jsx(Plus, {
                              className: "w-4 h-4 mr-2",
                            }),
                            "Create First Section",
                          ],
                        }),
                      ],
                    }),
                ],
              }),
            }),
            /*#__PURE__*/ _jsx("div", {
              className:
                "w-2/5 border-r border-gray-700 overflow-y-auto bg-white dark:bg-[#000319]",
              children: assessmentBuilder.selectedSection
                ? (() => {
                    const selectedSection = localAssessment.sections.find(
                      (s) => s.id === assessmentBuilder.selectedSection
                    );
                    if (!selectedSection) return null;
                    return /*#__PURE__*/ _jsx("div", {
                      className: "h-full",
                      children: /*#__PURE__*/ _jsx(QuestionEditor, {
                        section: selectedSection,
                        selectedQuestion: assessmentBuilder.selectedQuestion,
                        onQuestionUpdate: (questionId, updates) => {
                          const updatedSections = localAssessment.sections.map(
                            (section) => {
                              if (section.id === selectedSection.id) {
                                return {
                                  ...section,
                                  questions: section.questions.map((q) =>
                                    q.id === questionId
                                      ? {
                                          ...q,
                                          ...updates,
                                        }
                                      : q
                                  ),
                                };
                              }
                              return section;
                            }
                          );
                          handleAssessmentChange("sections", updatedSections);
                        },
                        onQuestionAdd: (questionData) => {
                          const newQuestion = {
                            ...questionData,
                            id: nanoid(),
                            order: selectedSection.questions.length,
                          };
                          const updatedSections = localAssessment.sections.map(
                            (section) => {
                              if (section.id === selectedSection.id) {
                                return {
                                  ...section,
                                  questions: [
                                    ...section.questions,
                                    newQuestion,
                                  ],
                                };
                              }
                              return section;
                            }
                          );
                          handleAssessmentChange("sections", updatedSections);
                          setAssessmentBuilder({
                            selectedQuestion: newQuestion.id,
                          });
                        },
                        onQuestionDelete: (questionId) => {
                          const updatedSections = localAssessment.sections.map(
                            (section) => {
                              if (section.id === selectedSection.id) {
                                return {
                                  ...section,
                                  questions: section.questions
                                    .filter((q) => q.id !== questionId)
                                    .map((q, index) => ({
                                      ...q,
                                      order: index,
                                    })),
                                };
                              }
                              return section;
                            }
                          );
                          handleAssessmentChange("sections", updatedSections);
                          if (
                            assessmentBuilder.selectedQuestion === questionId
                          ) {
                            setAssessmentBuilder({
                              selectedQuestion: null,
                            });
                          }
                        },
                        onQuestionReorder: (fromIndex, toIndex) => {
                          const updatedSections = localAssessment.sections.map(
                            (section) => {
                              if (section.id === selectedSection.id) {
                                const reorderedQuestions = arrayMove(
                                  section.questions,
                                  fromIndex,
                                  toIndex
                                ).map((q, index) => ({
                                  ...q,
                                  order: index,
                                }));
                                return {
                                  ...section,
                                  questions: reorderedQuestions,
                                };
                              }
                              return section;
                            }
                          );
                          handleAssessmentChange("sections", updatedSections);
                        },
                        onQuestionSelect: (questionId) => {
                          setAssessmentBuilder({
                            selectedQuestion: questionId,
                          });
                        },
                      }),
                    });
                  })()
                : /*#__PURE__*/ _jsx("div", {
                    className:
                      "flex items-center justify-center h-full bg-gray-50 dark:bg-[#000319]",
                    children: /*#__PURE__*/ _jsxs("div", {
                      className: "text-center p-8",
                      children: [
                        /*#__PURE__*/ _jsx("div", {
                          className:
                            "w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4",
                          children: /*#__PURE__*/ _jsx(FileText, {
                            className:
                              "w-10 h-10 text-gray-400 dark:text-gray-500",
                          }),
                        }),
                        /*#__PURE__*/ _jsx("h4", {
                          className:
                            "text-xl font-medium text-gray-900 dark:text-white mb-2",
                          children: "Select a section to manage questions",
                        }),
                        /*#__PURE__*/ _jsx("p", {
                          className: "text-gray-600 dark:text-gray-400 mb-4",
                          children:
                            "Choose a section from the left panel to add and edit questions",
                        }),
                        localAssessment.sections.length === 0 &&
                          /*#__PURE__*/ _jsxs(Button, {
                            onClick: addSection,
                            className:
                              "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors",
                            children: [
                              /*#__PURE__*/ _jsx(Plus, {
                                className: "w-4 h-4 mr-2",
                              }),
                              "Create First Section",
                            ],
                          }),
                      ],
                    }),
                  }),
            }),
            /*#__PURE__*/ _jsx("div", {
              className: "w-1/3 overflow-y-auto bg-gray-50 dark:bg-[#0a0f1e]",
              children: /*#__PURE__*/ _jsx("div", {
                className: "p-6",
                children: /*#__PURE__*/ _jsx(AssessmentPreviewPane, {
                  assessment: localAssessment,
                  responses: previewResponses,
                  onResponseChange: handlePreviewResponseChange,
                  className: "h-full",
                }),
              }),
            }),
          ],
        }),
      }),
    ],
  });
};
