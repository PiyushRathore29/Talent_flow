import React from "react";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const TextField = ({
  question,
  value = "",
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  placeholder,
  maxLength,
}) => {
  const isLongText = question.type === "long-text";

  // Get max length from validation rules if not provided
  const effectiveMaxLength =
    maxLength ||
    question.validation?.find((rule) => rule.type === "max-length")?.value;
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return isLongText
      ? "Enter your detailed response..."
      : "Enter your answer...";
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
              className: "font-medium text-sm leading-relaxed text-white",
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
      isLongText
        ? /*#__PURE__*/ _jsx(Textarea, {
            value: value,
            onChange: handleChange,
            onBlur: onBlur,
            placeholder: getPlaceholder(),
            disabled: disabled,
            rows: 4,
            maxLength: effectiveMaxLength,
            className: error ? "border-destructive" : "",
          })
        : /*#__PURE__*/ _jsx(Input, {
            value: value,
            onChange: handleChange,
            onBlur: onBlur,
            placeholder: getPlaceholder(),
            disabled: disabled,
            maxLength: effectiveMaxLength,
            className: error ? "border-destructive" : "",
          }),
      effectiveMaxLength &&
        /*#__PURE__*/ _jsxs("div", {
          className: "flex justify-between text-xs text-gray-300",
          children: [
            /*#__PURE__*/ _jsx("span", {}),
            /*#__PURE__*/ _jsxs("span", {
              children: [value.length, "/", effectiveMaxLength],
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
