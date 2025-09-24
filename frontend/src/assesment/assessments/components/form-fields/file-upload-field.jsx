import React, { useRef } from "react";
import { Button } from "../../../../components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { validateFile } from "../../utils/form-validation";
import {
  storeFileResponse,
  getFileInfo,
  formatFileSize,
} from "../../utils/file-storage";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const FileUploadField = ({
  question,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const fileInputRef = useRef(null);
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file
      const validationError = validateFile(file, maxSize, accept?.split(","));
      if (validationError) {
        // You might want to show this error through a toast or other mechanism
        console.error("File validation error:", validationError);
        return;
      }

      try {
        // Store file for response (assessment context would be passed from parent)
        const storedFile = await storeFileResponse(
          file,
          question.id,
          "preview"
        );
        onChange(storedFile);
      } catch (error) {
        console.error("Failed to process file:", error);
        // Fall back to storing the file object directly for preview
        onChange(file);
      }
    } else {
      onChange(null);
    }
  };
  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  // Get file display info
  const getDisplayInfo = (fileValue) => {
    if (!fileValue) return null;

    // Handle stored file object
    if (fileValue.originalName) {
      return {
        name: fileValue.originalName,
        size: fileValue.size,
      };
    }

    // Handle File object
    if (fileValue.name) {
      return {
        name: fileValue.name,
        size: fileValue.size,
      };
    }

    return null;
  };
  return /*#__PURE__*/ _jsxs("div", {
    className: "space-y-3",
    children: [
      /*#__PURE__*/ _jsx("div", {
        className: "flex items-start justify-between",
        children: /*#__PURE__*/ _jsxs("div", {
          className: "flex-1",
          children: [
            /*#__PURE__*/ _jsxs("h4", {
              className: "font-medium text-sm text-white leading-relaxed",
              children: [
                question.title,
                required &&
                  /*#__PURE__*/ _jsx("span", {
                    className: "text-destructive ml-1",
                    children: "*",
                  }),
              ],
            }),
            question.description &&
              /*#__PURE__*/ _jsx("p", {
                className: "text-sm text-gray-300 mt-1",
                children: question.description,
              }),
          ],
        }),
      }),
      /*#__PURE__*/ _jsxs("div", {
        className: "mt-3",
        children: [
          /*#__PURE__*/ _jsx("input", {
            ref: fileInputRef,
            type: "file",
            onChange: handleFileSelect,
            onBlur: onBlur,
            accept: accept,
            disabled: disabled,
            className: "hidden",
          }),
          value
            ? (() => {
                const displayInfo = getDisplayInfo(value);
                return displayInfo
                  ? /*#__PURE__*/ _jsx("div", {
                      className: "border border-border rounded-md p-3",
                      children: /*#__PURE__*/ _jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          /*#__PURE__*/ _jsxs("div", {
                            className: "flex items-center space-x-2",
                            children: [
                              /*#__PURE__*/ _jsx(FileText, {
                                className: "h-4 w-4 text-gray-300",
                              }),
                              /*#__PURE__*/ _jsxs("div", {
                                children: [
                                  /*#__PURE__*/ _jsx("p", {
                                    className: "text-sm font-medium text-white",
                                    children: displayInfo.name,
                                  }),
                                  /*#__PURE__*/ _jsx("p", {
                                    className: "text-xs text-gray-300",
                                    children: formatFileSize(displayInfo.size),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          !disabled &&
                            /*#__PURE__*/ _jsx(Button, {
                              type: "button",
                              variant: "ghost",
                              size: "sm",
                              onClick: handleRemoveFile,
                              children: /*#__PURE__*/ _jsx(X, {
                                className: "h-4 w-4",
                              }),
                            }),
                        ],
                      }),
                    })
                  : null;
              })()
            : /*#__PURE__*/ _jsxs(Button, {
                type: "button",
                variant: "outline",
                onClick: handleButtonClick,
                disabled: disabled,
                className: "w-full",
                children: [
                  /*#__PURE__*/ _jsx(Upload, {
                    className: "h-4 w-4 mr-2",
                  }),
                  "Choose File",
                ],
              }),
          /*#__PURE__*/ _jsxs("div", {
            className: "mt-2 text-xs text-gray-300",
            children: [
              /*#__PURE__*/ _jsx("p", {
                children: "File upload functionality (stub implementation)",
              }),
              accept &&
                /*#__PURE__*/ _jsxs("p", {
                  children: ["Accepted formats: ", accept],
                }),
              /*#__PURE__*/ _jsxs("p", {
                children: ["Maximum size: ", formatFileSize(maxSize)],
              }),
            ],
          }),
        ],
      }),
      error &&
        /*#__PURE__*/ _jsx("p", {
          className: "text-destructive text-sm mt-2",
          children: error,
        }),
    ],
  });
};
