import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Upload, AlertCircle } from 'lucide-react';
import { validateQuestion, shouldShowQuestion } from '../data/assessmentsData';

const AssessmentPreview = ({ assessment, onClose }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentSection = assessment.sections[currentSectionIndex];
  const visibleQuestions = currentSection?.questions.filter(q => shouldShowQuestion(q, answers)) || [];
  const isLastSection = currentSectionIndex === assessment.sections.length - 1;

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Clear errors when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentSection = () => {
    const sectionErrors = {};
    
    visibleQuestions.forEach(question => {
      const answer = answers[question.id];
      const questionErrors = validateQuestion(question, answer);
      if (questionErrors.length > 0) {
        sectionErrors[question.id] = questionErrors;
      }
    });

    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (isLastSection) {
        handleSubmit();
      } else {
        setCurrentSectionIndex(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentSection()) {
      setSubmitted(true);
      // In a real app, you would save the responses here
      console.log('Assessment submitted:', answers);
    }
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id];
    const questionErrors = errors[question.id] || [];

    if (!shouldShowQuestion(question, answers)) {
      return null;
    }

    return (
      <div key={question.id} className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {question.title}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {question.description && (
            <p className="text-gray-600 mt-1">{question.description}</p>
          )}
        </div>

        {/* Render different question types */}
        {question.type === 'single-choice' && (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multi-choice' && (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(answer) && answer.includes(option.value)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    if (e.target.checked) {
                      updateAnswer(question.id, [...currentAnswers, option.value]);
                    } else {
                      updateAnswer(question.id, currentAnswers.filter(v => v !== option.value));
                    }
                  }}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'short-text' && (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your answer"
          />
        )}

        {question.type === 'long-text' && (
          <textarea
            value={answer || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder="Enter your detailed response"
          />
        )}

        {question.type === 'numeric' && (
          <input
            type="number"
            value={answer || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            min={question.validation?.minValue}
            max={question.validation?.maxValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter a number"
          />
        )}

        {question.type === 'file-upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">
              {question.validation?.fileTypes?.length > 0 
                ? `Accepted formats: ${question.validation.fileTypes.join(', ')}`
                : 'All file types accepted'
              }
              {question.validation?.maxFileSize && ` • Max size: ${question.validation.maxFileSize}MB`}
            </p>
            <input
              type="file"
              accept={question.validation?.fileTypes?.join(',')}
              onChange={(e) => updateAnswer(question.id, e.target.files[0]?.name || '')}
              className="hidden"
              id={`file-${question.id}`}
            />
            <label
              htmlFor={`file-${question.id}`}
              className="mt-2 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700"
            >
              Choose File
            </label>
            {answer && (
              <p className="mt-2 text-sm text-gray-600">Selected: {answer}</p>
            )}
          </div>
        )}

        {/* Display validation errors */}
        {questionErrors.length > 0 && (
          <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              {questionErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the assessment. Your responses have been saved.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
              <p className="text-gray-600 mt-1">{assessment.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          {assessment.settings?.showProgressBar && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Section {currentSectionIndex + 1} of {assessment.sections.length}</span>
                <span>{Math.round(((currentSectionIndex + 1) / assessment.sections.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSectionIndex + 1) / assessment.sections.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentSection && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900">{currentSection.title}</h2>
                {currentSection.description && (
                  <p className="text-gray-600 mt-2">{currentSection.description}</p>
                )}
              </div>

              <div className="space-y-6">
                {visibleQuestions.map(renderQuestion)}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {isLastSection ? (
                <>
                  <Send className="w-4 h-4" />
                  Submit Assessment
                </>
              ) : (
                <>
                  Next Section
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPreview;