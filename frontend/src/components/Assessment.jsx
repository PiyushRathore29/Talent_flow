import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, Upload, AlertCircle, Clock } from 'lucide-react';
import { validateQuestion, shouldShowQuestion, STORAGE_KEYS } from '../data/assessmentsData';

const Assessment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Load assessment
  useEffect(() => {
    const savedAssessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '{}');
    const assessmentKey = `job-${jobId}`;
    
    if (savedAssessments[assessmentKey]) {
      setAssessment(savedAssessments[assessmentKey]);
      
      // Load saved responses if any
      const savedResponses = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESPONSES) || '{}');
      if (savedResponses[assessmentKey]) {
        setAnswers(savedResponses[assessmentKey]);
      }
      
      // Set time limit if specified
      if (savedAssessments[assessmentKey].settings?.timeLimit) {
        setTimeRemaining(savedAssessments[assessmentKey].settings.timeLimit * 60); // Convert to seconds
      }
    }
    setLoading(false);
  }, [jobId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // Auto-save responses
  useEffect(() => {
    if (assessment && Object.keys(answers).length > 0) {
      const savedResponses = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESPONSES) || '{}');
      savedResponses[`job-${jobId}`] = answers;
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESPONSES, JSON.stringify(savedResponses));
    }
  }, [answers, assessment, jobId]);

  const currentSection = assessment?.sections[currentSectionIndex];
  const visibleQuestions = currentSection?.questions.filter(q => shouldShowQuestion(q, answers)) || [];
  const isLastSection = currentSectionIndex === (assessment?.sections.length || 1) - 1;

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
    if (currentSectionIndex > 0 && assessment?.settings?.allowBackNavigation) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentSection()) {
      setSubmitted(true);
      // Save final submission
      const savedResponses = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESPONSES) || '{}');
      savedResponses[`job-${jobId}`] = {
        ...answers,
        submittedAt: new Date().toISOString(),
        timeTaken: assessment?.settings?.timeLimit ? 
          (assessment.settings.timeLimit * 60 - (timeRemaining || 0)) : null
      };
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESPONSES, JSON.stringify(savedResponses));
      
      setTimeout(() => {
        navigate('/dashboard/candidate');
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id];
    const questionErrors = errors[question.id] || [];

    if (!shouldShowQuestion(question, answers)) {
      return null;
    }

    return (
      <div key={question.id} className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <div className="mb-4">
          <h3 className="text-hero font-impact font-black uppercase text-primary-500 leading-none tracking-tight">
            {question.title}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {question.description && (
            <p className="text-gray-600 mt-1">{question.description}</p>
          )}
        </div>

        {/* Render different question types */}
        {question.type === 'single-choice' && (
          <div className="space-y-3">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
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
          <div className="space-y-3">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your answer"
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === 'long-text' && (
          <div>
            <textarea
              value={answer || ''}
              onChange={(e) => updateAnswer(question.id, e.target.value)}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Enter your detailed response"
              maxLength={question.validation?.maxLength}
            />
            {question.validation?.maxLength && (
              <div className="text-right text-sm text-gray-500 mt-1">
                {(answer || '').length} / {question.validation.maxLength}
              </div>
            )}
          </div>
        )}

        {question.type === 'numeric' && (
          <input
            type="number"
            value={answer || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            min={question.validation?.minValue}
            max={question.validation?.maxValue}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter a number"
          />
        )}

        {question.type === 'file-upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-300 transition-colors">
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400 mb-4">
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
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors"
            >
              Choose File
            </label>
            {answer && (
              <p className="mt-3 text-sm text-gray-600 font-medium">Selected: {answer}</p>
            )}
          </div>
        )}

        {/* Display validation errors */}
        {questionErrors.length > 0 && (
          <div className="mt-3 flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
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

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </section>
    );
  }

  if (!assessment) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-hero font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-4">Assessment Not Found</h2>
          <p className="text-gray-600 mb-6">The assessment for this job hasn't been created yet.</p>
          <button
            onClick={() => navigate('/dashboard/candidate')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Return to Dashboard
          </button>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-hero font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-4">Assessment Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the assessment. Your responses have been saved and you'll be redirected to your dashboard shortly.
          </p>
          <div className="animate-pulse text-primary-600">Redirecting...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-hero font-impact font-black uppercase text-primary-500 leading-none tracking-tight">{assessment.title}</h1>
              <p className="text-gray-600 mt-1">{assessment.description}</p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {assessment.settings?.showProgressBar && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Section {currentSectionIndex + 1} of {assessment.sections.length}</span>
                <span>{Math.round(((currentSectionIndex + 1) / assessment.sections.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentSectionIndex + 1) / assessment.sections.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {currentSection && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-hero font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-2">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-gray-600">{currentSection.description}</p>
              )}
            </div>

            <div className="space-y-6">
              {visibleQuestions.map(renderQuestion)}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0 || !assessment.settings?.allowBackNavigation}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Section
            </button>

            <div className="text-sm text-gray-500">
              Section {currentSectionIndex + 1} of {assessment.sections.length}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {isLastSection ? (
                <>
                  <Send className="w-5 h-5" />
                  Submit Assessment
                </>
              ) : (
                <>
                  Next Section
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assessment;
