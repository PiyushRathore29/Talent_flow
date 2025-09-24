import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const SimplifiedSectionCard = ({
  section,
  sectionNumber,
  onUpdate,
  onDelete,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [sectionTitle, setSectionTitle] = useState(section.title);
  const [sectionDescription, setSectionDescription] = useState(section.description || "");
  const handleSaveSection = () => {
    onUpdate({
      title: sectionTitle.trim() || `Section ${sectionNumber}`,
      description: sectionDescription.trim()
    });
    setIsEditingSection(false);
  };
  const handleAddQuestion = () => {
    const newQuestion = {
      type: "short-text",
      title: "New Question",
      description: "",
      required: false,
      options: [],
      validation: [],
      conditionalLogic: []
    };
    onAddQuestion(newQuestion);
  };
  return /*#__PURE__*/_jsxs(Card, {
    className: "border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300",
    children: [/*#__PURE__*/_jsx(CardHeader, {
      className: "pb-3",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx(Button, {
            variant: "ghost",
            size: "sm",
            onClick: () => setIsExpanded(!isExpanded),
            className: "p-1",
            children: isExpanded ? /*#__PURE__*/_jsx(ChevronDown, {
              className: "h-4 w-4"
            }) : /*#__PURE__*/_jsx(ChevronRight, {
              className: "h-4 w-4"
            })
          }), /*#__PURE__*/_jsxs(Badge, {
            variant: "outline",
            className: "bg-indigo-50 text-indigo-700 border-indigo-200",
            children: ["Section ", sectionNumber]
          }), isEditingSection ? /*#__PURE__*/_jsxs("div", {
            className: "flex-1 space-y-2",
            children: [/*#__PURE__*/_jsx(Input, {
              value: sectionTitle,
              onChange: e => setSectionTitle(e.target.value),
              placeholder: "Section title",
              className: "font-medium"
            }), /*#__PURE__*/_jsx(Textarea, {
              value: sectionDescription,
              onChange: e => setSectionDescription(e.target.value),
              placeholder: "Section description (optional)",
              rows: 2
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx(CardTitle, {
              className: "text-lg",
              children: section.title
            }), section.description && /*#__PURE__*/_jsx("p", {
              className: "text-sm text-slate-600 mt-1",
              children: section.description
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex items-center gap-2",
          children: isEditingSection ? /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(Button, {
              size: "sm",
              onClick: handleSaveSection,
              className: "bg-green-600 hover:bg-green-700",
              children: "Save"
            }), /*#__PURE__*/_jsx(Button, {
              size: "sm",
              variant: "outline",
              onClick: () => {
                setSectionTitle(section.title);
                setSectionDescription(section.description || "");
                setIsEditingSection(false);
              },
              children: "Cancel"
            })]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(Button, {
              size: "sm",
              variant: "outline",
              onClick: () => setIsEditingSection(true),
              children: /*#__PURE__*/_jsx(Edit2, {
                className: "h-4 w-4"
              })
            }), /*#__PURE__*/_jsx(Button, {
              size: "sm",
              variant: "outline",
              onClick: onDelete,
              className: "text-red-600 hover:bg-red-50",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "h-4 w-4"
              })
            })]
          })
        })]
      })
    }), isExpanded && /*#__PURE__*/_jsx(CardContent, {
      className: "pt-0",
      children: /*#__PURE__*/_jsx("div", {
        className: "space-y-4",
        children: section.questions.length === 0 ? /*#__PURE__*/_jsxs("div", {
          className: "text-center py-6 border-2 border-dashed border-slate-300 rounded-lg",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-slate-600 mb-3",
            children: "No questions in this section"
          }), /*#__PURE__*/_jsxs(Button, {
            onClick: handleAddQuestion,
            size: "sm",
            className: "bg-blue-600 hover:bg-blue-700",
            children: [/*#__PURE__*/_jsx(Plus, {
              className: "h-4 w-4 mr-2"
            }), "Add Question"]
          })]
        }) : /*#__PURE__*/_jsxs("div", {
          className: "space-y-3",
          children: [section.questions.sort((a, b) => a.order - b.order).map((question, index) => /*#__PURE__*/_jsx("div", {
            className: "border rounded-lg p-4 bg-slate-50",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-start justify-between",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex-1",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2 mb-2",
                  children: [/*#__PURE__*/_jsxs(Badge, {
                    variant: "secondary",
                    className: "text-xs",
                    children: ["Q", index + 1]
                  }), /*#__PURE__*/_jsx(Badge, {
                    variant: "outline",
                    className: "text-xs",
                    children: question.type.replace("-", " ")
                  }), question.required && /*#__PURE__*/_jsx(Badge, {
                    variant: "destructive",
                    className: "text-xs",
                    children: "Required"
                  })]
                }), editingQuestion === question.id ? /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Input, {
                    value: question.title,
                    onChange: e => onUpdateQuestion(question.id, {
                      title: e.target.value
                    }),
                    placeholder: "Question title"
                  }), /*#__PURE__*/_jsx(Textarea, {
                    value: question.description || "",
                    onChange: e => onUpdateQuestion(question.id, {
                      description: e.target.value
                    }),
                    placeholder: "Question description (optional)",
                    rows: 2
                  })]
                }) : /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("h4", {
                    className: "font-medium text-slate-900",
                    children: question.title
                  }), question.description && /*#__PURE__*/_jsx("p", {
                    className: "text-sm text-slate-600 mt-1",
                    children: question.description
                  })]
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "flex items-center gap-2 ml-4",
                children: editingQuestion === question.id ? /*#__PURE__*/_jsxs(_Fragment, {
                  children: [/*#__PURE__*/_jsx(Button, {
                    size: "sm",
                    onClick: () => setEditingQuestion(null),
                    className: "bg-green-600 hover:bg-green-700",
                    children: "Save"
                  }), /*#__PURE__*/_jsx(Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: () => setEditingQuestion(null),
                    children: "Cancel"
                  })]
                }) : /*#__PURE__*/_jsxs(_Fragment, {
                  children: [/*#__PURE__*/_jsx(Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: () => setEditingQuestion(question.id),
                    children: /*#__PURE__*/_jsx(Edit2, {
                      className: "h-3 w-3"
                    })
                  }), /*#__PURE__*/_jsx(Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: () => onDeleteQuestion(question.id),
                    className: "text-red-600 hover:bg-red-50",
                    children: /*#__PURE__*/_jsx(Trash2, {
                      className: "h-3 w-3"
                    })
                  })]
                })
              })]
            })
          }, question.id)), /*#__PURE__*/_jsxs(Button, {
            onClick: handleAddQuestion,
            variant: "outline",
            className: "w-full border-dashed",
            children: [/*#__PURE__*/_jsx(Plus, {
              className: "h-4 w-4 mr-2"
            }), "Add Question"]
          })]
        })
      })
    })]
  });
};