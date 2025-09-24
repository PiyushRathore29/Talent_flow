import React from "react";
import { Input } from "../../../../components/ui/input";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const NumericField = ({
  question,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  min,
  max,
  step = 1,
}) => {
  // Get min/max from validation rules if not provided
  const numericRange = question.validation?.find(
    (rule) => rule.type === "numeric-range"
  )?.value;
  const effectiveMin = min ?? numericRange?.min ?? undefined;
  const effectiveMax = max ?? numericRange?.max ?? undefined;
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange("");
      return;
    }
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };
  const displayValue = value === "" ? "" : String(value);
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
      /*#__PURE__*/ _jsx(Input, {
        type: "number",
        value: displayValue,
        onChange: handleChange,
        onBlur: onBlur,
        placeholder: "Enter a number...",
        disabled: disabled,
        min: effectiveMin,
        max: effectiveMax,
        step: step,
        className: error ? "border-destructive" : "",
      }),
      (effectiveMin !== undefined || effectiveMax !== undefined) &&
        /*#__PURE__*/ _jsx("div", {
          className: "text-xs text-gray-300",
          children:
            effectiveMin !== undefined && effectiveMax !== undefined
              ? /*#__PURE__*/ _jsxs("span", {
                  children: ["Range: ", effectiveMin, " - ", effectiveMax],
                })
              : effectiveMin !== undefined
              ? /*#__PURE__*/ _jsxs("span", {
                  children: ["Minimum: ", effectiveMin],
                })
              : /*#__PURE__*/ _jsxs("span", {
                  children: ["Maximum: ", effectiveMax],
                }),
        }),
      error &&
        /*#__PURE__*/ _jsx("p", {
          className: "text-destructive text-sm mt-2",
          children: error,
        }),
    ],
  });
};
