import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Plus, Settings, Eye, FileText, Clock, BarChart, Users, TrendingUp, Edit } from "lucide-react";
import { useAppStore } from "../../../lib/store";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentsListPage = () => {
  const navigate = useNavigate();
  const {
    assessments,
    jobs,
    syncWithAPI,
    loading
  } = useAppStore();
  const [showJobSelectionModal, setShowJobSelectionModal] = useState(false);
  useEffect(() => {
    // Load assessments when component mounts
    const loadData = async () => {
      try {
        await syncWithAPI();
      } catch (error) {
        console.error("Failed to load assessments:", error);
      }
    };
    loadData();
  }, [syncWithAPI]);
  const handleCreateAssessment = () => {
    // Check if there are any jobs available
    const safeJobs = Array.isArray(jobs) ? jobs : [];

    // Always show job selection modal if there are jobs, allowing user to choose
    // or create a standalone assessment
    if (safeJobs.length > 0) {
      setShowJobSelectionModal(true);
    } else {
      // If no jobs exist, create a standalone assessment
      navigate("/assessments/builder");
    }
  };
  const handleJobSelection = jobId => {
    setShowJobSelectionModal(false);
    if (jobId) {
      navigate(`/assessments/builder/${jobId}`);
    } else {
      navigate("/assessments/builder");
    }
  };
  const handleEditAssessment = (assessmentId, jobId) => {
    if (jobId) {
      navigate(`/assessments/builder/${jobId}/${assessmentId}`);
    } else {
      navigate(`/assessments/builder/standalone/${assessmentId}`);
    }
  };
  const handlePreviewAssessment = assessmentId => {
    navigate(`/assessments/preview/${assessmentId}`);
  };

  // Ensure assessments is always an array
  const safeAssessments = Array.isArray(assessments) ? assessments : [];
  const totalResponses = safeAssessments.reduce((sum, assessment) => {
    // This would normally come from assessment responses
    return sum + assessment.sections.length * 5; // Mock response count
  }, 0);
  const averageDuration = safeAssessments.length > 0 ? Math.round(safeAssessments.reduce((sum, assessment) => {
    return sum + assessment.sections.length * 10; // Mock duration calculation
  }, 0) / safeAssessments.length) : 0;
  const activeAssessments = safeAssessments.filter(assessment => assessment.sections.length > 0 // Consider assessments with sections as "active"
  );
  return /*#__PURE__*/_jsx("div", {
    className: "h-full bg-white dark:bg-[#000319]",
    children: /*#__PURE__*/_jsxs("div", {
      className: "space-y-6 p-6 h-full overflow-hidden",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex justify-between items-center",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h1", {
            className: "text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white",
            children: "Assessment Center"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-gray-600 dark:text-gray-300 mt-2 text-lg",
            children: "Create and manage custom assessments for your hiring process"
          })]
        }), /*#__PURE__*/_jsxs(Button, {
          onClick: handleCreateAssessment,
          size: "lg",
          className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300",
          children: [/*#__PURE__*/_jsx(Plus, {
            className: "mr-2 h-5 w-5"
          }), "New Assessment"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid gap-4 md:grid-cols-4",
        children: [/*#__PURE__*/_jsxs(Card, {
          className: "group hover:shadow-md transition-all duration-200 border bg-white dark:bg-[#0d1025] border-gray-200 dark:border-gray-700",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: [/*#__PURE__*/_jsx(CardTitle, {
              className: "text-sm font-medium text-gray-700 dark:text-gray-300",
              children: "Total Assessments"
            }), /*#__PURE__*/_jsx("div", {
              className: "p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
              children: /*#__PURE__*/_jsx(FileText, {
                className: "h-4 w-4"
              })
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: safeAssessments.length
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-gray-500 dark:text-gray-400 mt-1",
              children: /*#__PURE__*/_jsxs("span", {
                className: "inline-flex items-center text-green-400",
                children: [/*#__PURE__*/_jsx(TrendingUp, {
                  className: "h-3 w-3 mr-1"
                }), activeAssessments.length, " active"]
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          className: "group hover:shadow-md transition-all duration-200 border bg-white dark:bg-[#0d1025] border-gray-200 dark:border-gray-700",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: [/*#__PURE__*/_jsx(CardTitle, {
              className: "text-sm font-medium text-gray-700 dark:text-gray-300",
              children: "Total Responses"
            }), /*#__PURE__*/_jsx("div", {
              className: "p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
              children: /*#__PURE__*/_jsx(Users, {
                className: "h-4 w-4"
              })
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: totalResponses
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-gray-500 dark:text-gray-400 mt-1",
              children: /*#__PURE__*/_jsxs("span", {
                className: "inline-flex items-center text-green-400",
                children: [/*#__PURE__*/_jsx(TrendingUp, {
                  className: "h-3 w-3 mr-1"
                }), "Across all assessments"]
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          className: "group hover:shadow-md transition-all duration-200 border bg-white dark:bg-[#0d1025] border-gray-200 dark:border-gray-700",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: [/*#__PURE__*/_jsx(CardTitle, {
              className: "text-sm font-medium text-gray-700 dark:text-gray-300",
              children: "Avg. Duration"
            }), /*#__PURE__*/_jsx("div", {
              className: "p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500",
              children: /*#__PURE__*/_jsx(Clock, {
                className: "h-4 w-4"
              })
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: [averageDuration, " min"]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-gray-500 dark:text-gray-400 mt-1",
              children: /*#__PURE__*/_jsxs("span", {
                className: "inline-flex items-center text-amber-400",
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "h-3 w-3 mr-1"
                }), "Estimated completion time"]
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          className: "group hover:shadow-md transition-all duration-200 border bg-white dark:bg-[#0d1025] border-gray-200 dark:border-gray-700",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: [/*#__PURE__*/_jsx(CardTitle, {
              className: "text-sm font-medium text-gray-700 dark:text-gray-300",
              children: "Completion Rate"
            }), /*#__PURE__*/_jsx("div", {
              className: "p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
              children: /*#__PURE__*/_jsx(TrendingUp, {
                className: "h-4 w-4"
              })
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "85%"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-gray-500 dark:text-gray-400 mt-1",
              children: /*#__PURE__*/_jsxs("span", {
                className: "inline-flex items-center text-green-400",
                children: [/*#__PURE__*/_jsx(TrendingUp, {
                  className: "h-3 w-3 mr-1"
                }), "Average completion rate"]
              })
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "space-y-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-2xl font-semibold text-gray-900 dark:text-white",
            children: "Your Assessments"
          }), loading.sync && /*#__PURE__*/_jsx(Badge, {
            variant: "secondary",
            className: "animate-pulse bg-gray-700 text-gray-300",
            children: "Syncing..."
          })]
        }), safeAssessments.length === 0 ? /*#__PURE__*/_jsx(Card, {
          className: "border-dashed border-2 bg-white dark:bg-[#0d1025] border-gray-300 dark:border-gray-600",
          children: /*#__PURE__*/_jsxs(CardContent, {
            className: "flex flex-col items-center justify-center py-16",
            children: [/*#__PURE__*/_jsx(FileText, {
              className: "h-16 w-16 text-gray-500 mb-4"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-xl font-medium text-gray-900 dark:text-gray-300 mb-2",
              children: "No assessments yet"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md",
              children: "Create your first assessment to start evaluating candidates for your open positions."
            }), /*#__PURE__*/_jsxs(Button, {
              onClick: handleCreateAssessment,
              className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "mr-2 h-4 w-4"
              }), "Create Assessment"]
            })]
          })
        }) : /*#__PURE__*/_jsx("div", {
          className: "grid gap-6",
          children: safeAssessments.map(assessment => {
            const job = (jobs || []).find(j => j.id === assessment.jobId);
            const totalQuestions = assessment.sections.reduce((sum, section) => sum + section.questions.length, 0);
            const estimatedDuration = totalQuestions * 2; // 2 mins per question
            const mockResponses = totalQuestions > 0 ? Math.floor(Math.random() * 25) + 1 : 0;
            return /*#__PURE__*/_jsxs(Card, {
              className: "hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 border bg-white dark:bg-[#0d1025] border-gray-200 dark:border-gray-700",
              children: [/*#__PURE__*/_jsx(CardHeader, {
                children: /*#__PURE__*/_jsxs("div", {
                  className: "flex items-start justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "space-y-2",
                    children: [/*#__PURE__*/_jsx(CardTitle, {
                      className: "text-xl font-semibold text-gray-900 dark:text-white",
                      children: assessment.title
                    }), /*#__PURE__*/_jsx(CardDescription, {
                      className: "text-base text-gray-600 dark:text-gray-400",
                      children: assessment.description || "No description provided"
                    }), job ? /*#__PURE__*/_jsx(Badge, {
                      variant: "outline",
                      className: "w-fit bg-sky-100 dark:bg-gray-800 border-sky-300 dark:border-gray-600 text-sky-700 dark:text-gray-300",
                      children: /*#__PURE__*/_jsx(Link, {
                        to: `/jobs/${job.id}`,
                        className: "hover:underline",
                        children: job.title
                      })
                    }) : /*#__PURE__*/_jsx(Badge, {
                      variant: "outline",
                      className: "w-fit bg-purple-900/20 border-purple-500/30 text-purple-300",
                      children: "\uD83C\uDFAF Standalone Assessment"
                    })]
                  }), /*#__PURE__*/_jsx(Badge, {
                    variant: assessment.sections.length > 0 ? "default" : "secondary",
                    className: assessment.sections.length > 0 ? "bg-green-600/20 text-green-400 border-green-500/30" : "bg-gray-600/20 text-gray-300 border-gray-500/30",
                    children: assessment.sections.length > 0 ? "Active" : "Draft"
                  })]
                })
              }), /*#__PURE__*/_jsx(CardContent, {
                children: /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400",
                    children: [/*#__PURE__*/_jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [/*#__PURE__*/_jsx(FileText, {
                        className: "h-4 w-4"
                      }), /*#__PURE__*/_jsxs("span", {
                        children: [assessment.sections.length, " sections"]
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [/*#__PURE__*/_jsx(BarChart, {
                        className: "h-4 w-4"
                      }), /*#__PURE__*/_jsxs("span", {
                        children: [totalQuestions, " questions"]
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [/*#__PURE__*/_jsx(Clock, {
                        className: "h-4 w-4"
                      }), /*#__PURE__*/_jsxs("span", {
                        children: ["~", estimatedDuration, " min"]
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [/*#__PURE__*/_jsx(Users, {
                        className: "h-4 w-4"
                      }), /*#__PURE__*/_jsxs("span", {
                        children: [mockResponses, " responses"]
                      })]
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex gap-2",
                    children: [/*#__PURE__*/_jsxs(Button, {
                      variant: "outline",
                      size: "sm",
                      className: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                      onClick: () => handlePreviewAssessment(assessment.id),
                      children: [/*#__PURE__*/_jsx(Eye, {
                        className: "mr-2 h-4 w-4"
                      }), "Preview"]
                    }), /*#__PURE__*/_jsxs(Button, {
                      variant: "outline",
                      size: "sm",
                      className: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                      onClick: () => handleEditAssessment(assessment.id, assessment.jobId),
                      children: [/*#__PURE__*/_jsx(Edit, {
                        className: "mr-2 h-4 w-4"
                      }), "Edit"]
                    }), assessment.sections.length === 0 && /*#__PURE__*/_jsxs(Button, {
                      size: "sm",
                      className: "bg-blue-600 hover:bg-blue-700 text-white",
                      children: [/*#__PURE__*/_jsx(Settings, {
                        className: "mr-2 h-4 w-4"
                      }), "Build"]
                    })]
                  })]
                })
              })]
            }, assessment.id);
          })
        })]
      }), safeAssessments.length < 3 && /*#__PURE__*/_jsxs(Card, {
        className: "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200",
        children: [/*#__PURE__*/_jsxs(CardHeader, {
          children: [/*#__PURE__*/_jsx(CardTitle, {
            className: "text-xl",
            children: "Getting Started with Assessments"
          }), /*#__PURE__*/_jsx(CardDescription, {
            children: "Create powerful assessments in just a few steps"
          })]
        }), /*#__PURE__*/_jsx(CardContent, {
          children: /*#__PURE__*/_jsxs("div", {
            className: "grid md:grid-cols-3 gap-6",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold",
                children: "1"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h4", {
                  className: "font-semibold mb-1",
                  children: "Choose Assessment Type"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Select from technical skills, personality, or create custom assessment templates"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold",
                children: "2"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h4", {
                  className: "font-semibold mb-1",
                  children: "Add Questions"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Create multiple choice, text, or coding questions with our intuitive builder"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold",
                children: "3"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h4", {
                  className: "font-semibold mb-1",
                  children: "Configure & Publish"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "Set time limits, scoring, and publish to start collecting responses"
                })]
              })]
            })]
          })
        })]
      }), /*#__PURE__*/_jsx(Dialog, {
        open: showJobSelectionModal,
        onOpenChange: setShowJobSelectionModal,
        children: /*#__PURE__*/_jsxs(DialogContent, {
          className: "sm:max-w-[500px] max-h-[80vh] flex flex-col border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1025]",
          children: [/*#__PURE__*/_jsxs(DialogHeader, {
            className: "flex-shrink-0",
            children: [/*#__PURE__*/_jsx(DialogTitle, {
              className: "text-gray-900 dark:text-white",
              children: "Select Assessment Type"
            }), /*#__PURE__*/_jsx(DialogDescription, {
              className: "text-gray-600 dark:text-gray-300",
              children: "Choose to create a job-specific assessment or a standalone assessment that can be used for multiple positions."
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "flex-1 overflow-y-auto pr-2 -mr-2",
            children: /*#__PURE__*/_jsxs("div", {
              className: "grid gap-4 py-4",
              children: [/*#__PURE__*/_jsx(Card, {
                className: "cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-blue-500 bg-blue-900/20 hover:bg-blue-800/30 hover:border-blue-400",
                onClick: () => handleJobSelection(),
                children: /*#__PURE__*/_jsx(CardContent, {
                  className: "p-4",
                  children: /*#__PURE__*/_jsx("div", {
                    className: "flex items-center justify-between",
                    children: /*#__PURE__*/_jsxs("div", {
                      children: [/*#__PURE__*/_jsx("h4", {
                        className: "font-semibold text-blue-300",
                        children: "\uD83C\uDFAF Standalone Assessment"
                      }), /*#__PURE__*/_jsx("p", {
                        className: "text-sm text-blue-200",
                        children: "Create a general assessment that can be used for any position"
                      }), /*#__PURE__*/_jsx(Badge, {
                        className: "mt-1 bg-blue-600 text-white hover:bg-blue-700",
                        children: "Recommended"
                      })]
                    })
                  })
                })
              }), Array.isArray(jobs) && jobs.length > 0 && /*#__PURE__*/_jsxs("div", {
                className: "space-y-3",
                children: [/*#__PURE__*/_jsx("h5", {
                  className: "text-sm font-medium text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-3",
                  children: "Or associate with a specific job:"
                }), /*#__PURE__*/_jsx("div", {
                  className: "space-y-2 max-h-60 overflow-y-auto",
                  children: jobs.map(job => /*#__PURE__*/_jsx(Card, {
                    className: "cursor-pointer hover:shadow-lg transition-all duration-300 border bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:border-gray-400 dark:hover:border-gray-500",
                    onClick: () => handleJobSelection(job.id),
                    children: /*#__PURE__*/_jsx(CardContent, {
                      className: "p-3",
                      children: /*#__PURE__*/_jsx("div", {
                        className: "flex items-center justify-between",
                        children: /*#__PURE__*/_jsxs("div", {
                          className: "min-w-0 flex-1",
                          children: [/*#__PURE__*/_jsx("h4", {
                            className: "font-semibold truncate text-gray-900 dark:text-white",
                            children: job.title
                          }), /*#__PURE__*/_jsx("p", {
                            className: "text-sm text-gray-600 dark:text-gray-400 truncate",
                            children: job.location
                          }), /*#__PURE__*/_jsx(Badge, {
                            variant: job.status === "active" ? "default" : "secondary",
                            className: "mt-1",
                            children: job.status
                          })]
                        })
                      })
                    })
                  }, job.id))
                })]
              })]
            })
          }), /*#__PURE__*/_jsx(DialogFooter, {
            className: "flex-shrink-0 border-t border-gray-300 dark:border-gray-600 pt-4",
            children: /*#__PURE__*/_jsx(Button, {
              variant: "outline",
              onClick: () => setShowJobSelectionModal(false),
              className: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
              children: "Cancel"
            })
          })]
        })
      })]
    })
  });
};