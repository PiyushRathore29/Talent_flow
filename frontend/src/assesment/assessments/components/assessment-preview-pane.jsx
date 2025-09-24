import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { AssessmentForm } from "./assessment-form";
import { evaluateAllConditionalLogic } from "../utils/conditional-logic";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentPreviewPane = ({
  assessment,
  responses,
  onResponseChange,
  className = ""
}) => {
  // Evaluate conditional logic to show/hide questions
  const conditionalStates = React.useMemo(() => {
    return evaluateAllConditionalLogic(assessment, responses);
  }, [assessment, responses]);

  // Count visible questions
  const visibleQuestionCount = React.useMemo(() => {
    let count = 0;
    for (const section of assessment.sections) {
      for (const question of section.questions) {
        if (conditionalStates[question.id]?.visible) {
          count++;
        }
      }
    }
    return count;
  }, [assessment.sections, conditionalStates]);

  // Count answered questions
  const answeredQuestionCount = React.useMemo(() => {
    let count = 0;
    for (const section of assessment.sections) {
      for (const question of section.questions) {
        const state = conditionalStates[question.id];
        if (state?.visible && responses[question.id] !== undefined && responses[question.id] !== "") {
          count++;
        }
      }
    }
    return count;
  }, [assessment.sections, conditionalStates, responses]);

  // Calculate completion percentage
  const completionPercentage = visibleQuestionCount > 0 ? Math.round(answeredQuestionCount / visibleQuestionCount * 100) : 0;
  return /*#__PURE__*/_jsxs("div", {
    className: `space-y-4 ${className}`,
    children: [/*#__PURE__*/_jsxs(Card, {
      children: [/*#__PURE__*/_jsx(CardHeader, {
        className: "pb-3",
        children: /*#__PURE__*/_jsxs(CardTitle, {
          className: "flex items-center justify-between text-lg",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/*#__PURE__*/_jsx(Eye, {
              className: "h-5 w-5"
            }), /*#__PURE__*/_jsx("h2", {
              children: "Live Preview"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/*#__PURE__*/_jsxs(Badge, {
              variant: "outline",
              children: [answeredQuestionCount, "/", visibleQuestionCount, " answered"]
            }), /*#__PURE__*/_jsxs(Badge, {
              variant: completionPercentage === 100 ? "default" : "secondary",
              children: [completionPercentage, "% complete"]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(CardContent, {
        className: "pt-0",
        children: /*#__PURE__*/_jsx("div", {
          className: "text-sm text-muted-foreground",
          children: "This preview shows how the assessment will appear to candidates. Questions will show/hide based on conditional logic as you fill out responses."
        })
      })]
    }), Object.values(conditionalStates).some(state => !state.visible) && /*#__PURE__*/_jsx(Card, {
      className: "border-amber-200 bg-amber-50",
      children: /*#__PURE__*/_jsx(CardContent, {
        className: "pt-4",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-start space-x-2",
          children: [/*#__PURE__*/_jsx(EyeOff, {
            className: "h-4 w-4 text-amber-600 mt-0.5"
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-sm",
            children: [/*#__PURE__*/_jsx("p", {
              className: "font-medium text-amber-800",
              children: "Conditional Logic Active"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-amber-700",
              children: "Some questions are hidden based on current responses. Change your answers to see different questions appear."
            })]
          })]
        })
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "border-2 border-dashed border-muted-foreground/25 rounded-lg p-1",
      children: /*#__PURE__*/_jsx(AssessmentForm, {
        key: `${assessment.id}-${assessment.sections.length}-${JSON.stringify(assessment.sections.map(s => s.questions.length))}`,
        assessment: assessment,
        initialResponses: responses,
        onResponseChange: onResponseChange,
        isPreview: true,
        config: {
          showProgress: true,
          enableSectionNavigation: true,
          validateOnBlur: true,
          allowPartialSave: false // No save in preview
        }
      })
    })]
  });
};