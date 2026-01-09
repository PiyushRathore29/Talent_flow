import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AssessmentResponseList } from "../components/assessment-response-list";
import { AssessmentResponseViewer } from "../components/assessment-response-viewer";
import {
  AssessmentsService,
  CandidatesService,
} from "../../../lib/db/operations";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentResponsesPage = () => {
  const [responses, setResponses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [responsesData, assessmentsData, candidatesData] =
        await Promise.all([
          AssessmentResponseService.getResponsesForCandidate(""),
          // Get all responses
          AssessmentsService.getAll(),
          CandidatesService.getAll(),
        ]);

      // If getting all responses fails, try getting from local storage
      let allResponses = responsesData;
      if (!allResponses || allResponses.length === 0) {
        // Get all responses from all candidates
        const candidateResponses = await Promise.all(
          candidatesData.map((candidate) =>
            AssessmentResponseService.getResponsesForCandidate(candidate.id)
          )
        );
        allResponses = candidateResponses.flat();
      }
      setResponses(allResponses);
      setAssessments(assessmentsData);
      setCandidates(candidatesData);
    } catch (err) {
      console.error("Failed to load assessment responses:", err);
      setError("Failed to load assessment responses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  const handleViewResponse = useCallback((response) => {
    setSelectedResponse(response);
  }, []);
  const handleCloseViewer = useCallback(() => {
    setSelectedResponse(null);
  }, []);
  const handleExportResponse = useCallback(
    (response) => {
      const candidate = candidates.find((c) => c.id === response.candidateId);
      const assessment = assessments.find(
        (a) => a.id === response.assessmentId
      );
      if (!candidate || !assessment) {
        console.error("Cannot export: missing candidate or assessment data");
        return;
      }
      const exportData = {
        candidate: {
          name: candidate.name,
          email: candidate.email,
        },
        assessment: {
          title: assessment.title,
          description: assessment.description,
        },
        response: {
          status: response.status,
          submittedAt: response.submittedAt,
          responses: response.responses.map((r) => {
            const question = assessment.sections
              .flatMap((s) => s.questions)
              .find((q) => q.id === r.questionId);
            return {
              question: question?.title || "Unknown Question",
              type: r.type,
              value: r.value,
            };
          }),
        },
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assessment-response-${candidate.name}-${
        new Date(response.submittedAt).toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [candidates, assessments]
  );
  const handleUpdateStatus = useCallback(async (responseId, status) => {
    try {
      const updatedResponse = await AssessmentResponseService.updateResponse(
        responseId,
        {
          status,
        }
      );
      if (updatedResponse) {
        setResponses((prev) =>
          prev.map((r) => (r.id === responseId ? updatedResponse : r))
        );
      }
    } catch (err) {
      console.error("Failed to update response status:", err);
      setError("Failed to update response status. Please try again.");
    }
  }, []);

  // Filter responses by status for tabs
  const getFilteredResponses = (status) => {
    if (!status) return responses;
    return responses.filter((r) => r.status === status);
  };

  // Calculate statistics
  const stats = {
    total: responses.length,
    draft: responses.filter((r) => r.status === "draft").length,
    submitted: responses.filter((r) => r.status === "submitted").length,
    reviewed: responses.filter((r) => r.status === "reviewed").length,
  };
  if (loading) {
    return /*#__PURE__*/ _jsx("div", {
      style: {
        backgroundColor: "#000319",
        minHeight: "100vh",
      },
      children: /*#__PURE__*/ _jsx("div", {
        className: "container mx-auto py-8",
        children: /*#__PURE__*/ _jsx(Card, {
          style: {
            backgroundColor: "#0d1025",
            borderColor: "#1f2937",
          },
          children: /*#__PURE__*/ _jsx(CardContent, {
            className: "pt-6",
            children: /*#__PURE__*/ _jsx("div", {
              className: "flex items-center justify-center py-12",
              children: /*#__PURE__*/ _jsxs("div", {
                className: "text-center space-y-4",
                children: [
                  /*#__PURE__*/ _jsx("div", {
                    className:
                      "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto",
                  }),
                  /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-400",
                    children: "Loading assessment responses...",
                  }),
                ],
              }),
            }),
          }),
        }),
      }),
    });
  }
  return /*#__PURE__*/ _jsx("div", {
    style: {
      backgroundColor: "#000319",
      minHeight: "100vh",
    },
    children: /*#__PURE__*/ _jsxs("div", {
      className: "container mx-auto py-8 space-y-8",
      children: [
        /*#__PURE__*/ _jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            /*#__PURE__*/ _jsxs("div", {
              children: [
                /*#__PURE__*/ _jsx("h1", {
                  className: "text-3xl font-bold text-white",
                  children: "Assessment Responses",
                }),
                /*#__PURE__*/ _jsx("p", {
                  className: "text-gray-400 mt-2",
                  children: "View and manage candidate assessment submissions",
                }),
              ],
            }),
            /*#__PURE__*/ _jsxs(Button, {
              onClick: loadData,
              variant: "outline",
              className: "border-gray-700 text-white hover:bg-gray-800",
              children: [
                /*#__PURE__*/ _jsx(RefreshCw, {
                  className: "h-4 w-4 mr-2",
                }),
                "Refresh",
              ],
            }),
          ],
        }),
        error &&
          /*#__PURE__*/ _jsxs(Alert, {
            variant: "destructive",
            children: [
              /*#__PURE__*/ _jsx(AlertTriangle, {
                className: "h-4 w-4",
              }),
              /*#__PURE__*/ _jsx(AlertDescription, {
                children: error,
              }),
            ],
          }),
        /*#__PURE__*/ _jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-4 gap-6",
          children: [
            /*#__PURE__*/ _jsxs(Card, {
              style: {
                backgroundColor: "#0d1025",
                borderColor: "#1f2937",
              },
              children: [
                /*#__PURE__*/ _jsxs(CardHeader, {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                  children: [
                    /*#__PURE__*/ _jsx(CardTitle, {
                      className: "text-sm font-medium text-white",
                      children: "Total Responses",
                    }),
                    /*#__PURE__*/ _jsx(FileText, {
                      className: "h-4 w-4 text-gray-400",
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(CardContent, {
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "text-2xl font-bold text-white",
                      children: stats.total,
                    }),
                    /*#__PURE__*/ _jsxs("p", {
                      className: "text-xs text-gray-400",
                      children: [
                        "From ",
                        candidates.length,
                        " candidate",
                        candidates.length !== 1 ? "s" : "",
                      ],
                    }),
                  ],
                }),
              ],
            }),
            /*#__PURE__*/ _jsxs(Card, {
              style: {
                backgroundColor: "#0d1025",
                borderColor: "#1f2937",
              },
              children: [
                /*#__PURE__*/ _jsxs(CardHeader, {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                  children: [
                    /*#__PURE__*/ _jsx(CardTitle, {
                      className: "text-sm font-medium text-white",
                      children: "Draft",
                    }),
                    /*#__PURE__*/ _jsx(Clock, {
                      className: "h-4 w-4 text-yellow-500",
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(CardContent, {
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "text-2xl font-bold text-white",
                      children: stats.draft,
                    }),
                    /*#__PURE__*/ _jsx("p", {
                      className: "text-xs text-gray-400",
                      children: "In progress",
                    }),
                  ],
                }),
              ],
            }),
            /*#__PURE__*/ _jsxs(Card, {
              style: {
                backgroundColor: "#0d1025",
                borderColor: "#1f2937",
              },
              children: [
                /*#__PURE__*/ _jsxs(CardHeader, {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                  children: [
                    /*#__PURE__*/ _jsx(CardTitle, {
                      className: "text-sm font-medium text-white",
                      children: "Submitted",
                    }),
                    /*#__PURE__*/ _jsx(CheckCircle, {
                      className: "h-4 w-4 text-green-500",
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(CardContent, {
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "text-2xl font-bold text-white",
                      children: stats.submitted,
                    }),
                    /*#__PURE__*/ _jsx("p", {
                      className: "text-xs text-gray-400",
                      children: "Awaiting review",
                    }),
                  ],
                }),
              ],
            }),
            /*#__PURE__*/ _jsxs(Card, {
              style: {
                backgroundColor: "#0d1025",
                borderColor: "#1f2937",
              },
              children: [
                /*#__PURE__*/ _jsxs(CardHeader, {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                  children: [
                    /*#__PURE__*/ _jsx(CardTitle, {
                      className: "text-sm font-medium text-white",
                      children: "Reviewed",
                    }),
                    /*#__PURE__*/ _jsx(Eye, {
                      className: "h-4 w-4 text-blue-500",
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(CardContent, {
                  children: [
                    /*#__PURE__*/ _jsx("div", {
                      className: "text-2xl font-bold text-white",
                      children: stats.reviewed,
                    }),
                    /*#__PURE__*/ _jsx("p", {
                      className: "text-xs text-gray-400",
                      children: "Completed",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        /*#__PURE__*/ _jsxs(Tabs, {
          value: activeTab,
          onValueChange: setActiveTab,
          children: [
            /*#__PURE__*/ _jsxs(TabsList, {
              className: "grid w-full grid-cols-4 bg-gray-800 border-gray-700",
              children: [
                /*#__PURE__*/ _jsxs(TabsTrigger, {
                  value: "all",
                  className:
                    "flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700",
                  children: [
                    /*#__PURE__*/ _jsx(Users, {
                      className: "h-4 w-4",
                    }),
                    "All",
                    /*#__PURE__*/ _jsx(Badge, {
                      variant: "secondary",
                      className: "ml-1 bg-gray-700 text-gray-300",
                      children: stats.total,
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(TabsTrigger, {
                  value: "draft",
                  className:
                    "flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700",
                  children: [
                    /*#__PURE__*/ _jsx(Clock, {
                      className: "h-4 w-4",
                    }),
                    "Draft",
                    /*#__PURE__*/ _jsx(Badge, {
                      variant: "secondary",
                      className: "ml-1 bg-gray-700 text-gray-300",
                      children: stats.draft,
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(TabsTrigger, {
                  value: "submitted",
                  className:
                    "flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700",
                  children: [
                    /*#__PURE__*/ _jsx(CheckCircle, {
                      className: "h-4 w-4",
                    }),
                    "Submitted",
                    /*#__PURE__*/ _jsx(Badge, {
                      variant: "secondary",
                      className: "ml-1 bg-gray-700 text-gray-300",
                      children: stats.submitted,
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsxs(TabsTrigger, {
                  value: "reviewed",
                  className:
                    "flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700",
                  children: [
                    /*#__PURE__*/ _jsx(Eye, {
                      className: "h-4 w-4",
                    }),
                    "Reviewed",
                    /*#__PURE__*/ _jsx(Badge, {
                      variant: "secondary",
                      className: "ml-1 bg-gray-700 text-gray-300",
                      children: stats.reviewed,
                    }),
                  ],
                }),
              ],
            }),
            /*#__PURE__*/ _jsx(TabsContent, {
              value: "all",
              children: /*#__PURE__*/ _jsx(AssessmentResponseList, {
                responses: getFilteredResponses(),
                assessments: assessments,
                candidates: candidates,
                onViewResponse: handleViewResponse,
                onExportResponse: handleExportResponse,
                onUpdateStatus: handleUpdateStatus,
              }),
            }),
            /*#__PURE__*/ _jsx(TabsContent, {
              value: "draft",
              children: /*#__PURE__*/ _jsx(AssessmentResponseList, {
                responses: getFilteredResponses("draft"),
                assessments: assessments,
                candidates: candidates,
                onViewResponse: handleViewResponse,
                onExportResponse: handleExportResponse,
                onUpdateStatus: handleUpdateStatus,
              }),
            }),
            /*#__PURE__*/ _jsx(TabsContent, {
              value: "submitted",
              children: /*#__PURE__*/ _jsx(AssessmentResponseList, {
                responses: getFilteredResponses("submitted"),
                assessments: assessments,
                candidates: candidates,
                onViewResponse: handleViewResponse,
                onExportResponse: handleExportResponse,
                onUpdateStatus: handleUpdateStatus,
              }),
            }),
            /*#__PURE__*/ _jsx(TabsContent, {
              value: "reviewed",
              children: /*#__PURE__*/ _jsx(AssessmentResponseList, {
                responses: getFilteredResponses("reviewed"),
                assessments: assessments,
                candidates: candidates,
                onViewResponse: handleViewResponse,
                onExportResponse: handleExportResponse,
                onUpdateStatus: handleUpdateStatus,
              }),
            }),
          ],
        }),
        /*#__PURE__*/ _jsx(Dialog, {
          open: !!selectedResponse,
          onOpenChange: handleCloseViewer,
          children: /*#__PURE__*/ _jsxs(DialogContent, {
            className: "max-w-4xl max-h-[90vh] overflow-y-auto",
            children: [
              /*#__PURE__*/ _jsxs(DialogHeader, {
                children: [
                  /*#__PURE__*/ _jsx(DialogTitle, {
                    children: "Assessment Response Details",
                  }),
                  /*#__PURE__*/ _jsx(DialogDescription, {
                    children:
                      "Review the candidate's responses to the assessment questions",
                  }),
                ],
              }),
              selectedResponse &&
                /*#__PURE__*/ _jsx(AssessmentResponseViewer, {
                  response: selectedResponse,
                  assessment: assessments.find(
                    (a) => a.id === selectedResponse.assessmentId
                  ),
                  candidate: candidates.find(
                    (c) => c.id === selectedResponse.candidateId
                  ),
                  onClose: handleCloseViewer,
                }),
            ],
          }),
        }),
      ],
    }),
  });
};
