/**
 * Validates a single question response
 */
export function validateQuestionResponse(question, value, _allResponses, isRequired = question.required) {
  // Check if required field is empty
  if (isRequired && isEmpty(value)) {
    return 'This field is required';
  }

  // If empty and not required, skip other validations
  if (isEmpty(value) && !isRequired) {
    return null;
  }

  // Apply question-specific validation rules
  if (question.validation) {
    for (const rule of question.validation) {
      const error = validateRule(rule, value);
      if (error) return error;
    }
  }

  // Apply type-specific validation
  return validateByType(question, value);
}

/**
 * Validates a validation rule
 */
function validateRule(rule, value) {
  switch (rule.type) {
    case 'required':
      return isEmpty(value) ? rule.message || 'This field is required' : null;
    case 'min-length':
      if (typeof value === 'string' && value.length < (rule.value || 0)) {
        return rule.message || `Minimum length is ${rule.value} characters`;
      }
      return null;
    case 'max-length':
      if (typeof value === 'string' && value.length > (rule.value || 0)) {
        return rule.message || `Maximum length is ${rule.value} characters`;
      }
      return null;
    case 'numeric-range':
      const num = Number(value);
      if (isNaN(num)) {
        return rule.message || 'Please enter a valid number';
      }
      if (rule.value && typeof rule.value === 'object') {
        const { min, max } = rule.value;
        if (min !== undefined && num < min) {
          return rule.message || `Value must be at least ${min}`;
        }
        if (max !== undefined && num > max) {
          return rule.message || `Value must be at most ${max}`;
        }
      }
      return null;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) {
        return rule.message || 'Please enter a valid email address';
      }
      return null;
    case 'url':
      try {
        if (typeof value !== 'string') {
          return rule.message || 'Please enter a valid URL';
        }
        new URL(value);
        return null;
      } catch {
        return rule.message || 'Please enter a valid URL';
      }
    default:
      console.warn(`Unknown validation rule type: ${rule.type}`);
      return null;
  }
}

/**
 * Validates based on question type
 */
function validateByType(question, value) {
  switch (question.type) {
    case 'single-choice':
      if (question.options && !question.options.includes(value)) {
        return 'Please select a valid option';
      }
      return null;
    case 'multi-choice':
      if (!Array.isArray(value)) {
        return 'Invalid selection format';
      }
      if (question.options) {
        const invalidOptions = value.filter(v => !question.options.includes(v));
        if (invalidOptions.length > 0) {
          return 'Please select valid options only';
        }
      }
      return null;
    case 'numeric':
      const num = Number(value);
      if (isNaN(num)) {
        return 'Please enter a valid number';
      }
      return null;
    case 'short-text':
    case 'long-text':
      if (typeof value !== 'string') {
        return 'Please enter text';
      }
      return null;
    case 'file-upload':
      // File validation is handled separately
      return null;
    default:
      return null;
  }
}

/**
 * Checks if a value is considered empty
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validates all responses in a form
 */
export function validateAllResponses(assessment, responses, conditionalStates) {
  const errors = {};
  for (const section of assessment.sections) {
    for (const question of section.questions) {
      const state = conditionalStates[question.id];

      // Skip validation for hidden questions
      if (!state?.visible) continue;

      const value = responses[question.id];
      const error = validateQuestionResponse(question, value, responses, state.required);
      if (error) {
        errors[question.id] = error;
      }
    }
  }
  return errors;
}

/**
 * Validates responses for a specific section
 */
export function validateSectionResponses(section, responses, conditionalStates) {
  const errors = {};
  for (const question of section.questions) {
    const state = conditionalStates[question.id];

    // Skip validation for hidden questions
    if (!state?.visible) continue;

    const value = responses[question.id];
    const error = validateQuestionResponse(question, value, responses, state.required);
    if (error) {
      errors[question.id] = error;
    }
  }
  return errors;
}

/**
 * Checks if a section is complete (all required questions answered)
 */
export function isSectionComplete(section, responses, conditionalStates) {
  for (const question of section.questions) {
    const state = conditionalStates[question.id];

    // Skip hidden questions
    if (!state?.visible) continue;

    // Check if required question is answered
    if (state.required) {
      const value = responses[question.id];
      if (isEmpty(value)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Gets completion percentage for the entire assessment
 */
export function getAssessmentCompletionPercentage(assessment, responses, conditionalStates) {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  for (const section of assessment.sections) {
    for (const question of section.questions) {
      const state = conditionalStates[question.id];

      // Only count visible questions
      if (state?.visible) {
        totalQuestions++;
        const value = responses[question.id];
        if (!isEmpty(value)) {
          answeredQuestions++;
        }
      }
    }
  }

  return totalQuestions === 0 ? 100 : Math.round((answeredQuestions / totalQuestions) * 100);
}

/**
 * Gets completion percentage for a specific section
 */
export function getSectionCompletionPercentage(section, responses, conditionalStates) {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  for (const question of section.questions) {
    const state = conditionalStates[question.id];

    // Only count visible questions
    if (state?.visible) {
      totalQuestions++;
      const value = responses[question.id];
      if (!isEmpty(value)) {
        answeredQuestions++;
      }
    }
  }

  return totalQuestions === 0 ? 100 : Math.round((answeredQuestions / totalQuestions) * 100);
}

/**
 * Custom validation function registry
 */
const customValidators = {};

/**
 * Registers a custom validator
 */
export function registerCustomValidator(name, validator) {
  customValidators[name] = validator;
}

/**
 * Applies custom validation if registered
 */
export function applyCustomValidation(validatorName, value, question, allResponses) {
  const validator = customValidators[validatorName];
  if (!validator) {
    console.warn(`Custom validator "${validatorName}" not found`);
    return null;
  }
  return validator(value, question, allResponses);
}

/**
 * File validation utilities
 */
export function validateFile(file, maxSize, allowedTypes) {
  if (!file) return null;

  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type.toLowerCase();
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return fileType.startsWith(baseType + '/');
      }
      return fileType === type.toLowerCase();
    });
    if (!isAllowed) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
  }
  return null;
}

