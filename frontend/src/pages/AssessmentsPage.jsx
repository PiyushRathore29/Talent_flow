import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(1); // Default to job 1

  // Load jobs and assessments
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load jobs first
        const jobsResponse = await fetch('/api/jobs');
        if (!jobsResponse.ok) {
          throw new Error(`Failed to load jobs: ${jobsResponse.statusText}`);
        }
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.data || []);
        
        // Load assessment for selected job
        if (selectedJobId) {
          await loadAssessmentForJob(selectedJobId);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedJobId]);

  const loadAssessmentForJob = async (jobId) => {
    try {
      const response = await fetch(`/api/assessments/${jobId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setAssessments([]); // No assessment for this job yet
          return;
        }
        throw new Error(`Failed to load assessment: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAssessments(data.data ? [data.data] : []);
    } catch (err) {
      console.error('Error loading assessment:', err);
      setAssessments([]);
    }
  };

  const handleCreateAssessment = async (jobId) => {
    const defaultAssessment = {
      title: `Assessment for ${jobs.find(j => j.id === jobId)?.title || 'Job'}`,
      description: 'New assessment created',
      timeLimit: 60,
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          title: 'Sample Question',
          options: [
            { id: 'a', text: 'Option A', isCorrect: false },
            { id: 'b', text: 'Option B', isCorrect: true },
            { id: 'c', text: 'Option C', isCorrect: false }
          ],
          points: 10
        }
      ]
    };

    try {
      const response = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultAssessment)
      });

      if (!response.ok) {
        throw new Error(`Failed to create assessment: ${response.statusText}`);
      }

      await loadAssessmentForJob(jobId);
    } catch (err) {
      console.error('Error creating assessment:', err);
      alert('Failed to create assessment: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  const selectedJob = jobs.find(job => job.id === selectedJobId);
  const currentAssessment = assessments[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessments</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                Manage job-specific assessments • GET /assessments/:jobId, PUT /assessments/:jobId
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Job
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              {!currentAssessment && selectedJobId && (
                <button
                  onClick={() => handleCreateAssessment(selectedJobId)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Assessment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading assessments</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Content */}
        {selectedJob ? (
          currentAssessment ? (
            <AssessmentDisplay 
              assessment={currentAssessment} 
              job={selectedJob}
              onUpdate={() => loadAssessmentForJob(selectedJobId)}
            />
          ) : (
            <EmptyAssessmentState 
              job={selectedJob} 
              onCreate={() => handleCreateAssessment(selectedJobId)}
            />
          )
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-500">Create jobs first to build assessments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Assessment Display Component
const AssessmentDisplay = ({ assessment, job, onUpdate }) => {
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  const loadResponses = async () => {
    try {
      setLoadingResponses(true);
      const response = await fetch(`/api/assessments/${job.id}/responses`);
      if (response.ok) {
        const data = await response.json();
        setResponses(data.data || []);
      }
    } catch (err) {
      console.error('Error loading responses:', err);
    } finally {
      setLoadingResponses(false);
    }
  };

  const handleViewResponses = () => {
    setShowResponses(true);
    loadResponses();
  };

  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{assessment.title}</h2>
            <p className="text-gray-600 mt-1">{assessment.description}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/assessments/${job.id}`}
              className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Edit Assessment
            </Link>
            <button
              onClick={handleViewResponses}
              className="px-3 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
            >
              View Responses ({responses.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{assessment.questions?.length || 0}</div>
            <div className="text-sm text-blue-800">Questions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{assessment.timeLimit || 'No limit'}</div>
            <div className="text-sm text-green-800">Time Limit (min)</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{assessment.passingScore || 70}%</div>
            <div className="text-sm text-purple-800">Passing Score</div>
          </div>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Questions Preview</h3>
        <div className="space-y-4">
          {assessment.questions?.slice(0, 3).map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {index + 1}. {question.title}
                </h4>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {question.type}
                </span>
              </div>
              
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2 mt-3">
                  {question.options.map((option, optIndex) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        option.isCorrect ? 'bg-green-100 border-green-500' : 'border-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-700">{option.text}</span>
                      {option.isCorrect && <span className="text-xs text-green-600">✓ Correct</span>}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                Points: {question.points || 0}
              </div>
            </div>
          ))}
          
          {assessment.questions?.length > 3 && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">... and {assessment.questions.length - 3} more questions</p>
              <Link
                to={`/assessments/${job.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all questions →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Test Assessment Link */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Test Assessment</h3>
        <p className="text-gray-600 mb-4">
          Try out the assessment as a candidate would see it.
        </p>
        <Link
          to={`/assessments/${job.id}/take`}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
        >
          Take Assessment
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Responses Modal */}
      {showResponses && (
        <ResponsesModal 
          responses={responses}
          loading={loadingResponses}
          onClose={() => setShowResponses(false)}
        />
      )}
    </div>
  );
};

// Empty Assessment State Component
const EmptyAssessmentState = ({ job, onCreate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
      <div className="text-gray-400 text-6xl mb-6">📝</div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        No Assessment for "{job.title}"
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Create a custom assessment with multiple question types to evaluate candidates for this position.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onCreate}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Assessment
        </button>
        
        <div className="text-sm text-gray-500">
          <p>Assessment features:</p>
          <ul className="mt-2 space-y-1">
            <li>• Multiple choice questions</li>
            <li>• Text-based responses</li>
            <li>• Time limits and scoring</li>
            <li>• Automatic evaluation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Responses Modal Component
const ResponsesModal = ({ responses, loading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Assessment Responses</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading responses...</p>
            </div>
          ) : responses.length > 0 ? (
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">
                      Candidate {response.candidateId}
                    </h4>
                    <div className="text-sm text-gray-500">
                      Score: {response.score}% • Time: {Math.round(response.timeTaken / 60)}min
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Submitted: {new Date(response.submittedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-500">Responses will appear here when candidates complete the assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;