import React from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const SingleChoiceField = ({
  question,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
}) => {
  const handleValueChange = (newValue) => {
    onChange(newValue);
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
      /*#__PURE__*/ _jsx(RadioGroup, {
        value: value || "",
        onValueChange: handleValueChange,
        disabled: disabled,
        className: "mt-3",
        children:
          question.options?.map((option, index) => {
            const optionValue =
              typeof option === "string"
                ? option
                : option.value || option.text || option;
            const optionText =
              typeof option === "string"
                ? option
                : option.text || option.value || option;
            return /*#__PURE__*/ _jsxs(
              "div",
              {
                className: "flex items-center space-x-2",
                children: [
                  /*#__PURE__*/ _jsx(RadioGroupItem, {
                    value: optionValue,
                    id: `${question.id}-${index}`,
                    onBlur: onBlur,
                  }),
                  /*#__PURE__*/ _jsx(Label, {
                    htmlFor: `${question.id}-${index}`,
                    className: "text-sm cursor-pointer text-white",
                    children: optionText,
                  }),
                ],
              },
              index
            );
          }) ||
          /*#__PURE__*/ _jsx("div", {
            className: "text-sm text-gray-300 italic",
            children: "No options configured for this question",
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
