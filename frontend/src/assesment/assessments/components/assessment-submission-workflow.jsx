import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { Separator } from "../../../components/ui/separator";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { CheckCircle, AlertTriangle, Send, Save, Clock, FileText, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { validateAllResponses, getAssessmentCompletionPercentage } from "../utils/form-validation";
import { evaluateAllConditionalLogic } from "../utils/conditional-logic";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const AssessmentSubmissionWorkflow = ({
  assessment,
  candidate,
  responses,
  onSave,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSaving = false
}) => {
  const [showValidationDetails, setShowValidationDetails] = useState(false);

  // Evaluate conditional logic and validation
  const conditionalStates = evaluateAllConditionalLogic(assessment, responses);
  const validationErrors = validateAllResponses(assessment, responses, conditionalStates);
  const completionPercentage = getAssessmentCompletionPercentage(assessment, responses, conditionalStates);

  // Check if assessment can be submitted
  const canSubmit = Object.keys(validationErrors).length === 0;
  const hasResponses = Object.keys(responses).length > 0;

  // Handle save draft
  const handleSave = useCallback(async () => {
    if (!onSave || !hasResponses) return;
    try {
      await onSave(responses);
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [onSave, responses, hasResponses]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!onSubmit || !canSubmit) return;
    try {
      await onSubmit(responses);
    } catch (error) {
      console.error("Failed to submit assessment:", error);
    }
  }, [onSubmit, responses, canSubmit]);

  // Get validation summary
  const getValidationSummary = () => {
    const errorCount = Object.keys(validationErrors).length;
    const totalQuestions = assessment.sections.reduce((sum, section) => {
      return sum + section.questions.filter(q => conditionalStates[q.id]?.visible).length;
    }, 0);
    const answeredQuestions = Object.keys(responses).filter(questionId => {
      const state = conditionalStates[questionId];
      return state?.visible && responses[questionId] !== undefined && responses[questionId] !== null && responses[questionId] !== "";
    }).length;
    return {
      errorCount,
      totalQuestions,
      answeredQuestions,
      missingRequired: errorCount
    };
  };
  const validationSummary = getValidationSummary();
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs(Card, {
      children: [/*#__PURE__*/_jsxs(CardHeader, {
        children: [/*#__PURE__*/_jsxs(CardTitle, {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(FileText, {
            className: "h-5 w-5"
          }), "Assessment Submission"]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-4 text-sm text-muted-foreground",
          children: [/*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(User, {
              className: "h-4 w-4"
            }), candidate.name]
          }), /*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(Calendar, {
              className: "h-4 w-4"
            }), format(new Date(), "PPP")]
          })]
        })]
      }), /*#__PURE__*/_jsx(CardContent, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-medium text-lg",
              children: assessment.title
            }), assessment.description && /*#__PURE__*/_jsx("p", {
              className: "text-sm text-muted-foreground mt-1",
              children: assessment.description
            })]
          }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm font-medium",
                children: "Progress"
              }), /*#__PURE__*/_jsxs(Badge, {
                variant: "outline",
                children: [completionPercentage, "% Complete"]
              })]
            }), /*#__PURE__*/_jsx(Progress, {
              value: completionPercentage,
              className: "w-full"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: [validationSummary.answeredQuestions, " of", " ", validationSummary.totalQuestions, " questions answered"]
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsxs(Card, {
      children: [/*#__PURE__*/_jsx(CardHeader, {
        children: /*#__PURE__*/_jsxs(CardTitle, {
          className: "flex items-center gap-2",
          children: [canSubmit ? /*#__PURE__*/_jsx(CheckCircle, {
            className: "h-5 w-5 text-green-500"
          }) : /*#__PURE__*/_jsx(AlertTriangle, {
            className: "h-5 w-5 text-yellow-500"
          }), "Validation Status"]
        })
      }), /*#__PURE__*/_jsx(CardContent, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "space-y-4",
          children: [canSubmit ? /*#__PURE__*/_jsxs(Alert, {
            children: [/*#__PURE__*/_jsx(CheckCircle, {
              className: "h-4 w-4"
            }), /*#__PURE__*/_jsx(AlertDescription, {
              children: "All required questions have been answered. Your assessment is ready for submission."
            })]
          }) : /*#__PURE__*/_jsxs(Alert, {
            variant: "destructive",
            children: [/*#__PURE__*/_jsx(AlertTriangle, {
              className: "h-4 w-4"
            }), /*#__PURE__*/_jsxs(AlertDescription, {
              children: [validationSummary.missingRequired, " required question", validationSummary.missingRequired !== 1 ? "s" : "", " need", validationSummary.missingRequired === 1 ? "s" : "", " to be answered before submission."]
            })]
          }), !canSubmit && /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsxs(Button, {
              variant: "outline",
              size: "sm",
              onClick: () => setShowValidationDetails(!showValidationDetails),
              children: [showValidationDetails ? "Hide" : "Show", " Validation Details"]
            }), showValidationDetails && /*#__PURE__*/_jsxs("div", {
              className: "bg-muted/50 p-4 rounded-md space-y-2",
              children: [/*#__PURE__*/_jsx("h4", {
                className: "font-medium text-sm",
                children: "Missing Required Responses:"
              }), /*#__PURE__*/_jsx("ul", {
                className: "space-y-1",
                children: Object.entries(validationErrors).map(([questionId, error]) => {
                  // Find the question
                  let questionTitle = "Unknown Question";
                  for (const section of assessment.sections) {
                    const question = section.questions.find(q => q.id === questionId);
                    if (question) {
                      questionTitle = question.title;
                      break;
                    }
                  }
                  return /*#__PURE__*/_jsxs("li", {
                    className: "text-sm text-red-600",
                    children: ["\u2022 ", questionTitle, ": ", error]
                  }, questionId);
                })
              })]
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsx(Card, {
      children: /*#__PURE__*/_jsxs(CardContent, {
        className: "pt-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex items-center gap-2",
            children: onCancel && /*#__PURE__*/_jsx(Button, {
              variant: "outline",
              onClick: onCancel,
              children: "Cancel"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [onSave && hasResponses && /*#__PURE__*/_jsx(Button, {
              variant: "outline",
              onClick: handleSave,
              disabled: isSaving || isSubmitting,
              children: isSaving ? /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "h-4 w-4 mr-2 animate-spin"
                }), "Saving..."]
              }) : /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Save, {
                  className: "h-4 w-4 mr-2"
                }), "Save Draft"]
              })
            }), onSubmit && /*#__PURE__*/_jsx(Button, {
              onClick: handleSubmit,
              disabled: !canSubmit || isSubmitting || isSaving,
              children: isSubmitting ? /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "h-4 w-4 mr-2 animate-spin"
                }), "Submitting..."]
              }) : /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Send, {
                  className: "h-4 w-4 mr-2"
                }), "Submit Assessment"]
              })
            })]
          })]
        }), !canSubmit && /*#__PURE__*/_jsx("div", {
          className: "mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md",
          children: /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-yellow-800",
            children: [/*#__PURE__*/_jsx("strong", {
              children: "Note:"
            }), " You can save your progress as a draft at any time. Complete all required questions to enable submission."]
          })
        })]
      })
    })]
  });
};