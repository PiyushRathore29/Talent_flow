import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Eye, Download, Search, Filter, Clock, CheckCircle, AlertCircle, User, Calendar, FileText, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentResponseList = ({
  responses,
  assessments,
  candidates,
  onViewResponse,
  onExportResponse,
  onUpdateStatus,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assessmentFilter, setAssessmentFilter] = useState("all");

  // Combine responses with assessment and candidate details
  const responsesWithDetails = useMemo(() => {
    return responses.map(response => ({
      ...response,
      assessment: assessments.find(a => a.id === response.assessmentId),
      candidate: candidates.find(c => c.id === response.candidateId)
    }));
  }, [responses, assessments, candidates]);

  // Filter responses
  const filteredResponses = useMemo(() => {
    return responsesWithDetails.filter(response => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const candidateName = response.candidate?.name?.toLowerCase() || "";
        const candidateEmail = response.candidate?.email?.toLowerCase() || "";
        const assessmentTitle = response.assessment?.title?.toLowerCase() || "";
        if (!candidateName.includes(searchLower) && !candidateEmail.includes(searchLower) && !assessmentTitle.includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && response.status !== statusFilter) {
        return false;
      }

      // Assessment filter
      if (assessmentFilter !== "all" && response.assessmentId !== assessmentFilter) {
        return false;
      }
      return true;
    });
  }, [responsesWithDetails, searchTerm, statusFilter, assessmentFilter]);

  // Sort responses by submission date (newest first)
  const sortedResponses = useMemo(() => {
    return [...filteredResponses].sort((a, b) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [filteredResponses]);
  const getStatusIcon = status => {
    switch (status) {
      case "draft":
        return /*#__PURE__*/_jsx(Clock, {
          className: "h-4 w-4 text-yellow-500 dark:text-yellow-400"
        });
      case "submitted":
        return /*#__PURE__*/_jsx(CheckCircle, {
          className: "h-4 w-4 text-green-500 dark:text-green-400"
        });
      case "reviewed":
        return /*#__PURE__*/_jsx(Eye, {
          className: "h-4 w-4 text-blue-500 dark:text-blue-400"
        });
      default:
        return /*#__PURE__*/_jsx(AlertCircle, {
          className: "h-4 w-4 text-muted-foreground"
        });
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "submitted":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      case "reviewed":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };
  const calculateCompletionPercentage = response => {
    const assessment = assessments.find(a => a.id === response.assessmentId);
    if (!assessment) return 0;
    const totalQuestions = assessment.sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = response.responses.length;
    return totalQuestions > 0 ? Math.round(answeredQuestions / totalQuestions * 100) : 0;
  };
  if (loading) {
    return /*#__PURE__*/_jsx(Card, {
      children: /*#__PURE__*/_jsx(CardContent, {
        className: "pt-6",
        children: /*#__PURE__*/_jsx("div", {
          className: "flex items-center justify-center py-8",
          children: /*#__PURE__*/_jsx("div", {
            className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          })
        })
      })
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs(Card, {
      children: [/*#__PURE__*/_jsx(CardHeader, {
        children: /*#__PURE__*/_jsxs(CardTitle, {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(FileText, {
            className: "h-5 w-5"
          }), "Assessment Responses", /*#__PURE__*/_jsxs(Badge, {
            variant: "outline",
            className: "ml-2",
            children: [sortedResponses.length, " response", sortedResponses.length !== 1 ? "s" : ""]
          })]
        })
      }), /*#__PURE__*/_jsx(CardContent, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col sm:flex-row gap-4",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex-1",
            children: /*#__PURE__*/_jsxs("div", {
              className: "relative",
              children: [/*#__PURE__*/_jsx(Search, {
                className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              }), /*#__PURE__*/_jsx(Input, {
                placeholder: "Search by candidate name, email, or assessment...",
                value: searchTerm,
                onChange: e => setSearchTerm(e.target.value),
                className: "pl-10"
              })]
            })
          }), /*#__PURE__*/_jsxs(Select, {
            value: statusFilter,
            onValueChange: value => setStatusFilter(value),
            children: [/*#__PURE__*/_jsxs(SelectTrigger, {
              className: "w-full sm:w-48",
              children: [/*#__PURE__*/_jsx(Filter, {
                className: "h-4 w-4 mr-2"
              }), /*#__PURE__*/_jsx(SelectValue, {
                placeholder: "Filter by status"
              })]
            }), /*#__PURE__*/_jsxs(SelectContent, {
              children: [/*#__PURE__*/_jsx(SelectItem, {
                value: "all",
                children: "All Statuses"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "draft",
                children: "Draft"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "submitted",
                children: "Submitted"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "reviewed",
                children: "Reviewed"
              })]
            })]
          }), /*#__PURE__*/_jsxs(Select, {
            value: assessmentFilter,
            onValueChange: setAssessmentFilter,
            children: [/*#__PURE__*/_jsxs(SelectTrigger, {
              className: "w-full sm:w-48",
              children: [/*#__PURE__*/_jsx(FileText, {
                className: "h-4 w-4 mr-2"
              }), /*#__PURE__*/_jsx(SelectValue, {
                placeholder: "Filter by assessment"
              })]
            }), /*#__PURE__*/_jsxs(SelectContent, {
              children: [/*#__PURE__*/_jsx(SelectItem, {
                value: "all",
                children: "All Assessments"
              }), assessments.map(assessment => /*#__PURE__*/_jsx(SelectItem, {
                value: assessment.id,
                children: assessment.title
              }, assessment.id))]
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "space-y-4",
      children: sortedResponses.length === 0 ? /*#__PURE__*/_jsx(Card, {
        children: /*#__PURE__*/_jsx(CardContent, {
          className: "pt-6",
          children: /*#__PURE__*/_jsxs("div", {
            className: "text-center py-8",
            children: [/*#__PURE__*/_jsx(FileText, {
              className: "h-12 w-12 mx-auto text-muted-foreground mb-4"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-lg font-medium mb-2",
              children: "No responses found"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-muted-foreground",
              children: responses.length === 0 ? "No assessment responses have been submitted yet." : "No responses match your current filters."
            })]
          })
        })
      }) : sortedResponses.map(response => /*#__PURE__*/_jsx(Card, {
        className: "hover:shadow-md transition-shadow",
        children: /*#__PURE__*/_jsx(CardContent, {
          className: "pt-6",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-start justify-between",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex-1 space-y-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "flex items-start gap-3",
                children: /*#__PURE__*/_jsxs("div", {
                  className: "flex-1",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-2 mb-1",
                    children: [/*#__PURE__*/_jsx(User, {
                      className: "h-4 w-4 text-muted-foreground"
                    }), /*#__PURE__*/_jsx("h3", {
                      className: "font-medium",
                      children: response.candidate?.name || "Unknown Candidate"
                    }), /*#__PURE__*/_jsxs(Badge, {
                      className: getStatusColor(response.status),
                      children: [getStatusIcon(response.status), /*#__PURE__*/_jsx("span", {
                        className: "ml-1 capitalize",
                        children: response.status
                      })]
                    })]
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-sm text-muted-foreground",
                    children: response.candidate?.email || "No email"
                  })]
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-4 text-sm text-muted-foreground",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(FileText, {
                    className: "h-4 w-4"
                  }), response.assessment?.title || "Unknown Assessment"]
                }), /*#__PURE__*/_jsxs("span", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(Calendar, {
                    className: "h-4 w-4"
                  }), format(new Date(response.submittedAt), "PPp")]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-4",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex-1",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between mb-1",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "text-xs font-medium",
                      children: "Completion"
                    }), /*#__PURE__*/_jsxs("span", {
                      className: "text-xs text-muted-foreground",
                      children: [calculateCompletionPercentage(response), "%"]
                    })]
                  }), /*#__PURE__*/_jsx("div", {
                    className: "w-full bg-muted rounded-full h-2",
                    children: /*#__PURE__*/_jsx("div", {
                      className: "bg-primary h-2 rounded-full transition-all",
                      style: {
                        width: `${calculateCompletionPercentage(response)}%`
                      }
                    })
                  })]
                }), /*#__PURE__*/_jsxs(Badge, {
                  variant: "outline",
                  className: "text-xs",
                  children: [response.responses.length, " responses"]
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 ml-4",
              children: [onViewResponse && /*#__PURE__*/_jsxs(Button, {
                variant: "outline",
                size: "sm",
                onClick: () => onViewResponse(response),
                children: [/*#__PURE__*/_jsx(Eye, {
                  className: "h-4 w-4 mr-2"
                }), "View"]
              }), /*#__PURE__*/_jsxs(DropdownMenu, {
                children: [/*#__PURE__*/_jsx(DropdownMenuTrigger, {
                  asChild: true,
                  children: /*#__PURE__*/_jsx(Button, {
                    variant: "outline",
                    size: "sm",
                    children: /*#__PURE__*/_jsx(MoreHorizontal, {
                      className: "h-4 w-4"
                    })
                  })
                }), /*#__PURE__*/_jsxs(DropdownMenuContent, {
                  align: "end",
                  children: [onExportResponse && /*#__PURE__*/_jsxs(DropdownMenuItem, {
                    onClick: () => onExportResponse(response),
                    children: [/*#__PURE__*/_jsx(Download, {
                      className: "h-4 w-4 mr-2"
                    }), "Export"]
                  }), onUpdateStatus && response.status !== "reviewed" && /*#__PURE__*/_jsxs(DropdownMenuItem, {
                    onClick: () => onUpdateStatus(response.id, "reviewed"),
                    children: [/*#__PURE__*/_jsx(Eye, {
                      className: "h-4 w-4 mr-2"
                    }), "Mark as Reviewed"]
                  }), onUpdateStatus && response.status === "reviewed" && /*#__PURE__*/_jsxs(DropdownMenuItem, {
                    onClick: () => onUpdateStatus(response.id, "submitted"),
                    children: [/*#__PURE__*/_jsx(CheckCircle, {
                      className: "h-4 w-4 mr-2"
                    }), "Mark as Submitted"]
                  })]
                })]
              })]
            })]
          })
        })
      }, response.id))
    })]
  });
};