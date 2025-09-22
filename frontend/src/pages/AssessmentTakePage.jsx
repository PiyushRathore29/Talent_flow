import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/database';
import { Clock, CheckCircle, AlertCircle, Send, ArrowLeft, FileText } from 'lucide-react';

const AssessmentTakePage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        if (!user || user.role !== 'candidate') {
          setError('Access denied. This page is only available for candidates.');
          setLoading(false);
          return;
        }

        console.log('Loading assessment with ID:', assessmentId);
        const assessmentData = await dbHelpers.getAssessmentById(parseInt(assessmentId));
        console.log('Assessment data loaded:', assessmentData);
        
        if (!assessmentData) {
          setError('Assessment not found.');
          setLoading(false);
          return;
        }

        const questionsData = await dbHelpers.getQuestionsByAssessment(parseInt(assessmentId));
        console.log('Questions data loaded:', questionsData);
        
        setAssessment(assessmentData);
        setQuestions(questionsData);
        
        // Initialize responses object
        const initialResponses = {};
        questionsData.forEach(question => {
          initialResponses[question.id] = '';
        });
        setResponses(initialResponses);
        
        // Set timer if assessment has time limit
        if (assessmentData.timeLimit) {
          setTimeRemaining(assessmentData.timeLimit * 60); // Convert minutes to seconds
        }
        
      } catch (error) {
        console.error('Failed to load assessment:', error);
        setError('Failed to load assessment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId, user]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted || timeRemaining === null || timeRemaining <= 0) return;

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
  }, [hasStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResponseChange = (questionId, value) => {
    console.log('📝 Response changing:', { questionId, value, currentResponses: responses });
    setResponses(prev => {
      const newResponses = {
        ...prev,
        [questionId]: value
      };
      console.log('📝 New responses state:', newResponses);
      return newResponses;
    });
  };

  const handleStartAssessment = () => {
    setHasStarted(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Calculate score (basic implementation)
      let correctAnswers = 0;
      let totalQuestions = questions.length;
      
      questions.forEach(question => {
        const userResponse = responses[question.id];
        
        // For multiple choice questions, check if the selected option is correct
        if (question.questionType === 'multiple_choice' && question.options) {
          const correctOption = question.options.find(opt => opt.isCorrect);
          if (correctOption && userResponse === correctOption.id) {
            correctAnswers++;
          }
        }
        // For other question types, consider them correct if answered (for now)
        else if (userResponse && userResponse.trim()) {
          correctAnswers++;
        }
      });
      
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // Create response record
      const responseData = {
        assessmentId: parseInt(assessmentId),
        candidateId: user.id,
        questionResponses: responses,
        submittedAt: new Date(),
        timeTaken: assessment.timeLimit ? (assessment.timeLimit * 60 - (timeRemaining || 0)) : null,
        score: score,
        isCompleted: true,
        startedAt: new Date() // In a real app, you'd track when they actually started
      };
      
      await dbHelpers.createAssessmentResponse(responseData);
      
      // Update candidate record to mark assessment as completed
      // Find the job and update the candidate's assessment status in the workflow
      try {
        const assessmentData = await dbHelpers.getAssessmentById(parseInt(assessmentId));
        if (assessmentData && assessmentData.jobId) {
          // This would need to trigger a workflow update to mark the candidate as completed
          // For now, we'll let the periodic refresh in the dashboard handle this
          console.log('Assessment response saved for job:', assessmentData.jobId);
        }
      } catch (error) {
        console.error('Failed to update workflow status:', error);
      }
      
      console.log('Assessment submitted successfully');
      
      // Navigate back to dashboard
      navigate('/dashboard/candidate', { 
        state: { 
          message: `Assessment submitted successfully! Your score: ${score}%` 
        }
      });
      
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const response = responses[question.id] || '';
    
    console.log('Rendering question:', question);
    console.log('Question options:', question.options);
    console.log('Current response:', response);
    
    switch (question.questionType) {
      case 'multiple_choice':
        return (
          <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Question {index + 1}
                {question.isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <p className="text-gray-700">{question.title}</p>
              {question.description && (
                <p className="text-gray-600 text-sm mt-2">{question.description}</p>
              )}
            </div>
            
            <div className="space-y-2">
              {question.options?.map((option, optIndex) => {
                const optionValue = option.id || optIndex;
                const isChecked = response == optionValue; // Use == instead of === to handle type coercion
                
                return (
                  <label key={optionValue} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionValue}
                      checked={isChecked}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{option.text || option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
        
      case 'text':
      case 'short_answer':
        return (
          <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Question {index + 1}
                {question.isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <p className="text-gray-700">{question.title}</p>
              {question.description && (
                <p className="text-gray-600 text-sm mt-2">{question.description}</p>
              )}
            </div>
            
            <textarea
              value={response}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Enter your answer..."
              rows={question.questionType === 'text' ? 6 : 3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        );
        
      case 'long_text':
        return (
          <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Question {index + 1}
                {question.isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <p className="text-gray-700">{question.title}</p>
              {question.description && (
                <p className="text-gray-600 text-sm mt-2">{question.description}</p>
              )}
            </div>
            
            <textarea
              value={response}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Enter your detailed answer..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/candidate')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border dark:border-gray-800">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{assessment.title}</h1>
              <p className="text-gray-600 dark:text-gray-300">{assessment.description}</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Number of Questions</span>
                <span className="text-gray-900 dark:text-white">{questions.length}</span>
              </div>
              
              {assessment.timeLimit && (
                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Time Limit</span>
                  <span className="text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {assessment.timeLimit} minutes
                  </span>
                </div>
              )}
              
              {assessment.passingScore && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="font-medium text-gray-700">Passing Score</span>
                  <span className="text-gray-900">{assessment.passingScore}%</span>
                </div>
              )}
            </div>
            
            {assessment.instructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
                <p className="text-blue-800 text-sm">{assessment.instructions}</p>
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard/candidate')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <button
                onClick={handleStartAssessment}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with timer */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-4 mb-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{assessment.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{questions.length} questions</p>
            </div>
            
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className={`font-mono font-medium ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((question, index) => renderQuestion(question, index))}
        </div>

        {/* Submit section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Ready to submit?</h3>
              <p className="text-gray-600 text-sm">
                Please review your answers before submitting. You cannot change them after submission.
              </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Assessment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTakePage;