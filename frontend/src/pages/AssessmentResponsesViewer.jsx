import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/database';
import { 
  ArrowLeft, User, Clock, CheckCircle, FileText, 
  BarChart3, Filter, Download, Eye, Calendar,
  Award, XCircle, AlertCircle, TrendingUp
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
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending
  const [sortBy, setSortBy] = useState('submittedAt'); // submittedAt, score, name
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user || user.role !== 'hr') {
          setError('Access denied. This page is only available for HR personnel.');
          setLoading(false);
          return;
        }

        console.log('Loading assessment with ID:', assessmentId);
        
        // Validate assessmentId
        if (!assessmentId || assessmentId === 'undefined' || assessmentId === 'null') {
          setError('Invalid assessment ID.');
          setLoading(false);
          return;
        }

        const parsedAssessmentId = parseInt(assessmentId);
        if (isNaN(parsedAssessmentId)) {
          setError('Invalid assessment ID format.');
          setLoading(false);
          return;
        }

        // Load assessment data
        const assessmentData = await dbHelpers.getAssessmentById(parsedAssessmentId);
        console.log('Assessment data:', assessmentData);
        
        if (!assessmentData) {
          setError('Assessment not found.');
          setLoading(false);
          return;
        }

        // Load questions
        const questionsData = await dbHelpers.getQuestionsByAssessment(parseInt(assessmentId));
        
        // Load responses
        const responsesData = await dbHelpers.getResponsesByAssessment(parseInt(assessmentId));
        
        // Load candidates with their responses
        const jobCandidates = await dbHelpers.getCandidatesByJob(assessmentData.jobId);
        const candidatesWithResponses = jobCandidates.map(candidate => {
          const candidateResponse = responsesData.find(r => r.candidateId === candidate.userId || r.candidateId === candidate.id);
          return {
            ...candidate,
            response: candidateResponse,
            hasCompleted: !!candidateResponse,
            score: candidateResponse?.score || 0,
            submittedAt: candidateResponse?.submittedAt,
            timeTaken: candidateResponse?.timeTaken
          };
        });

        setAssessment(assessmentData);
        setQuestions(questionsData);
        setResponses(responsesData);
        setCandidates(candidatesWithResponses);
        
      } catch (error) {
        console.error('Failed to load assessment data:', error);
        setError('Failed to load assessment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, user]);

  const filteredAndSortedCandidates = React.useMemo(() => {
    let filtered = candidates;

    // Apply filter
    if (filterStatus === 'completed') {
      filtered = candidates.filter(c => c.hasCompleted);
    } else if (filterStatus === 'pending') {
      filtered = candidates.filter(c => !c.hasCompleted);
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'name':
          return (a.userName || a.name || '').localeCompare(b.userName || b.name || '');
        case 'submittedAt':
        default:
          if (!a.submittedAt && !b.submittedAt) return 0;
          if (!a.submittedAt) return 1;
          if (!b.submittedAt) return -1;
          return new Date(b.submittedAt) - new Date(a.submittedAt);
      }
    });
  }, [candidates, filterStatus, sortBy]);

  const completedCount = candidates.filter(c => c.hasCompleted).length;
  const averageScore = completedCount > 0 
    ? candidates.filter(c => c.hasCompleted).reduce((sum, c) => sum + (c.score || 0), 0) / completedCount 
    : 0;

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (date) => {
    if (!date) return 'Not submitted';
    return new Date(date).toLocaleString();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const renderQuestionResponse = (question, response) => {
    const userAnswer = response?.questionResponses?.[question.id];
    
    switch (question.questionType) {
      case 'multiple_choice':
        const selectedOption = question.options?.find(opt => 
          opt.id === userAnswer || opt.id === parseInt(userAnswer)
        );
        const correctOption = question.options?.find(opt => opt.isCorrect);
        const isCorrect = selectedOption?.isCorrect;
        
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {question.options?.map((option) => {
                const isSelected = option.id === userAnswer || option.id === parseInt(userAnswer);
                const isCorrectOption = option.isCorrect;
                
                let classes = 'p-2 rounded border text-sm ';
                if (isSelected && isCorrectOption) {
                  classes += 'bg-green-100 border-green-300 text-green-800';
                } else if (isSelected && !isCorrectOption) {
                  classes += 'bg-red-100 border-red-300 text-red-800';
                } else if (isCorrectOption) {
                  classes += 'bg-green-50 border-green-200 text-green-600';
                } else {
                  classes += 'bg-gray-50 border-gray-200 text-gray-600';
                }
                
                return (
                  <div key={option.id} className={classes}>
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      <div className="flex gap-1">
                        {isSelected && <span className="text-xs">(Selected)</span>}
                        {isCorrectOption && <CheckCircle className="w-4 h-4" />}
                        {isSelected && !isCorrectOption && <XCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs flex items-center gap-2">
              {isCorrect ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Correct
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Incorrect
                </span>
              )}
            </div>
          </div>
        );
        
      case 'text':
      case 'short_answer':
      case 'long_text':
        return (
          <div className="space-y-2">
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-gray-800 whitespace-pre-wrap">
                {userAnswer || <span className="text-gray-400 italic">No answer provided</span>}
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-gray-400 italic text-sm">
            Unknown question type
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/employer')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assessment?.title}</h1>
                <p className="text-gray-600">{assessment?.description}</p>
              </div>
            </div>
            <button
              onClick={() => {/* TODO: Export functionality */}}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Results
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <User className="w-4 h-4" />
                <span className="font-medium">Total Candidates</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{candidates.length}</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{completedCount}</div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{candidates.length - completedCount}</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Award className="w-4 h-4" />
                <span className="font-medium">Average Score</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {averageScore.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
                  <span className="text-sm text-gray-500">{filteredAndSortedCandidates.length} candidates</span>
                </div>
                
                {/* Filters */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="submittedAt">By Date</option>
                    <option value="score">By Score</option>
                    <option value="name">By Name</option>
                  </select>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredAndSortedCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedCandidate?.id === candidate.id 
                        ? 'bg-primary-50 border-primary-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {candidate.userName || candidate.name || 'Unknown Candidate'}
                      </h3>
                      {candidate.hasCompleted ? (
                        <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200">
                          Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(candidate.submittedAt)}
                      </div>
                      {candidate.timeTaken && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(candidate.timeTaken)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredAndSortedCandidates.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No candidates found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Details */}
          <div className="lg:col-span-2">
            {selectedCandidate ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedCandidate.userName || selectedCandidate.name || 'Unknown Candidate'}
                      </h2>
                      <p className="text-gray-600">{selectedCandidate.userEmail || selectedCandidate.email}</p>
                    </div>
                    
                    {selectedCandidate.hasCompleted && (
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getScoreColor(selectedCandidate.score)}`}>
                          <Award className="w-4 h-4" />
                          <span className="font-semibold">{selectedCandidate.score}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Submitted: {formatDate(selectedCandidate.submittedAt)}
                        </div>
                        {selectedCandidate.timeTaken && (
                          <div className="text-xs text-gray-500">
                            Time taken: {formatDuration(selectedCandidate.timeTaken)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {selectedCandidate.hasCompleted ? (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3">
                            <h3 className="font-medium text-gray-900 mb-1">
                              Question {index + 1}
                            </h3>
                            <p className="text-gray-700">{question.title}</p>
                            {question.description && (
                              <p className="text-gray-600 text-sm mt-1">{question.description}</p>
                            )}
                          </div>
                          
                          {renderQuestionResponse(question, selectedCandidate.response)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">Assessment Not Completed</h3>
                      <p>This candidate has not yet submitted their assessment responses.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Candidate</h3>
                  <p>Choose a candidate from the list to view their assessment responses.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResponsesViewer;