import React from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { questionTypes, validationRules, conditionalOperators } from '../data/assessmentsData';

const QuestionEditor = ({ question, allQuestions, onUpdate }) => {
  const questionType = questionTypes.find(t => t.id === question.type);
  const availableValidations = validationRules[question.type] || [];

  const updateOption = (optionId, updates) => {
    const updatedOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    onUpdate({ options: updatedOptions });
  };

  const addOption = () => {
    const newOption = {
      id: `opt-${Date.now()}`,
      text: `Option ${question.options.length + 1}`,
      value: `option${question.options.length + 1}`
    };
    onUpdate({ options: [...question.options, newOption] });
  };

  const removeOption = (optionId) => {
    onUpdate({ options: question.options.filter(opt => opt.id !== optionId) });
  };

  const updateValidation = (field, value) => {
    onUpdate({
      validation: {
        ...question.validation,
        [field]: value
      }
    });
  };

  const updateConditionalLogic = (updates) => {
    onUpdate({
      conditionalLogic: updates
    });
  };

  const removeConditionalLogic = () => {
    onUpdate({ conditionalLogic: null });
  };

  const otherQuestions = allQuestions.filter(q => q.id !== question.id);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{questionType?.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{questionType?.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{questionType?.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Content</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                placeholder="Enter your question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={question.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                placeholder="Provide additional context or instructions"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={question.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="h-4 w-4 text-primary-600 dark:text-primary-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Required field
              </label>
            </div>
          </div>
        </div>

        {/* Options for choice questions */}
        {(question.type === 'single-choice' || question.type === 'multi-choice') && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Answer Options</h3>
            
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder={`Option ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => updateOption(option.id, { value: e.target.value })}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-sm transition-colors duration-200"
                    placeholder="value"
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validation Rules</h3>
          
          <div className="space-y-4">
            {availableValidations.includes('minLength') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    value={question.validation?.minLength || ''}
                    onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Length
                  </label>
                  <input
                    type="number"
                    value={question.validation?.maxLength || ''}
                    onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder="1000"
                  />
                </div>
              </div>
            )}

            {availableValidations.includes('minValue') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={question.validation?.minValue || ''}
                    onChange={(e) => updateValidation('minValue', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={question.validation?.maxValue || ''}
                    onChange={(e) => updateValidation('maxValue', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder="100"
                  />
                </div>
              </div>
            )}

            {availableValidations.includes('minSelections') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Selections
                  </label>
                  <input
                    type="number"
                    value={question.validation?.minSelections || ''}
                    onChange={(e) => updateValidation('minSelections', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Selections
                  </label>
                  <input
                    type="number"
                    value={question.validation?.maxSelections || ''}
                    onChange={(e) => updateValidation('maxSelections', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                    placeholder="3"
                  />
                </div>
              </div>
            )}

            {availableValidations.includes('fileTypes') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allowed File Types
                </label>
                <input
                  type="text"
                  value={question.validation?.fileTypes?.join(', ') || ''}
                  onChange={(e) => updateValidation('fileTypes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                  placeholder=".pdf, .doc, .zip"
                />
              </div>
            )}

            {availableValidations.includes('maxFileSize') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={question.validation?.maxFileSize || ''}
                  onChange={(e) => updateValidation('maxFileSize', e.target.value ? parseInt(e.target.value) : 5)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                  placeholder="5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Conditional Logic */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conditional Logic</h3>
          
          {question.conditionalLogic ? (
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show this question only if:</span>
                <button
                  onClick={removeConditionalLogic}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={question.conditionalLogic.showIf?.questionId || ''}
                  onChange={(e) => updateConditionalLogic({
                    showIf: { ...question.conditionalLogic.showIf, questionId: e.target.value }
                  })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                >
                  <option value="">Select question</option>
                  {otherQuestions.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.title || 'Untitled Question'}
                    </option>
                  ))}
                </select>
                
                <select
                  value={question.conditionalLogic.showIf?.operator || ''}
                  onChange={(e) => updateConditionalLogic({
                    showIf: { ...question.conditionalLogic.showIf, operator: e.target.value }
                  })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                >
                  <option value="">Select operator</option>
                  {conditionalOperators.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={question.conditionalLogic.showIf?.value || ''}
                  onChange={(e) => updateConditionalLogic({
                    showIf: { ...question.conditionalLogic.showIf, value: e.target.value }
                  })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                  placeholder="Value"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => updateConditionalLogic({ showIf: { questionId: '', operator: '', value: '' } })}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Conditional Logic
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;