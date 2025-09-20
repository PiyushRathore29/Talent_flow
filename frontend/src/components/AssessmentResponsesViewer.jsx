import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/database';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  CheckCircle, 
  FileText, 
  Calendar,
  Award,
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
  Filter
} from 'lucide-react';

const AssessmentResponsesViewer = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedResponse, setExpandedResponse] = useState(null);
  const [filterBy, setFilterBy] = useState('all'); // all, completed, pending
  const [sortBy, setSortBy] = useState('submitted_desc'); // submitted_desc, score_desc, score_asc

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user || user.role !== 'hr') {
          setError('Access denied. This page is only available for HR users.');
          setLoading(false);
          return;
        }

        // Load assessment data
        const assessmentData = await dbHelpers.getAssessmentById(parseInt(assessmentId));
        if (!assessmentData) {
          setError('Assessment not found.');
          setLoading(false);
          return;
        }

        // Load questions
        const questionsData = await dbHelpers.getQuestionsByAssessment(parseInt(assessmentId));
        
        // Load responses
        const responsesData = await dbHelpers.getResponsesByAssessment(parseInt(assessmentId));
        
        // Load candidate info for each response
        const candidatesData = await Promise.all(
          responsesData.map(async (response) => {
            const candidate = await dbHelpers.getUserById(response.candidateId);
            return {
              ...response,
              candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown Candidate',
              candidateEmail: candidate?.email || 'Unknown Email'
            };
          })
        );
        
        setAssessment(assessmentData);
        setQuestions(questionsData);
        setResponses(candidatesData);
        
      } catch (error) {
        console.error('Failed to load assessment responses:', error);
        setError('Failed to load assessment responses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, user]);

  const getFilteredAndSortedResponses = () => {
    let filtered = responses;
    
    // Apply filter
    switch (filterBy) {
      case 'completed':
        filtered = responses.filter(r => r.isCompleted);
        break;
      case 'pending':
        filtered = responses.filter(r => !r.isCompleted);
        break;
      default:
        filtered = responses;
    }
    
    // Apply sort
    switch (sortBy) {
      case 'submitted_desc':
        filtered = filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        break;
      case 'score_desc':
        filtered = filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'score_asc':
        filtered = filtered.sort((a, b) => (a.score || 0) - (b.score || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const getQuestionText = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question?.title || 'Question not found';
  };

  const getQuestionType = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question?.questionType || 'unknown';
  };

  const getAnswerText = (questionId, answer, questionType) => {
    if (!answer) return 'No answer provided';
    
    if (questionType === 'multiple_choice') {
      const question = questions.find(q => q.id === questionId);
      if (question?.options) {
        const option = question.options.find(opt => (opt.id || opt.index) === answer);
        return option?.text || answer;
      }
    }
    
    return answer;
  };

  const isCorrectAnswer = (questionId, answer) => {
    const question = questions.find(q => q.id === questionId);
    if (question?.questionType === 'multiple_choice' && question.options) {
      const correctOption = question.options.find(opt => opt.isCorrect);
      return correctOption && answer === (correctOption.id || correctOption.index);
    }
    return null; // Cannot determine for text questions
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/employer')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredResponses = getFilteredAndSortedResponses();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard/employer')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export Responses
              </button>
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assessment?.title}</h1>
            <p className="text-gray-600 mt-1">{assessment?.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Total Responses</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{responses.length}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {responses.filter(r => r.isCompleted).length}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Average Score</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {responses.length > 0 
                  ? Math.round(responses.reduce((sum, r) => sum + (r.score || 0), 0) / responses.length) 
                  : 0}%
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Passing Rate</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {responses.length > 0 
                  ? Math.round((responses.filter(r => (r.score || 0) >= (assessment?.passingScore || 60)).length / responses.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Responses</option>
                <option value="completed">Completed Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="submitted_desc">Latest First</option>
                <option value="score_desc">Highest Score</option>
                <option value="score_asc">Lowest Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responses List */}
        <div className="space-y-4">
          {filteredResponses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Responses Found</h3>
              <p className="text-gray-500">No candidates have submitted responses for this assessment yet.</p>
            </div>
          ) : (
            filteredResponses.map((response) => (
              <div key={response.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{response.candidateName}</h3>
                        <p className="text-gray-600 text-sm">{response.candidateEmail}</p>
                      </div>
                      
                      {response.isCompleted && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(response.score)}`}>
                          {response.score}%
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </div>
                        {response.timeTaken && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(response.timeTaken)}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setExpandedResponse(
                          expandedResponse === response.id ? null : response.id
                        )}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Responses
                        {expandedResponse === response.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Response Details */}
                  {expandedResponse === response.id && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-4">Question Responses:</h4>
                      <div className="space-y-4">
                        {Object.entries(response.questionResponses || {}).map(([questionId, answer]) => {
                          const questionType = getQuestionType(parseInt(questionId));
                          const isCorrect = isCorrectAnswer(parseInt(questionId), answer);
                          
                          return (
                            <div key={questionId} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-800">
                                  {getQuestionText(parseInt(questionId))}
                                </h5>
                                {isCorrect !== null && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-700">
                                <strong>Answer:</strong> {getAnswerText(parseInt(questionId), answer, questionType)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentResponsesViewer;