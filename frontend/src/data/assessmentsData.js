// Assessment data structure and utilities

export const questionTypes = [
  { 
    id: 'single-choice', 
    name: 'Single Choice', 
    icon: '◯',
    description: 'Select one option from multiple choices'
  },
  { 
    id: 'multi-choice', 
    name: 'Multiple Choice', 
    icon: '☐',
    description: 'Select multiple options from choices'
  },
  { 
    id: 'short-text', 
    name: 'Short Text', 
    icon: '📝',
    description: 'Single line text input'
  },
  { 
    id: 'long-text', 
    name: 'Long Text', 
    icon: '📄',
    description: 'Multi-line text area'
  },
  { 
    id: 'numeric', 
    name: 'Numeric', 
    icon: '#',
    description: 'Number input with optional range'
  },
  { 
    id: 'file-upload', 
    name: 'File Upload', 
    icon: '📁',
    description: 'File attachment (stub implementation)'
  }
];

export const validationRules = {
  'single-choice': ['required'],
  'multi-choice': ['required', 'minSelections', 'maxSelections'],
  'short-text': ['required', 'minLength', 'maxLength'],
  'long-text': ['required', 'minLength', 'maxLength'],
  'numeric': ['required', 'minValue', 'maxValue'],
  'file-upload': ['required', 'fileTypes', 'maxFileSize']
};

export const conditionalOperators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' }
];

