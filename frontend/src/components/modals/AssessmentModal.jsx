import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, Clock, FileText, Hash, CheckSquare, Circle, Upload, Type, AlignLeft } from 'lucide-react';

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TEXT: 'text',
  SHORT_ANSWER: 'short_answer',
  LONG_TEXT: 'long_text',
  NUMERIC: 'numeric',
  FILE_UPLOAD: 'file-upload'
};

const QUESTION_TYPE_CONFIG = {
  [QUESTION_TYPES.MULTIPLE_CHOICE]: {
    icon: Circle,
    label: 'Multiple Choice',
    description: 'Select one option'
  },
  [QUESTION_TYPES.TEXT]: {
    icon: Type,
    label: 'Short Text',
    description: 'Brief text response'
  },
  [QUESTION_TYPES.SHORT_ANSWER]: {
    icon: Type,
    label: 'Short Answer',
    description: 'Brief answer response'
  },
  [QUESTION_TYPES.LONG_TEXT]: {
    icon: AlignLeft,
    label: 'Long Text',
    description: 'Detailed text response'
  },
  [QUESTION_TYPES.NUMERIC]: {
    icon: Hash,
    label: 'Numeric',
    description: 'Number with range'
  },
  [QUESTION_TYPES.FILE_UPLOAD]: {
    icon: Upload,
    label: 'File Upload',
    description: 'Upload documents'
  }
};

