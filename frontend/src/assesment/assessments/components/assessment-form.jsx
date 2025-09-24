import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  AlertCircle,
} from "lucide-react";
import {
  SingleChoiceField,
  MultiChoiceField,
  TextField,
  NumericField,
  FileUploadField,
} from "./form-fields";
import { evaluateAllConditionalLogic } from "../utils/conditional-logic";
import {
  validateAllResponses,
  isSectionComplete,
  getAssessmentCompletionPercentage,
  getSectionCompletionPercentage,
  validateQuestionResponse as validateQuestion,
} from "../utils/form-validation";
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
const defaultConfig = {
  allowPartialSave: true,
  showProgress: true,
  enableSectionNavigation: true,
  validateOnChange: false,
  validateOnBlur: true,
  autoSave: false,
  // Disabled by default for this implementation
  autoSaveInterval: 30000,
};
export const AssessmentForm = ({
  assessment,
  initialResponses = {},
  config = {},
  onResponseChange,
  onSectionChange,
  onSave,
  onSubmit,
  onEvent,
  readOnly = false,
  isPreview = false,
}) => {
  const effectiveConfig = {
    ...defaultConfig,
    ...config,
  };

  // Form state
  const [formState, setFormState] = useState({
    responses: initialResponses,
    errors: {},
    touched: {},
    isSubmitting: false,
    currentSection: 0,
    completedSections: new Set(),
    conditionalStates: {},
  });

  // Evaluate conditional logic whenever responses change
  const conditionalStates = useMemo(() => {
    return (
      formState.conditionalStates ||
      evaluateAllConditionalLogic(assessment, formState.responses)
    );
  }, [assessment, formState.responses, formState.conditionalStates]);

  // Initialize conditional states on mount
  useEffect(() => {
    if (
      !formState.conditionalStates ||
      Object.keys(formState.conditionalStates).length === 0
    ) {
      const initialConditionalStates = evaluateAllConditionalLogic(
        assessment,
        formState.responses
      );
      setFormState((prev) => ({
        ...prev,
        conditionalStates: initialConditionalStates,
      }));
    }
  }, [assessment, formState.responses, formState.conditionalStates]);

  // Emit events
  const emitEvent = useCallback(
    (event) => {
      const fullEvent = {
        ...event,
        timestamp: new Date(),
      };
      onEvent?.(fullEvent);
    },
    [onEvent]
  );

  // Handle field changes
  const handleFieldChange = useCallback(
    (questionId, value) => {
      setFormState((prev) => {
        const newResponses = {
          ...prev.responses,
          [questionId]: value,
        };

        // Re-evaluate conditional logic with new responses
        const newConditionalStates = evaluateAllConditionalLogic(
          assessment,
          newResponses
        );

        // Clear responses for questions that are now hidden
        const finalResponses = {
          ...newResponses,
        };
        for (const section of assessment.sections) {
          for (const question of section.questions) {
            const state = newConditionalStates[question.id];
            if (!state?.visible && finalResponses[question.id] !== undefined) {
              delete finalResponses[question.id];
            }
          }
        }

        // Clear error for this field if it exists
        const newErrors = {
          ...prev.errors,
        };
        delete newErrors[questionId];

        // Clear errors for hidden questions
        for (const section of assessment.sections) {
          for (const question of section.questions) {
            const state = newConditionalStates[question.id];
            if (!state?.visible && newErrors[question.id]) {
              delete newErrors[question.id];
            }
          }
        }

        // Validate on change if enabled
        let fieldError;
        if (effectiveConfig.validateOnChange) {
          const question = findQuestionById(assessment, questionId);
          if (question) {
            const state = newConditionalStates[questionId];
            fieldError =
              validateQuestionResponse(
                question,
                value,
                finalResponses,
                state?.required
              ) || undefined;
            if (fieldError) {
              newErrors[questionId] = fieldError;
            }
          }
        }
        return {
          ...prev,
          responses: finalResponses,
          errors: newErrors,
          conditionalStates: newConditionalStates,
        };
      });

      // Emit change event
      emitEvent({
        type: "field_change",
        questionId,
        value,
      });

      // Call external handler
      onResponseChange?.(questionId, value);
    },
    [assessment, effectiveConfig.validateOnChange, emitEvent, onResponseChange]
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (questionId) => {
      if (!effectiveConfig.validateOnBlur) return;
      setFormState((prev) => {
        const question = findQuestionById(assessment, questionId);
        if (!question) return prev;
        const state = conditionalStates[questionId];
        const value = prev.responses[questionId];
        const error = validateQuestionResponse(
          question,
          value,
          prev.responses,
          state?.required
        );
        const newErrors = {
          ...prev.errors,
        };
        const newTouched = {
          ...prev.touched,
          [questionId]: true,
        };
        if (error) {
          newErrors[questionId] = error;
          emitEvent({
            type: "validation_error",
            questionId,
            error,
          });
        } else {
          delete newErrors[questionId];
        }
        return {
          ...prev,
          errors: newErrors,
          touched: newTouched,
        };
      });
      emitEvent({
        type: "field_blur",
        questionId,
      });
    },
    [assessment, conditionalStates, effectiveConfig.validateOnBlur, emitEvent]
  );

  // Section navigation
  const navigationState = useMemo(() => {
    const totalSections = assessment.sections.length;
    const currentSection = formState.currentSection;

    // Check if current section is complete
    const currentSectionData = assessment.sections[currentSection];
    // In preview mode, allow navigation without completion requirement
    const canGoNext =
      currentSection < totalSections - 1 &&
      (isPreview ||
        isSectionComplete(
          currentSectionData,
          formState.responses,
          conditionalStates
        ));
    const canGoPrevious = currentSection > 0;

    console.log("🔍 Navigation state:", {
      currentSection,
      totalSections,
      isPreview,
      canGoNext,
      canGoPrevious,
      sectionComplete: currentSectionData
        ? isSectionComplete(
            currentSectionData,
            formState.responses,
            conditionalStates
          )
        : "N/A",
    });

    // Can submit if all sections are complete
    const allErrors = validateAllResponses(
      assessment,
      formState.responses,
      conditionalStates
    );
    const canSubmit = Object.keys(allErrors).length === 0;
    return {
      currentSection,
      totalSections,
      canGoNext,
      canGoPrevious,
      canSubmit,
    };
  }, [
    assessment,
    formState.currentSection,
    formState.responses,
    conditionalStates,
  ]);

  // Navigate to section
  const navigateToSection = useCallback(
    (sectionIndex) => {
      console.log(
        "🔄 Navigating to section:",
        sectionIndex,
        "Total sections:",
        assessment.sections.length
      );
      if (sectionIndex < 0 || sectionIndex >= assessment.sections.length) {
        console.log("❌ Navigation blocked - invalid section index");
        return;
      }
      setFormState((prev) => ({
        ...prev,
        currentSection: sectionIndex,
      }));
      emitEvent({
        type: "section_change",
        sectionIndex,
      });
      onSectionChange?.(sectionIndex);
      console.log("✅ Navigation completed to section:", sectionIndex);
    },
    [assessment.sections.length, emitEvent, onSectionChange]
  );

  // Save form
  const handleSave = useCallback(async () => {
    if (!onSave || formState.isSubmitting) return;
    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));
    try {
      await onSave(formState.responses);
      emitEvent({
        type: "auto_save",
      });
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [onSave, formState.responses, formState.isSubmitting, emitEvent]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!onSubmit || formState.isSubmitting) return;

    // Validate all responses
    const errors = validateAllResponses(
      assessment,
      formState.responses,
      conditionalStates
    );
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      emitEvent({
        type: "validation_error",
        error: "Please fix all validation errors before submitting",
      });
      return;
    }
    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));
    emitEvent({
      type: "submission_start",
    });
    try {
      await onSubmit(formState.responses);
      emitEvent({
        type: "submission_success",
      });
    } catch (error) {
      emitEvent({
        type: "submission_error",
        error: error instanceof Error ? error.message : "Submission failed",
      });
    } finally {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [
    onSubmit,
    formState.responses,
    formState.isSubmitting,
    assessment,
    conditionalStates,
    emitEvent,
  ]);

  // Render question field based on type
  const renderQuestionField = useCallback(
    (question) => {
      const value = formState.responses[question.id];
      const error = formState.errors[question.id];
      const state = conditionalStates[question.id];

      // Don't render hidden questions
      if (!state?.visible) return null;
      const commonProps = {
        question,
        value,
        onChange: (newValue) => handleFieldChange(question.id, newValue),
        onBlur: () => handleFieldBlur(question.id),
        error,
        disabled: readOnly || formState.isSubmitting,
        required: state.required,
      };
      switch (question.type) {
        case "single-choice":
          return /*#__PURE__*/ _jsx(
            SingleChoiceField,
            {
              ...commonProps,
            },
            question.id
          );
        case "multi-choice":
          return /*#__PURE__*/ _jsx(
            MultiChoiceField,
            {
              ...commonProps,
            },
            question.id
          );
        case "short-text":
        case "long-text":
          return /*#__PURE__*/ _jsx(
            TextField,
            {
              ...commonProps,
            },
            question.id
          );
        case "numeric":
          return /*#__PURE__*/ _jsx(
            NumericField,
            {
              ...commonProps,
            },
            question.id
          );
        case "file-upload":
          return /*#__PURE__*/ _jsx(
            FileUploadField,
            {
              ...commonProps,
            },
            question.id
          );
        default:
          return /*#__PURE__*/ _jsx(
            "div",
            {
              className:
                "p-4 border border-dashed border-muted-foreground/25 rounded-md",
              children: /*#__PURE__*/ _jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: ["Unsupported question type: ", question.type],
              }),
            },
            question.id
          );
      }
    },
    [
      formState.responses,
      formState.errors,
      formState.isSubmitting,
      conditionalStates,
      readOnly,
      handleFieldChange,
      handleFieldBlur,
    ]
  );

  // Get current section
  const currentSection = assessment.sections[formState.currentSection];
  const visibleQuestions =
    currentSection?.questions.filter((q) => conditionalStates[q.id]?.visible) ||
    [];

  // Handle empty assessment
  if (!assessment.sections || assessment.sections.length === 0) {
    return /*#__PURE__*/ _jsx("div", {
      className: "space-y-6",
      style: {
        backgroundColor: "#000319",
        minHeight: isPreview ? "auto" : "100vh",
        padding: "1.5rem",
      },
      children: /*#__PURE__*/ _jsx(Card, {
        style: {
          backgroundColor: "#0d1025",
          borderColor: "#1f2937",
        },
        children: /*#__PURE__*/ _jsx(CardContent, {
          className: "pt-6",
          children: /*#__PURE__*/ _jsxs("div", {
            className: "text-center py-8 text-muted-foreground text-white",
            children: [
              /*#__PURE__*/ _jsx(AlertCircle, {
                className: "h-8 w-8 mx-auto mb-2",
              }),
              /*#__PURE__*/ _jsx("p", {
                children: "No sections available in this assessment",
              }),
            ],
          }),
        }),
      }),
    });
  }

  // Calculate progress
  const overallProgress = getAssessmentCompletionPercentage(
    assessment,
    formState.responses,
    conditionalStates
  );
  const sectionProgress = getSectionCompletionPercentage(
    currentSection,
    formState.responses,
    conditionalStates
  );
  return /*#__PURE__*/ _jsxs("div", {
    className: "space-y-6",
    style: {
      backgroundColor: "#000319",
      minHeight: isPreview ? "auto" : "100vh",
      padding: "1.5rem",
    },
    children: [
      effectiveConfig.showProgress &&
        /*#__PURE__*/ _jsx(Card, {
          style: {
            backgroundColor: "#0d1025",
            borderColor: "#1f2937",
          },
          children: /*#__PURE__*/ _jsx(CardContent, {
            className: "pt-6",
            children: /*#__PURE__*/ _jsxs("div", {
              className: "space-y-4",
              children: [
                /*#__PURE__*/ _jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    /*#__PURE__*/ _jsx("h3", {
                      className: "font-medium text-white",
                      children: "Assessment Progress",
                    }),
                    /*#__PURE__*/ _jsxs(Badge, {
                      variant: "outline",
                      className: "border-gray-700 text-gray-300 bg-gray-800",
                      children: [overallProgress, "% Complete"],
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsx(Progress, {
                  value: overallProgress,
                  className: "w-full",
                }),
                effectiveConfig.enableSectionNavigation &&
                  /*#__PURE__*/ _jsxs("div", {
                    className:
                      "flex items-center justify-between text-sm text-gray-400",
                    children: [
                      /*#__PURE__*/ _jsxs("span", {
                        children: [
                          "Section ",
                          formState.currentSection + 1,
                          " of",
                          " ",
                          assessment.sections.length,
                        ],
                      }),
                      /*#__PURE__*/ _jsxs("span", {
                        children: [sectionProgress, "% of section complete"],
                      }),
                    ],
                  }),
              ],
            }),
          }),
        }),
      /*#__PURE__*/ _jsxs(Card, {
        style: {
          backgroundColor: "#0d1025",
          borderColor: "#1f2937",
        },
        children: [
          /*#__PURE__*/ _jsxs(CardHeader, {
            children: [
              /*#__PURE__*/ _jsxs(CardTitle, {
                className: "flex items-center justify-between text-white",
                children: [
                  /*#__PURE__*/ _jsx("span", {
                    children:
                      currentSection?.title ||
                      `Section ${formState.currentSection + 1}`,
                  }),
                  visibleQuestions.length > 0 &&
                    /*#__PURE__*/ _jsxs(Badge, {
                      variant: "secondary",
                      className: "bg-gray-800 text-gray-300",
                      children: [
                        visibleQuestions.length,
                        " question",
                        visibleQuestions.length !== 1 ? "s" : "",
                      ],
                    }),
                ],
              }),
              currentSection?.description &&
                /*#__PURE__*/ _jsx("p", {
                  className: "text-sm text-gray-400",
                  children: currentSection.description,
                }),
            ],
          }),
          /*#__PURE__*/ _jsx(CardContent, {
            className: "space-y-6",
            children:
              visibleQuestions.length === 0
                ? /*#__PURE__*/ _jsxs("div", {
                    className:
                      "text-center py-8 text-muted-foreground text-white",
                    children: [
                      /*#__PURE__*/ _jsx(AlertCircle, {
                        className: "h-8 w-8 mx-auto mb-2",
                      }),
                      /*#__PURE__*/ _jsx("p", {
                        children: "No questions to display in this section",
                      }),
                    ],
                  })
                : visibleQuestions.map(renderQuestionField),
          }),
        ],
      }),
      /*#__PURE__*/ _jsx(Card, {
        style: {
          backgroundColor: "#0d1025",
          borderColor: "#1f2937",
        },
        children: /*#__PURE__*/ _jsx(CardContent, {
          className: "pt-6",
          children: /*#__PURE__*/ _jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              /*#__PURE__*/ _jsx("div", {
                className: "flex items-center space-x-2",
                children:
                  effectiveConfig.enableSectionNavigation &&
                  /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                      /*#__PURE__*/ _jsxs(Button, {
                        variant: "outline",
                        className:
                          "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                        onClick: () => {
                          console.log("🖱️ Previous button clicked");
                          if (formState.currentSection === 0) {
                            console.log("ℹ️ Already at first section");
                            alert("Already at the first section.");
                          } else {
                            navigateToSection(formState.currentSection - 1);
                          }
                        },
                        disabled:
                          !navigationState.canGoPrevious ||
                          formState.isSubmitting,
                        children: [
                          /*#__PURE__*/ _jsx(ChevronLeft, {
                            className: "h-4 w-4 mr-2",
                          }),
                          "Previous",
                        ],
                      }),
                      /*#__PURE__*/ _jsxs(Button, {
                        variant: "outline",
                        className:
                          "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                        onClick: () => {
                          console.log("🖱️ Next button clicked");
                          if (navigationState.totalSections === 1) {
                            console.log("ℹ️ Only one section available");
                            alert(
                              "This assessment only has one section. Add more sections to test navigation."
                            );
                          } else {
                            navigateToSection(formState.currentSection + 1);
                          }
                        },
                        disabled:
                          !navigationState.canGoNext || formState.isSubmitting,
                        children: [
                          "Next",
                          /*#__PURE__*/ _jsx(ChevronRight, {
                            className: "h-4 w-4 ml-2",
                          }),
                        ],
                      }),
                    ],
                  }),
              }),
              /*#__PURE__*/ _jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                  !readOnly &&
                    effectiveConfig.allowPartialSave &&
                    onSave &&
                    /*#__PURE__*/ _jsxs(Button, {
                      variant: "outline",
                      className:
                        "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                      onClick: handleSave,
                      disabled: formState.isSubmitting,
                      children: [
                        /*#__PURE__*/ _jsx(Save, {
                          className: "h-4 w-4 mr-2",
                        }),
                        "Save Draft",
                      ],
                    }),
                  !readOnly &&
                    onSubmit &&
                    /*#__PURE__*/ _jsxs(Button, {
                      onClick: handleSubmit,
                      disabled:
                        !navigationState.canSubmit || formState.isSubmitting,
                      children: [
                        /*#__PURE__*/ _jsx(Send, {
                          className: "h-4 w-4 mr-2",
                        }),
                        formState.isSubmitting
                          ? "Submitting..."
                          : "Submit Assessment",
                      ],
                    }),
                ],
              }),
            ],
          }),
        }),
      }),
    ],
  });
};

// Helper function to find question by ID
function findQuestionById(assessment, questionId) {
  for (const section of assessment.sections) {
    const question = section.questions.find((q) => q.id === questionId);
    if (question) return question;
  }
  return undefined;
}

// Helper function for validation (imported from utils but need to use here)
function validateQuestionResponse(
  question,
  value,
  allResponses,
  isRequired = question.required
) {
  return validateQuestion(question, value, allResponses, isRequired);
}