// Sample assessment template
export const sampleAssessment = {
  id: 'assessment-1',
  jobId: '1',
  title: 'Senior Frontend Developer Assessment',
  description: 'Comprehensive evaluation for frontend development skills',
  sections: [
    {
      id: 'section-1',
      title: 'Technical Knowledge',
      description: 'Assess core frontend development concepts',
      questions: [
        {
          id: 'q1',
          type: 'single-choice',
          title: 'Which React Hook is used for side effects?',
          description: 'Select the correct hook for handling side effects in React',
          required: true,
          options: [
            { id: 'opt1', text: 'useState', value: 'useState' },
            { id: 'opt2', text: 'useEffect', value: 'useEffect' },
            { id: 'opt3', text: 'useContext', value: 'useContext' },
            { id: 'opt4', text: 'useReducer', value: 'useReducer' }
          ],
          validation: { required: true },
          conditionalLogic: null
        },
        {
          id: 'q2',
          type: 'multi-choice',
          title: 'Which CSS frameworks have you worked with?',
          description: 'Select all that apply',
          required: false,
          options: [
            { id: 'opt1', text: 'Tailwind CSS', value: 'tailwind' },
            { id: 'opt2', text: 'Bootstrap', value: 'bootstrap' },
            { id: 'opt3', text: 'Material-UI', value: 'mui' },
            { id: 'opt4', text: 'Styled Components', value: 'styled-components' },
            { id: 'opt5', text: 'Sass/SCSS', value: 'sass' }
          ],
          validation: { required: false, minSelections: 1 },
          conditionalLogic: null
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Experience & Portfolio',
      description: 'Tell us about your background and work',
      questions: [
        {
          id: 'q3',
          type: 'numeric',
          title: 'Years of professional React experience',
          description: 'Enter the number of years',
          required: true,
          validation: { required: true, minValue: 0, maxValue: 20 },
          conditionalLogic: null
        },
        {
          id: 'q4',
          type: 'long-text',
          title: 'Describe your most challenging frontend project',
          description: 'Please provide details about the project, your role, and the challenges you faced',
          required: true,
          validation: { required: true, minLength: 100, maxLength: 1000 },
          conditionalLogic: {
            showIf: {
              questionId: 'q3',
              operator: 'greater_than',
              value: 2
            }
          }
        },
        {
          id: 'q5',
          type: 'file-upload',
          title: 'Upload your portfolio or code samples',
          description: 'Accepted formats: PDF, ZIP, or links in a text file',
          required: false,
          validation: { 
            required: false, 
            fileTypes: ['.pdf', '.zip', '.txt'],
            maxFileSize: 10 // MB
          },
          conditionalLogic: null
        }
      ]
    }
  ],
  settings: {
    timeLimit: null, // minutes, null for no limit
    allowBackNavigation: true,
    randomizeQuestions: false,
    showProgressBar: true
  },
  createdAt: '2025-07-20',
  updatedAt: '2025-07-20',
  status: 'active'
};

// Local storage keys
export const STORAGE_KEYS = {
  ASSESSMENTS: 'talentflow_assessments',
  ASSESSMENT_RESPONSES: 'talentflow_assessment_responses',
  BUILDER_STATE: 'talentflow_builder_state'
};

// Helper functions
export const createNewQuestion = (type, sectionId) => ({
  id: `q-${Date.now()}`,
  type,
  title: '',
  description: '',
  required: false,
  sectionId,
  options: type.includes('choice') ? [
    { id: `opt-${Date.now()}-1`, text: 'Option 1', value: 'option1' }
  ] : undefined,
  validation: getDefaultValidation(type),
  conditionalLogic: null
});

export const createNewSection = () => ({
  id: `section-${Date.now()}`,
  title: 'New Section',
  description: '',
  questions: []
});

export const getDefaultValidation = (type) => {
  switch (type) {
    case 'single-choice':
    case 'multi-choice':
      return { required: false };
    case 'short-text':
    case 'long-text':
      return { required: false, minLength: null, maxLength: null };
    case 'numeric':
      return { required: false, minValue: null, maxValue: null };
    case 'file-upload':
      return { required: false, fileTypes: [], maxFileSize: 5 };
    default:
      return { required: false };
  }
};

export const validateQuestion = (question, answer) => {
  const errors = [];
  const validation = question.validation || {};

  if (validation.required && (!answer || answer === '' || (Array.isArray(answer) && answer.length === 0))) {
    errors.push('This field is required');
  }

  if (question.type === 'short-text' || question.type === 'long-text') {
    if (validation.minLength && answer && answer.length < validation.minLength) {
      errors.push(`Minimum length is ${validation.minLength} characters`);
    }
    if (validation.maxLength && answer && answer.length > validation.maxLength) {
      errors.push(`Maximum length is ${validation.maxLength} characters`);
    }
  }

  if (question.type === 'numeric') {
    const numValue = parseFloat(answer);
    if (answer && isNaN(numValue)) {
      errors.push('Please enter a valid number');
    } else if (!isNaN(numValue)) {
      if (validation.minValue !== null && numValue < validation.minValue) {
        errors.push(`Minimum value is ${validation.minValue}`);
      }
      if (validation.maxValue !== null && numValue > validation.maxValue) {
        errors.push(`Maximum value is ${validation.maxValue}`);
      }
    }
  }

  if (question.type === 'multi-choice' && Array.isArray(answer)) {
    if (validation.minSelections && answer.length < validation.minSelections) {
      errors.push(`Please select at least ${validation.minSelections} option(s)`);
    }
    if (validation.maxSelections && answer.length > validation.maxSelections) {
      errors.push(`Please select no more than ${validation.maxSelections} option(s)`);
    }
  }

  return errors;
};

export const shouldShowQuestion = (question, allAnswers) => {
  if (!question.conditionalLogic) return true;
  
  const { questionId, operator, value } = question.conditionalLogic.showIf;
  const targetAnswer = allAnswers[questionId];
  
  switch (operator) {
    case 'equals':
      return targetAnswer === value;
    case 'not_equals':
      return targetAnswer !== value;
    case 'contains':
      return Array.isArray(targetAnswer) ? targetAnswer.includes(value) : false;
    case 'greater_than':
      return parseFloat(targetAnswer) > parseFloat(value);
    case 'less_than':
      return parseFloat(targetAnswer) < parseFloat(value);
    case 'is_empty':
      return !targetAnswer || targetAnswer === '' || (Array.isArray(targetAnswer) && targetAnswer.length === 0);
    case 'is_not_empty':
      return targetAnswer && targetAnswer !== '' && (!Array.isArray(targetAnswer) || targetAnswer.length > 0);
    default:
      return true;
  }
};