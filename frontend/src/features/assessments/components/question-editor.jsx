import React, { useState } from "react";
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
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Badge } from "../../../components/ui/badge";
import {
  Plus,
  Trash2,
  GripVertical,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { QuestionTypeSelector } from "./question-type-selector";
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
const SortableQuestionItem = ({ question, isSelected, onSelect, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return /*#__PURE__*/ _jsx("div", {
    ref: setNodeRef,
    style: style,
    className: `group border rounded-lg p-3 cursor-pointer transition-all ${
      isSelected
        ? "border-primary bg-primary/5 shadow-sm"
        : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
    }`,
    onClick: onSelect,
    children: /*#__PURE__*/ _jsxs("div", {
      className: "flex items-center gap-2",
      children: [
        /*#__PURE__*/ _jsx("div", {
          ...attributes,
          ...listeners,
          className:
            "cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity",
          children: /*#__PURE__*/ _jsx(GripVertical, {
            className: "h-4 w-4 text-muted-foreground",
          }),
        }),
        /*#__PURE__*/ _jsxs("div", {
          className: "flex-1 min-w-0",
          children: [
            /*#__PURE__*/ _jsxs("div", {
              className: "flex items-center gap-2 mb-1",
              children: [
                /*#__PURE__*/ _jsx("span", {
                  className: "font-medium text-sm truncate",
                  children: question.title || "Untitled Question",
                }),
                /*#__PURE__*/ _jsx(Badge, {
                  variant: "secondary",
                  className: "text-xs",
                  children: question.type.replace("-", " "),
                }),
                question.required &&
                  /*#__PURE__*/ _jsx(Badge, {
                    variant: "destructive",
                    className: "text-xs",
                    children: "Required",
                  }),
              ],
            }),
            question.description &&
              /*#__PURE__*/ _jsx("p", {
                className: "text-xs text-muted-foreground truncate",
                children: question.description,
              }),
          ],
        }),
        /*#__PURE__*/ _jsx(Button, {
          variant: "ghost",
          size: "sm",
          onClick: (e) => {
            e.stopPropagation();
            onDelete();
          },
          className:
            "opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0",
          children: /*#__PURE__*/ _jsx(Trash2, {
            className: "h-4 w-4 text-destructive",
          }),
        }),
      ],
    }),
  });
};
const QuestionForm = ({ question, allQuestions, onChange }) => {
  const [showValidation, setShowValidation] = useState(false);
  const [showConditional, setShowConditional] = useState(false);
  const addValidationRule = () => {
    const newRule = {
      type: "required",
      message: "This field is required",
    };
    onChange({
      validation: [...(question.validation || []), newRule],
    });
  };
  const updateValidationRule = (index, updates) => {
    const updatedRules = [...(question.validation || [])];
    updatedRules[index] = {
      ...updatedRules[index],
      ...updates,
    };
    onChange({
      validation: updatedRules,
    });
  };
  const removeValidationRule = (index) => {
    const updatedRules = [...(question.validation || [])];
    updatedRules.splice(index, 1);
    onChange({
      validation: updatedRules,
    });
  };
  const addConditionalRule = () => {
    const availableQuestions = allQuestions.filter(
      (q) => q.id !== question.id && q.order < question.order
    );
    if (availableQuestions.length === 0) return;
    const newRule = {
      dependsOnQuestionId: availableQuestions[0].id,
      condition: "equals",
      value: "",
      action: "show",
    };
    onChange({
      conditionalLogic: [...(question.conditionalLogic || []), newRule],
    });
  };
  const updateConditionalRule = (index, updates) => {
    const updatedRules = [...(question.conditionalLogic || [])];
    updatedRules[index] = {
      ...updatedRules[index],
      ...updates,
    };
    onChange({
      conditionalLogic: updatedRules,
    });
  };
  const removeConditionalRule = (index) => {
    const updatedRules = [...(question.conditionalLogic || [])];
    updatedRules.splice(index, 1);
    onChange({
      conditionalLogic: updatedRules,
    });
  };
  const addOption = () => {
    const newOptions = [...(question.options || []), ""];
    onChange({
      options: newOptions,
    });
  };
  const updateOption = (index, value) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[index] = value;
    onChange({
      options: updatedOptions,
    });
  };
  const removeOption = (index) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions.splice(index, 1);
    onChange({
      options: updatedOptions,
    });
  };
  const availableQuestions = allQuestions.filter(
    (q) => q.id !== question.id && q.order < question.order
  );
  return /*#__PURE__*/ _jsxs("div", {
    className: "space-y-6",
    children: [
      /*#__PURE__*/ _jsxs("div", {
        className: "space-y-4",
        children: [
          /*#__PURE__*/ _jsxs("div", {
            children: [
              /*#__PURE__*/ _jsx(Label, {
                htmlFor: "question-title",
                className: "text-gray-700 dark:text-gray-300",
                children: "Question Title *",
              }),
              /*#__PURE__*/ _jsx(Input, {
                id: "question-title",
                value: question.title,
                onChange: (e) =>
                  onChange({
                    title: e.target.value,
                  }),
                placeholder: "Enter your question...",
                className:
                  "mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
              }),
            ],
          }),
          /*#__PURE__*/ _jsxs("div", {
            children: [
              /*#__PURE__*/ _jsx(Label, {
                htmlFor: "question-description",
                className: "text-gray-700 dark:text-gray-300",
                children: "Description (Optional)",
              }),
              /*#__PURE__*/ _jsx(Textarea, {
                id: "question-description",
                value: question.description || "",
                onChange: (e) =>
                  onChange({
                    description: e.target.value,
                  }),
                placeholder: "Provide additional context or instructions...",
                className:
                  "mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                rows: 2,
              }),
            ],
          }),
          /*#__PURE__*/ _jsxs("div", {
            className: "flex items-center space-x-2",
            children: [
              /*#__PURE__*/ _jsx(Checkbox, {
                id: "question-required",
                checked: question.required,
                onCheckedChange: (checked) =>
                  onChange({
                    required: !!checked,
                  }),
              }),
              /*#__PURE__*/ _jsx(Label, {
                htmlFor: "question-required",
                className: "text-gray-700 dark:text-gray-300",
                children: "Required field",
              }),
            ],
          }),
        ],
      }),
      (question.type === "single-choice" || question.type === "multi-choice") &&
        /*#__PURE__*/ _jsxs("div", {
          children: [
            /*#__PURE__*/ _jsx(Label, {
              className: "text-gray-700 dark:text-gray-300",
              children: "Answer Options",
            }),
            /*#__PURE__*/ _jsxs("div", {
              className: "mt-2 space-y-2",
              children: [
                (question.options || []).map((option, index) =>
                  /*#__PURE__*/ _jsxs(
                    "div",
                    {
                      className: "flex items-center gap-2",
                      children: [
                        /*#__PURE__*/ _jsx(Input, {
                          value: option,
                          onChange: (e) => updateOption(index, e.target.value),
                          placeholder: `Option ${index + 1}`,
                          className:
                            "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                          variant: "ghost",
                          size: "sm",
                          onClick: () => removeOption(index),
                          className:
                            "h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700",
                          children: /*#__PURE__*/ _jsx(X, {
                            className:
                              "h-4 w-4 text-gray-600 dark:text-gray-400",
                          }),
                        }),
                      ],
                    },
                    index
                  )
                ),
                /*#__PURE__*/ _jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  onClick: addOption,
                  className:
                    "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700",
                  children: [
                    /*#__PURE__*/ _jsx(Plus, {
                      className: "h-4 w-4 mr-2",
                    }),
                    "Add Option",
                  ],
                }),
              ],
            }),
          ],
        }),
      /*#__PURE__*/ _jsxs("div", {
        children: [
          /*#__PURE__*/ _jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              /*#__PURE__*/ _jsx(Label, {
                className: "text-gray-700 dark:text-gray-300",
                children: "Validation Rules",
              }),
              /*#__PURE__*/ _jsx(Button, {
                variant: "ghost",
                size: "sm",
                onClick: () => setShowValidation(!showValidation),
                className: "hover:bg-gray-100 dark:hover:bg-gray-700",
                children: showValidation
                  ? /*#__PURE__*/ _jsx(ChevronDown, {
                      className: "h-4 w-4 text-gray-600 dark:text-gray-400",
                    })
                  : /*#__PURE__*/ _jsx(ChevronRight, {
                      className: "h-4 w-4 text-gray-600 dark:text-gray-400",
                    }),
              }),
            ],
          }),
          showValidation &&
            /*#__PURE__*/ _jsxs("div", {
              className:
                "mt-2 space-y-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
              children: [
                (question.validation || []).map((rule, index) =>
                  /*#__PURE__*/ _jsxs(
                    "div",
                    {
                      className:
                        "flex items-center gap-2 p-2 border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
                      children: [
                        /*#__PURE__*/ _jsxs("select", {
                          value: rule.type,
                          onChange: (e) =>
                            updateValidationRule(index, {
                              type: e.target.value,
                            }),
                          className:
                            "px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                          children: [
                            /*#__PURE__*/ _jsx("option", {
                              value: "required",
                              children: "Required",
                            }),
                            /*#__PURE__*/ _jsx("option", {
                              value: "min-length",
                              children: "Min Length",
                            }),
                            /*#__PURE__*/ _jsx("option", {
                              value: "max-length",
                              children: "Max Length",
                            }),
                            /*#__PURE__*/ _jsx("option", {
                              value: "numeric-range",
                              children: "Numeric Range",
                            }),
                            /*#__PURE__*/ _jsx("option", {
                              value: "email",
                              children: "Email Format",
                            }),
                            /*#__PURE__*/ _jsx("option", {
                              value: "url",
                              children: "URL Format",
                            }),
                          ],
                        }),
                        (rule.type === "min-length" ||
                          rule.type === "max-length" ||
                          rule.type === "numeric-range") &&
                          /*#__PURE__*/ _jsx(Input, {
                            type: "number",
                            value: rule.value || "",
                            onChange: (e) =>
                              updateValidationRule(index, {
                                value: parseInt(e.target.value),
                              }),
                            placeholder: "Value",
                            className:
                              "w-20 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                          }),
                        /*#__PURE__*/ _jsx(Input, {
                          value: rule.message,
                          onChange: (e) =>
                            updateValidationRule(index, {
                              message: e.target.value,
                            }),
                          placeholder: "Error message",
                          className:
                            "flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                        }),
                        /*#__PURE__*/ _jsx(Button, {
                          variant: "ghost",
                          size: "sm",
                          onClick: () => removeValidationRule(index),
                          className:
                            "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600",
                          children: /*#__PURE__*/ _jsx(X, {
                            className:
                              "h-4 w-4 text-gray-600 dark:text-gray-400",
                          }),
                        }),
                      ],
                    },
                    index
                  )
                ),
                /*#__PURE__*/ _jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  onClick: addValidationRule,
                  className:
                    "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600",
                  children: [
                    /*#__PURE__*/ _jsx(Plus, {
                      className: "h-4 w-4 mr-2",
                    }),
                    "Add Validation Rule",
                  ],
                }),
              ],
            }),
        ],
      }),
      availableQuestions.length > 0 &&
        /*#__PURE__*/ _jsxs("div", {
          children: [
            /*#__PURE__*/ _jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                /*#__PURE__*/ _jsx(Label, {
                  className: "text-gray-700 dark:text-gray-300",
                  children: "Conditional Logic",
                }),
                /*#__PURE__*/ _jsx(Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setShowConditional(!showConditional),
                  className: "hover:bg-gray-100 dark:hover:bg-gray-700",
                  children: showConditional
                    ? /*#__PURE__*/ _jsx(ChevronDown, {
                        className: "h-4 w-4 text-gray-600 dark:text-gray-400",
                      })
                    : /*#__PURE__*/ _jsx(ChevronRight, {
                        className: "h-4 w-4 text-gray-600 dark:text-gray-400",
                      }),
                }),
              ],
            }),
            showConditional &&
              /*#__PURE__*/ _jsxs("div", {
                className:
                  "mt-2 space-y-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
                children: [
                  (question.conditionalLogic || []).map((rule, index) =>
                    /*#__PURE__*/ _jsxs(
                      "div",
                      {
                        className:
                          "flex items-center gap-2 p-2 border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
                        children: [
                          /*#__PURE__*/ _jsx("select", {
                            value: rule.dependsOnQuestionId,
                            onChange: (e) =>
                              updateConditionalRule(index, {
                                dependsOnQuestionId: e.target.value,
                              }),
                            className:
                              "px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                            children: availableQuestions.map((q) =>
                              /*#__PURE__*/ _jsx(
                                "option",
                                {
                                  value: q.id,
                                  children: q.title || "Untitled",
                                },
                                q.id
                              )
                            ),
                          }),
                          /*#__PURE__*/ _jsxs("select", {
                            value: rule.condition,
                            onChange: (e) =>
                              updateConditionalRule(index, {
                                condition: e.target.value,
                              }),
                            className:
                              "px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                            children: [
                              /*#__PURE__*/ _jsx("option", {
                                value: "equals",
                                children: "Equals",
                              }),
                              /*#__PURE__*/ _jsx("option", {
                                value: "not-equals",
                                children: "Not Equals",
                              }),
                              /*#__PURE__*/ _jsx("option", {
                                value: "contains",
                                children: "Contains",
                              }),
                              /*#__PURE__*/ _jsx("option", {
                                value: "greater-than",
                                children: "Greater Than",
                              }),
                              /*#__PURE__*/ _jsx("option", {
                                value: "less-than",
                                children: "Less Than",
                              }),
                            ],
                          }),
                          /*#__PURE__*/ _jsx(Input, {
                            value: rule.value,
                            onChange: (e) =>
                              updateConditionalRule(index, {
                                value: e.target.value,
                              }),
                            placeholder: "Value",
                            className:
                              "w-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                          }),
                          /*#__PURE__*/ _jsxs("select", {
                            value: rule.action,
                            onChange: (e) =>
                              updateConditionalRule(index, {
                                action: e.target.value,
                              }),
                            className:
                              "px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                            children: [
                              /*#__PURE__*/ _jsx("option", {
                                value: "show",
                                children: "Show",
                              }),
                              /*#__PURE__*/ _jsx("option", {
                                value: "hide",
                                children: "Hide",
                              }),
                              /*#__PURE__*/ _jsx("option", {
                                value: "require",
                                children: "Require",
                              }),
                            ],
                          }),
                          /*#__PURE__*/ _jsx(Button, {
                            variant: "ghost",
                            size: "sm",
                            onClick: () => removeConditionalRule(index),
                            className:
                              "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600",
                            children: /*#__PURE__*/ _jsx(X, {
                              className:
                                "h-4 w-4 text-gray-600 dark:text-gray-400",
                            }),
                          }),
                        ],
                      },
                      index
                    )
                  ),
                  /*#__PURE__*/ _jsxs(Button, {
                    variant: "outline",
                    size: "sm",
                    onClick: addConditionalRule,
                    className:
                      "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600",
                    children: [
                      /*#__PURE__*/ _jsx(Plus, {
                        className: "h-4 w-4 mr-2",
                      }),
                      "Add Conditional Rule",
                    ],
                  }),
                ],
              }),
          ],
        }),
    ],
  });
};

