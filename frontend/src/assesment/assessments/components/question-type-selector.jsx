import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  CheckCircle,
  CheckSquare,
  Type,
  FileText,
  Hash,
  Upload,
} from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const questionTypes = [
  {
    type: "single-choice",
    label: "Single Choice",
    description: "Select one option from multiple choices",
    icon: /*#__PURE__*/ _jsx(CheckCircle, {
      className: "h-5 w-5",
    }),
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    type: "multi-choice",
    label: "Multiple Choice",
    description: "Select multiple options from choices",
    icon: /*#__PURE__*/ _jsx(CheckSquare, {
      className: "h-5 w-5",
    }),
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    type: "short-text",
    label: "Short Text",
    description: "Brief text response (single line)",
    icon: /*#__PURE__*/ _jsx(Type, {
      className: "h-5 w-5",
    }),
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    type: "long-text",
    label: "Long Text",
    description: "Extended text response (paragraph)",
    icon: /*#__PURE__*/ _jsx(FileText, {
      className: "h-5 w-5",
    }),
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    type: "numeric",
    label: "Numeric",
    description: "Number input with optional range validation",
    icon: /*#__PURE__*/ _jsx(Hash, {
      className: "h-5 w-5",
    }),
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  {
    type: "file-upload",
    label: "File Upload",
    description: "File attachment (stub implementation)",
    icon: /*#__PURE__*/ _jsx(Upload, {
      className: "h-5 w-5",
    }),
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
];
export const QuestionTypeSelector = ({
  selectedType,
  onTypeSelect,
  className = "",
}) => {
  return /*#__PURE__*/ _jsx("div", {
    className: `grid grid-cols-2 gap-2 ${className}`,
    children: questionTypes.map((questionType) =>
      /*#__PURE__*/ _jsx(
        Card,
        {
          className: `cursor-pointer transition-all hover:shadow-md ${
            selectedType === questionType.type
              ? "ring-2 ring-primary shadow-md"
              : "hover:border-muted-foreground/50"
          }`,
          onClick: () => onTypeSelect(questionType.type),
          children: /*#__PURE__*/ _jsx(CardContent, {
            className: "p-2",
            children: /*#__PURE__*/ _jsxs("div", {
              className: "flex flex-col items-center text-center gap-1",
              children: [
                /*#__PURE__*/ _jsx("div", {
                  className: `p-1.5 rounded-md ${questionType.color}`,
                  children: questionType.icon,
                }),
                /*#__PURE__*/ _jsx("div", {
                  className: "flex-1 min-w-0",
                  children: /*#__PURE__*/ _jsx("h4", {
                    className:
                      "font-medium text-xs text-gray-700 dark:text-gray-300 leading-tight",
                    children: questionType.label,
                  }),
                }),
              ],
            }),
          }),
        },
        questionType.type
      )
    ),
  });
};
export { questionTypes };
