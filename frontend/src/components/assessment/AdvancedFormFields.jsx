import React, { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

// Single Choice Field Component
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

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm text-white leading-relaxed">
            {question.title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-sm text-gray-400 mt-1">{question.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="radio"
              id={`${question.id}-${index}`}
              name={question.id}
              value={option}
              checked={value === option}
              onChange={(e) => handleValueChange(e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor={`${question.id}-${index}`}
              className="text-sm text-gray-300 cursor-pointer"
            >
              {option}
            </label>
          </div>
        )) || (
          <div className="text-sm text-gray-400 italic">
            No options configured for this question
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Multi Choice Field Component
export const MultiChoiceField = ({
  question,
  value = [],
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
}) => {
  const handleOptionChange = (option, checked) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (checked) {
      if (!currentValue.includes(option)) {
        onChange([...currentValue, option]);
      }
    } else {
      onChange(currentValue.filter((v) => v !== option));
    }
  };

  const isOptionChecked = (option) => {
    return Array.isArray(value) && value.includes(option);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm leading-relaxed text-white">
            {question.title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-sm text-gray-400 mt-1">{question.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`${question.id}-${index}`}
              checked={isOptionChecked(option)}
              onChange={(e) => handleOptionChange(option, e.target.checked)}
              onBlur={onBlur}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`${question.id}-${index}`}
              className="text-sm text-gray-300 cursor-pointer"
            >
              {option}
            </label>
          </div>
        )) || (
          <div className="text-sm text-gray-400 italic">
            No options configured for this question
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Text Field Component
export const TextField = ({
  question,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
}) => {
  const isLongText = question.type === "long-text";

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm leading-relaxed text-white">
            {question.title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-sm text-gray-400 mt-1">{question.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3">
        {isLongText ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your detailed response"
            maxLength={question.validation?.maxLength}
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your answer"
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.validation?.maxLength && (
          <div className="text-right text-sm text-gray-500 mt-1">
            {(value || "").length} / {question.validation.maxLength}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Numeric Field Component
export const NumericField = ({
  question,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm leading-relaxed text-white">
            {question.title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-sm text-gray-400 mt-1">{question.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          min={question.validation?.minValue}
          max={question.validation?.maxValue}
          step={question.validation?.step || 1}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter a number"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// File Upload Field Component
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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file
      const validationError = validateFile(file, maxSize, accept?.split(","));
      if (validationError) {
        console.error("File validation error:", validationError);
        return;
      }
    }
    onChange(file);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm leading-relaxed text-white">
            {question.title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-sm text-gray-400 mt-1">{question.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          onBlur={onBlur}
          accept={accept}
          disabled={disabled}
          className="hidden"
        />

        {value ? (
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">{value.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(value.size)}
                  </p>
                </div>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled}
            className="w-full p-6 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            <Upload className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm">Click to upload or drag and drop</p>
            <p className="text-xs mt-1">
              {accept && `Accepted formats: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
            </p>
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// File validation utility
function validateFile(file, maxSize, allowedTypes) {
  if (!file) return null;

  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type.toLowerCase();
    const isAllowed = allowedTypes.some((type) => {
      if (type.includes("*")) {
        const baseType = type.split("/")[0];
        return fileType.startsWith(baseType + "/");
      }
      return fileType === type.toLowerCase();
    });
    if (!isAllowed) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`;
    }
  }
  return null;
}

// Export all components
export {
  SingleChoiceField,
  MultiChoiceField,
  TextField,
  NumericField,
  FileUploadField,
};
