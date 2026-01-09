import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Eye, Download, Clock, CheckCircle, AlertCircle, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentResponseViewer = ({
  response,
  assessment,
  candidate,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Expand all sections by default
  useEffect(() => {
    const sectionIds = assessment.sections.map(s => s.id);
    setExpandedSections(new Set(sectionIds));
  }, [assessment.sections]);
  const toggleSection = sectionId => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };
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
  const findQuestionById = questionId => {
    for (const section of assessment.sections) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return undefined;
  };
  const renderResponseValue = (question, value) => {
    if (value === null || value === undefined || value === "") {
      return /*#__PURE__*/_jsx("span", {
        className: "text-muted-foreground italic",
        children: "No response"
      });
    }
    switch (question.type) {
      case "single-choice":
        return /*#__PURE__*/_jsx("span", {
          className: "font-medium",
          children: value
        });
      case "multi-choice":
        if (Array.isArray(value)) {
          return /*#__PURE__*/_jsx("div", {
            className: "flex flex-wrap gap-1",
            children: value.map((item, index) => /*#__PURE__*/_jsx(Badge, {
              variant: "secondary",
              className: "text-xs",
              children: item
            }, index))
          });
        }
        return /*#__PURE__*/_jsx("span", {
          className: "font-medium",
          children: String(value)
        });
      case "short-text":
        return /*#__PURE__*/_jsx("span", {
          className: "font-medium",
          children: value
        });
      case "long-text":
        return /*#__PURE__*/_jsx("div", {
          className: "bg-muted/50 p-3 rounded-md",
          children: /*#__PURE__*/_jsx("pre", {
            className: "whitespace-pre-wrap text-sm font-medium",
            children: value
          })
        });
      case "numeric":
        return /*#__PURE__*/_jsx("span", {
          className: "font-medium font-mono",
          children: value
        });
      case "file-upload":
        if (typeof value === "object" && value.name) {
          return /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 p-2 bg-muted/50 rounded-md",
            children: [/*#__PURE__*/_jsx(FileText, {
              className: "h-4 w-4"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-medium",
              children: value.name
            }), /*#__PURE__*/_jsxs(Badge, {
              variant: "outline",
              className: "text-xs",
              children: [(value.size / 1024).toFixed(1), " KB"]
            })]
          });
        }
        return /*#__PURE__*/_jsx("span", {
          className: "font-medium",
          children: String(value)
        });
      default:
        return /*#__PURE__*/_jsx("span", {
          className: "font-medium",
          children: String(value)
        });
    }
  };
  const calculateCompletionPercentage = () => {
    const totalQuestions = assessment.sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = response.responses.length;
    return totalQuestions > 0 ? Math.round(answeredQuestions / totalQuestions * 100) : 0;
  };
  const exportResponse = () => {
    const exportData = {
      candidate: {
        name: candidate.name,
        email: candidate.email
      },
      assessment: {
        title: assessment.title,
        description: assessment.description
      },
      response: {
        status: response.status,
        submittedAt: response.submittedAt,
        responses: response.responses.map(r => {
          const question = findQuestionById(r.questionId);
          return {
            question: question?.title || "Unknown Question",
            type: r.type,
            value: r.value
          };
        })
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assessment-response-${candidate.name}-${format(response.submittedAt, "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs(Card, {
      children: [/*#__PURE__*/_jsx(CardHeader, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(User, {
                className: "h-5 w-5"
              }), candidate.name, "'s Assessment Response"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-4 text-sm text-muted-foreground",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(FileText, {
                  className: "h-4 w-4"
                }), assessment.title]
              }), /*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Calendar, {
                  className: "h-4 w-4"
                }), format(response.submittedAt, "PPP")]
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "flex items-center gap-2",
            children: /*#__PURE__*/_jsxs(Badge, {
              className: getStatusColor(response.status),
              children: [getStatusIcon(response.status), /*#__PURE__*/_jsx("span", {
                className: "ml-1 capitalize",
                children: response.status
              })]
            })
          })]
        })
      }), /*#__PURE__*/_jsx(CardContent, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsxs("p", {
              className: "text-sm font-medium",
              children: ["Completion: ", calculateCompletionPercentage(), "%"]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: [response.responses.length, " of", " ", assessment.sections.reduce((sum, s) => sum + s.questions.length, 0), " ", "questions answered"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsxs(Button, {
              variant: "outline",
              size: "sm",
              onClick: exportResponse,
              children: [/*#__PURE__*/_jsx(Download, {
                className: "h-4 w-4 mr-2"
              }), "Export"]
            }), onClose && /*#__PURE__*/_jsx(Button, {
              variant: "outline",
              size: "sm",
              onClick: onClose,
              children: "Close"
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "space-y-4",
      children: assessment.sections.map(section => {
        const sectionResponses = response.responses.filter(r => section.questions.some(q => q.id === r.questionId));
        const isExpanded = expandedSections.has(section.id);
        return /*#__PURE__*/_jsxs(Card, {
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "cursor-pointer hover:bg-muted/50 transition-colors",
            onClick: () => toggleSection(section.id),
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsx(CardTitle, {
                className: "text-lg",
                children: section.title
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsxs(Badge, {
                  variant: "outline",
                  children: [sectionResponses.length, " / ", section.questions.length, " ", "answered"]
                }), /*#__PURE__*/_jsx(Button, {
                  variant: "ghost",
                  size: "sm",
                  children: isExpanded ? "Collapse" : "Expand"
                })]
              })]
            }), section.description && /*#__PURE__*/_jsx("p", {
              className: "text-sm text-muted-foreground",
              children: section.description
            })]
          }), isExpanded && /*#__PURE__*/_jsx(CardContent, {
            children: /*#__PURE__*/_jsx(ScrollArea, {
              className: "max-h-96",
              children: /*#__PURE__*/_jsx("div", {
                className: "space-y-4",
                children: section.questions.map((question, questionIndex) => {
                  const questionResponse = response.responses.find(r => r.questionId === question.id);
                  return /*#__PURE__*/_jsxs("div", {
                    children: [questionIndex > 0 && /*#__PURE__*/_jsx(Separator, {
                      className: "my-4"
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "space-y-2",
                      children: [/*#__PURE__*/_jsxs("div", {
                        className: "flex items-start justify-between",
                        children: [/*#__PURE__*/_jsxs("h4", {
                          className: "font-medium text-sm",
                          children: [question.title, question.required && /*#__PURE__*/_jsx("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                          })]
                        }), /*#__PURE__*/_jsx(Badge, {
                          variant: "outline",
                          className: "text-xs",
                          children: question.type
                        })]
                      }), question.description && /*#__PURE__*/_jsx("p", {
                        className: "text-xs text-muted-foreground",
                        children: question.description
                      }), /*#__PURE__*/_jsx("div", {
                        className: "mt-2",
                        children: questionResponse ? renderResponseValue(question, questionResponse.value) : /*#__PURE__*/_jsx("span", {
                          className: "text-muted-foreground italic text-sm",
                          children: "No response provided"
                        })
                      })]
                    })]
                  }, question.id);
                })
              })
            })
          })]
        }, section.id);
      })
    })]
  });
};