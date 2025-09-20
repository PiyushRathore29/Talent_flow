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
            <h2 className="text-xl font-bold text-gray-900">{questionType?.name}</h2>
            <p className="text-sm text-gray-600">{questionType?.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Content</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={question.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Provide additional context or instructions"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={question.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>
          </div>
        </div>

        {/* Options for choice questions */}
        {(question.type === 'single-choice' || question.type === 'multi-choice') && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Options</h3>
            
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => updateOption(option.id, { value: e.target.value })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="value"
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Rules</h3>
          
          <div className="space-y-4">
            {availableValidations.includes('minLength') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    value={question.validation?.minLength || ''}
                    onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Length
                  </label>
                  <input
                    type="number"
                    value={question.validation?.maxLength || ''}
                    onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1000"
                  />
                </div>
              </div>
            )}

            {availableValidations.includes('minValue') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={question.validation?.minValue || ''}
                    onChange={(e) => updateValidation('minValue', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={question.validation?.maxValue || ''}
                    onChange={(e) => updateValidation('maxValue', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>
              </div>
            )}

            {availableValidations.includes('minSelections') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Selections
                  </label>
                  <input
                    type="number"
                    value={question.validation?.minSelections || ''}
                    onChange={(e) => updateValidation('minSelections', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Selections
                  </label>
                  <input
                    type="number"
                    value={question.validation?.maxSelections || ''}
                    onChange={(e) => updateValidation('maxSelections', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="3"
                  />
                </div>
              </div>
            )}

            {availableValidations.includes('fileTypes') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed File Types
                </label>
                <input
                  type="text"
                  value={question.validation?.fileTypes?.join(', ') || ''}
                  onChange={(e) => updateValidation('fileTypes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder=".pdf, .doc, .zip"
                />
              </div>
            )}

            {availableValidations.includes('maxFileSize') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={question.validation?.maxFileSize || ''}
                  onChange={(e) => updateValidation('maxFileSize', e.target.value ? parseInt(e.target.value) : 5)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Conditional Logic */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conditional Logic</h3>
          
          {question.conditionalLogic ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Show this question only if:</span>
                <button
                  onClick={removeConditionalLogic}
                  className="text-red-600 hover:text-red-700 text-sm"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Value"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => updateConditionalLogic({ showIf: { questionId: '', operator: '', value: '' } })}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
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