const QuestionEditor = ({ question, onUpdate, onDelete, index }) => {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [showConditional, setShowConditional] = useState(!!question.conditionalLogic);

  useEffect(() => {
    onUpdate(index, localQuestion);
  }, [localQuestion]);

  const updateField = (field, value) => {
    setLocalQuestion(prev => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    const newOptions = [...(localQuestion.options || [])];
    newOptions.push({ id: newOptions.length + 1, text: '', isCorrect: false });
    updateField('options', newOptions);
  };

  const updateOption = (optionIndex, value) => {
    const newOptions = [...(localQuestion.options || [])];
    if (typeof newOptions[optionIndex] === 'object') {
      newOptions[optionIndex] = { ...newOptions[optionIndex], text: value };
    } else {
      newOptions[optionIndex] = { id: optionIndex + 1, text: value, isCorrect: false };
    }
    updateField('options', newOptions);
  };

  const removeOption = (optionIndex) => {
    const newOptions = localQuestion.options.filter((_, i) => i !== optionIndex);
    updateField('options', newOptions);
  };

  const TypeIcon = QUESTION_TYPE_CONFIG[localQuestion.questionType]?.icon || Type;

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TypeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Question {index + 1}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({QUESTION_TYPE_CONFIG[localQuestion.questionType]?.label})
          </span>
        </div>
        <button
          onClick={() => onDelete(index)}
          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Question Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Question Title *
          </label>
          <input
            type="text"
            value={localQuestion.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            placeholder="Enter your question"
          />
        </div>

        {/* Question Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={localQuestion.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            rows="2"
            placeholder="Additional context or instructions"
          />
        </div>

        {/* Options for Choice Questions */}
        {localQuestion.questionType === QUESTION_TYPES.MULTIPLE_CHOICE && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options * <span className="text-xs text-gray-500 dark:text-gray-400">(Select the correct answer)</span>
            </label>
            <div className="space-y-2">
              {(localQuestion.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={option.isCorrect || false}
                    onChange={(e) => {
                      const newOptions = [...(localQuestion.options || [])];
                      newOptions.forEach((opt, i) => {
                        opt.isCorrect = i === optionIndex;
                      });
                      updateField('options', newOptions);
                    }}
                    className="text-green-600 dark:text-green-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <input
                    type="text"
                    value={typeof option === 'object' ? option.text : option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <button
                    onClick={() => removeOption(optionIndex)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {/* Numeric Range */}
        {localQuestion.questionType === QUESTION_TYPES.NUMERIC && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Value
              </label>
              <input
                type="number"
                value={localQuestion.validation?.min || ''}
                onChange={(e) => updateField('validation', { 
                  ...localQuestion.validation, 
                  min: parseFloat(e.target.value) || undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Value
              </label>
              <input
                type="number"
                value={localQuestion.validation?.max || ''}
                onChange={(e) => updateField('validation', { 
                  ...localQuestion.validation, 
                  max: parseFloat(e.target.value) || undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              />
            </div>
          </div>
        )}

        {/* Text Length for Text Questions */}
        {(localQuestion.questionType === QUESTION_TYPES.SHORT_TEXT || 
          localQuestion.questionType === QUESTION_TYPES.LONG_TEXT) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Length (characters)
            </label>
            <input
              type="number"
              value={localQuestion.validation?.maxLength || ''}
              onChange={(e) => updateField('validation', { 
                ...localQuestion.validation, 
                maxLength: parseInt(e.target.value) || undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              placeholder="Leave empty for no limit"
            />
          </div>
        )}

        {/* File Upload Settings */}
        {localQuestion.questionType === QUESTION_TYPES.FILE_UPLOAD && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Accepted File Types
            </label>
            <input
              type="text"
              value={localQuestion.validation?.fileTypes || ''}
              onChange={(e) => updateField('validation', { 
                ...localQuestion.validation, 
                fileTypes: e.target.value 
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              placeholder="e.g., .pdf,.doc,.docx"
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`required-${index}`}
            checked={localQuestion.isRequired || false}
            onChange={(e) => updateField('isRequired', e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <label htmlFor={`required-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
            Required question
          </label>
        </div>

        {/* Conditional Logic */}
        <div>
          <button
            onClick={() => setShowConditional(!showConditional)}
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            {showConditional ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showConditional ? 'Hide' : 'Add'} Conditional Logic
          </button>
          
          {showConditional && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-colors duration-200">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Show this question only if:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={localQuestion.conditionalLogic?.questionIndex || ''}
                  onChange={(e) => updateField('conditionalLogic', {
                    ...localQuestion.conditionalLogic,
                    questionIndex: parseInt(e.target.value)
                  })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                >
                  <option value="">Select question</option>
                  {/* This would be populated with previous questions */}
                </select>
                <select
                  value={localQuestion.conditionalLogic?.operator || 'equals'}
                  onChange={(e) => updateField('conditionalLogic', {
                    ...localQuestion.conditionalLogic,
                    operator: e.target.value
                  })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                >
                  <option value="equals">equals</option>
                  <option value="not_equals">does not equal</option>
                  <option value="contains">contains</option>
                </select>
                <input
                  type="text"
                  value={localQuestion.conditionalLogic?.value || ''}
                  onChange={(e) => updateField('conditionalLogic', {
                    ...localQuestion.conditionalLogic,
                    value: e.target.value
                  })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                  placeholder="Value"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssessmentModal = ({ isOpen, onClose, onSave, assessment }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (assessment) {
        setTitle(assessment.title || '');
        setDescription(assessment.description || '');
        setInstructions(assessment.instructions || '');
        setTimeLimit(assessment.timeLimit || '');
        setPassingScore(assessment.passingScore || '');
        setIsRequired(assessment.isRequired !== false);
        setQuestions(assessment.questions || []);
      } else {
        // Reset form for new assessment with a default question
        setTitle('');
        setDescription('');
        setInstructions('');
        setTimeLimit('');
        setPassingScore('');
        setIsRequired(true);
        setQuestions([
          {
            id: Date.now(),
            questionType: 'multiple_choice',
            title: 'Sample Question: What is your experience level?',
            description: 'Please select your level of experience',
            options: [
              { id: 1, text: 'Beginner (0-1 years)', isCorrect: false },
              { id: 2, text: 'Intermediate (2-4 years)', isCorrect: true },
              { id: 3, text: 'Advanced (5+ years)', isCorrect: false }
            ],
            validation: {},
            isRequired: true,
            order: 0
          }
        ]);
      }
      setShowPreview(false);
    }
  }, [assessment, isOpen]);

  if (!isOpen) return null;

  const addQuestion = (questionType) => {
    const newQuestion = {
      id: Date.now(),
      questionType,
      title: '',
      description: '',
      options: questionType === QUESTION_TYPES.MULTIPLE_CHOICE ? [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ] : undefined,
      validation: {},
      isRequired: false,
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const assessmentData = {
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      timeLimit: timeLimit ? parseInt(timeLimit) : null,
      passingScore: passingScore ? parseFloat(passingScore) : null,
      isRequired,
      questions: questions.map((q, index) => ({ ...q, order: index })),
      settings: {
        randomizeQuestions: false,
        showResults: true,
        allowRetakes: false
      }
    };

    onSave(assessmentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assessment ? 'Edit Assessment' : 'Create Assessment'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors duration-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showPreview ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assessment Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors duration-200"
                    placeholder="Leave empty for no limit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors duration-200"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions for Candidates
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors duration-200"
                  rows="3"
                  placeholder="Provide clear instructions on how to complete the assessment..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors duration-200"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Required for progression</span>
                  </label>
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Add Questions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(QUESTION_TYPE_CONFIG).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addQuestion(type)}
                        className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:border-orange-300 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200"
                      >
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{config.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{config.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Questions */}
              {questions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Questions ({questions.length})
                  </h3>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <QuestionEditor
                        key={question.id}
                        question={question}
                        index={index}
                        onUpdate={updateQuestion}
                        onDelete={deleteQuestion}
                      />
                    ))}
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Preview Mode */
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assessment Preview</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold mb-2">{title || 'Untitled Assessment'}</h4>
                {description && <p className="text-gray-600 mb-4">{description}</p>}
                {instructions && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h5 className="font-medium text-blue-900 mb-2">Instructions:</h5>
                    <p className="text-blue-800">{instructions}</p>
                  </div>
                )}
                
                {timeLimit && (
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time limit: {timeLimit} minutes</span>
                  </div>
                )}

                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border-b pb-4">
                      <h6 className="font-medium mb-2">
                        {index + 1}. {question.title || 'Untitled Question'}
                        {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </h6>
                      {question.description && (
                        <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                      )}
                      
                      {/* Render preview based on question type */}
                      {(question.questionType === QUESTION_TYPES.SINGLE_CHOICE || 
                        question.questionType === QUESTION_TYPES.MULTI_CHOICE) && (
                        <div className="space-y-2">
                          {(question.options || []).map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center gap-2">
                              <input
                                type={question.questionType === QUESTION_TYPES.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                                name={`question-${index}`}
                                disabled
                                className="text-orange-600"
                              />
                              <span className="text-sm">{option || `Option ${optionIndex + 1}`}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.questionType === QUESTION_TYPES.SHORT_TEXT && (
                        <input
                          type="text"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          placeholder="Short text answer..."
                        />
                      )}
                      
                      {question.questionType === QUESTION_TYPES.LONG_TEXT && (
                        <textarea
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          rows="4"
                          placeholder="Detailed text answer..."
                        />
                      )}
                      
                      {question.questionType === QUESTION_TYPES.NUMERIC && (
                        <input
                          type="number"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          placeholder="Numeric answer..."
                        />
                      )}
                      
                      {question.questionType === QUESTION_TYPES.FILE_UPLOAD && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">File upload area</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showPreview && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={!title.trim() || questions.length === 0}
            >
              {assessment ? 'Update Assessment' : 'Create Assessment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentModal;