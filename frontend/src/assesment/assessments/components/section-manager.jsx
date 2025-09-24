import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { GripVertical, Edit2, Trash2, Check, X } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const SectionManager = ({
  section,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [editDescription, setEditDescription] = useState(section.description || "");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: section.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const handleSave = () => {
    onUpdate({
      title: editTitle.trim() || "Untitled Section",
      description: editDescription.trim()
    });
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditTitle(section.title);
    setEditDescription(section.description || "");
    setIsEditing(false);
  };
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  return /*#__PURE__*/_jsxs(Card, {
    ref: setNodeRef,
    style: {
      ...style
    },
    className: `cursor-pointer transition-all duration-300 hover:shadow-lg border ${isSelected ? "bg-sky-200 dark:bg-[#0d1025] ring-2 ring-blue-100 ring-opacity-20 shadow-xl border-sky-300 dark:border-blue-100" : "bg-sky-100 dark:bg-[#000319] border-gray-200 dark:border-gray-600 hover:border-gray-600"} ${isDragging ? "opacity-50" : ""}`,
    onClick: !isEditing ? onSelect : undefined,
    children: [/*#__PURE__*/_jsx(CardHeader, {
      className: "pb-3",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-start gap-3",
        children: [/*#__PURE__*/_jsx("button", {
          className: `mt-1.5 transition-colors ${isSelected ? "text-blue-600 dark:text-blue-400 hover:text-blue-700" : "text-gray-600 dark:text-gray-500 hover:text-gray-700"}`,
          ...attributes,
          ...listeners,
          children: /*#__PURE__*/_jsx(GripVertical, {
            className: "h-4 w-4"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 min-w-0",
          children: isEditing ? /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsx(Input, {
              value: editTitle,
              onChange: e => setEditTitle(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Section title",
              className: "font-medium",
              autoFocus: true
            }), /*#__PURE__*/_jsx(Textarea, {
              value: editDescription,
              onChange: e => setEditDescription(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Section description (optional)",
              className: "text-sm resize-none",
              rows: 2
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h4", {
              className: `font-medium text-sm leading-tight ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-300"}`,
              children: section.title
            }), section.description && /*#__PURE__*/_jsx("p", {
              className: `text-xs mt-1 line-clamp-2 ${isSelected ? "text-gray-600 dark:text-gray-300" : "text-gray-600 dark:text-gray-400"}`,
              children: section.description
            })]
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "flex items-center gap-1",
          children: isEditing ? /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              size: "sm",
              onClick: e => {
                e.stopPropagation();
                handleSave();
              },
              className: "h-6 w-6 p-0",
              "data-testid": "save-section-button",
              children: /*#__PURE__*/_jsx(Check, {
                className: "h-3 w-3"
              })
            }), /*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              size: "sm",
              onClick: e => {
                e.stopPropagation();
                handleCancel();
              },
              className: "h-6 w-6 p-0",
              "data-testid": "cancel-section-button",
              children: /*#__PURE__*/_jsx(X, {
                className: "h-3 w-3"
              })
            })]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              size: "sm",
              onClick: e => {
                e.stopPropagation();
                setIsEditing(true);
              },
              className: "h-6 w-6 p-0",
              "data-testid": "edit-section-button",
              children: /*#__PURE__*/_jsx(Edit2, {
                className: "h-3 w-3"
              })
            }), /*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              size: "sm",
              onClick: e => {
                e.stopPropagation();
                if (confirm("Delete this section and all its questions?")) {
                  onDelete();
                }
              },
              className: "h-6 w-6 p-0 text-destructive hover:text-destructive",
              "data-testid": "delete-section-button",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "h-3 w-3"
              })
            })]
          })
        })]
      })
    }), /*#__PURE__*/_jsx(CardContent, {
      className: "pt-0",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs(Badge, {
          variant: "secondary",
          className: `text-xs ${isSelected ? "bg-blue-600/20 text-blue-400 border-blue-500/30" : "bg-gray-600/20 text-gray-300 border-gray-500/30"}`,
          children: [section.questions.length, " question", section.questions.length !== 1 ? "s" : ""]
        }), isSelected && /*#__PURE__*/_jsx(Badge, {
          variant: "default",
          className: "text-xs bg-blue-600/20 text-blue-400 border-blue-500/30",
          children: "Selected"
        })]
      })
    })]
  });
};