export const QuestionEditor = ({
  section,
  selectedQuestion,
  onQuestionUpdate,
  onQuestionAdd,
  onQuestionDelete,
  onQuestionReorder,
  onQuestionSelect,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState("short-text");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const selectedQuestionData = section.questions.find(
    (q) => q.id === selectedQuestion
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = section.questions.findIndex((q) => q.id === active.id);
    const newIndex = section.questions.findIndex((q) => q.id === over.id);
    if (oldIndex !== newIndex) {
      onQuestionReorder(oldIndex, newIndex);
    }
  };
  const createQuestion = () => {
    const newQuestion = {
      type: newQuestionType,
      title: "",
      description: "",
      required: false,
      options: ["single-choice", "multi-choice"].includes(newQuestionType)
        ? [
            { id: "opt1", text: "Option 1", value: "option1" },
            { id: "opt2", text: "Option 2", value: "option2" },
          ]
        : undefined,
      validation: getDefaultValidation(newQuestionType),
      conditionalLogic: [],
    };
    onQuestionAdd(newQuestion);
    setIsCreating(false);
    setNewQuestionType("short-text");
  };

  // Helper function to get default validation based on type
  const getDefaultValidation = (type) => {
    switch (type) {
      case "single-choice":
      case "multi-choice":
        return [{ type: "required", value: false }];
      case "short-text":
      case "long-text":
        return [
          { type: "required", value: false },
          { type: "min-length", value: null },
          { type: "max-length", value: null },
        ];
      case "numeric":
        return [
          { type: "required", value: false },
          { type: "numeric-range", value: { min: null, max: null } },
        ];
      case "file-upload":
        return [{ type: "required", value: false }];
      default:
        return [{ type: "required", value: false }];
    }
  };
  return /*#__PURE__*/ _jsxs("div", {
    className: "h-full flex bg-white dark:bg-gray-900",
    children: [
      /*#__PURE__*/ _jsx("div", {
        className:
          "w-1/2 border-r border-gray-200 dark:border-gray-700 bg-sky-50 dark:bg-gray-800/50 overflow-y-auto",
        children: /*#__PURE__*/ _jsxs("div", {
          className: "p-4",
          children: [
            /*#__PURE__*/ _jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [
                /*#__PURE__*/ _jsx("h3", {
                  className: "font-semibold text-gray-900 dark:text-white",
                  children: "Questions",
                }),
                /*#__PURE__*/ _jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setIsCreating(true),
                  children: [
                    /*#__PURE__*/ _jsx(Plus, {
                      className: "h-4 w-4 mr-2",
                    }),
                    "Add Question",
                  ],
                }),
              ],
            }),
            isCreating &&
              /*#__PURE__*/ _jsxs(Card, {
                className: "mb-4",
                children: [
                  /*#__PURE__*/ _jsx(CardHeader, {
                    className: "pb-3",
                    children: /*#__PURE__*/ _jsx(CardTitle, {
                      className: "text-sm",
                      children: "New Question",
                    }),
                  }),
                  /*#__PURE__*/ _jsxs(CardContent, {
                    className: "space-y-3",
                    children: [
                      /*#__PURE__*/ _jsx(QuestionTypeSelector, {
                        selectedType: newQuestionType,
                        onTypeSelect: setNewQuestionType,
                      }),
                      /*#__PURE__*/ _jsxs("div", {
                        className: "flex gap-2",
                        children: [
                          /*#__PURE__*/ _jsx(Button, {
                            size: "sm",
                            onClick: createQuestion,
                            children: "Create",
                          }),
                          /*#__PURE__*/ _jsx(Button, {
                            variant: "outline",
                            size: "sm",
                            onClick: () => setIsCreating(false),
                            children: "Cancel",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            /*#__PURE__*/ _jsx(DndContext, {
              sensors: sensors,
              collisionDetection: closestCorners,
              onDragEnd: handleDragEnd,
              children: /*#__PURE__*/ _jsx(SortableContext, {
                items: section.questions.map((q) => q.id),
                strategy: verticalListSortingStrategy,
                children: /*#__PURE__*/ _jsx("div", {
                  className: "space-y-2",
                  children: section.questions.map((question) =>
                    /*#__PURE__*/ _jsx(
                      SortableQuestionItem,
                      {
                        question: question,
                        isSelected: selectedQuestion === question.id,
                        onSelect: () => onQuestionSelect?.(question.id),
                        onDelete: () => onQuestionDelete(question.id),
                      },
                      question.id
                    )
                  ),
                }),
              }),
            }),
            section.questions.length === 0 &&
              !isCreating &&
              /*#__PURE__*/ _jsxs("div", {
                className: "text-center py-8 text-gray-500 dark:text-gray-400",
                children: [
                  /*#__PURE__*/ _jsx("p", {
                    className: "mb-2",
                    children: "No questions yet",
                  }),
                  /*#__PURE__*/ _jsx("p", {
                    className: "text-sm",
                    children: "Add a question to get started",
                  }),
                ],
              }),
          ],
        }),
      }),
      /*#__PURE__*/ _jsx("div", {
        className: "flex-1 overflow-y-auto bg-white dark:bg-gray-900",
        children: selectedQuestionData
          ? /*#__PURE__*/ _jsxs("div", {
              className: "p-6",
              children: [
                /*#__PURE__*/ _jsxs("div", {
                  className: "flex items-center justify-between mb-4",
                  children: [
                    /*#__PURE__*/ _jsx("h3", {
                      className: "font-semibold text-gray-900 dark:text-white",
                      children: "Edit Question",
                    }),
                  ],
                }),
                /*#__PURE__*/ _jsx(QuestionForm, {
                  question: selectedQuestionData,
                  allQuestions: section.questions,
                  onChange: (updates) =>
                    onQuestionUpdate(selectedQuestionData.id, updates),
                }),
              ],
            })
          : /*#__PURE__*/ _jsx("div", {
              className:
                "flex items-center justify-center h-full text-gray-500 dark:text-gray-400",
              children: /*#__PURE__*/ _jsxs("div", {
                className: "text-center",
                children: [
                  /*#__PURE__*/ _jsx("p", {
                    className: "mb-2",
                    children: "Select a question to edit",
                  }),
                  /*#__PURE__*/ _jsx("p", {
                    className: "text-sm",
                    children: "Or add a new question to get started",
                  }),
                ],
              }),
            }),
      }),
    ],
  });
};
