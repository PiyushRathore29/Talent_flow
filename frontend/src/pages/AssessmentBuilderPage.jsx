import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AssessmentBuilderPage = () => {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load assessment and job data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load job details
        const jobResponse = await fetch(`/api/jobs/${jobId}`);
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJob(jobData.data);
        }
        
        // Load existing assessment or create default
        const assessmentResponse = await fetch(`/api/assessments/${jobId}`);
        if (assessmentResponse.ok) {
          const assessmentData = await assessmentResponse.json();
          setAssessment(assessmentData.data);
        } else if (assessmentResponse.status === 404) {
          // Create default assessment structure
          setAssessment({
            title: `Assessment for Job ${jobId}`,
            description: 'New assessment',
            timeLimit: 60,
            passingScore: 70,
            questions: []
          });
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadData();
    }
  }, [jobId]);

  // Save assessment
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      });

      if (!response.ok) {
        throw new Error(`Failed to save assessment: ${response.statusText}`);
      }

      alert('Assessment saved successfully!');
    } catch (err) {
      console.error('Error saving assessment:', err);
      alert('Failed to save assessment: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add new question
  const addQuestion = (type) => {
    const newQuestion = {
      id: `q${Date.now()}`,
      type: type,
      title: 'New Question',
      points: 10,
      ...(type === 'multiple_choice' && {
        options: [
          { id: 'a', text: 'Option A', isCorrect: false },
          { id: 'b', text: 'Option B', isCorrect: true },
          { id: 'c', text: 'Option C', isCorrect: false }
        ]
      }),
      ...(type === 'text' && {
        maxLength: 500
      })
    };

    setAssessment(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  // Update question
  const updateQuestion = (questionId, updates) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  // Delete question
  const deleteQuestion = (questionId) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-impact font-black uppercase text-primary-500 leading-tight tracking-tight mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/assessments"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-impact font-black uppercase text-primary-500 leading-tight tracking-tight">Assessment Builder</h1>
              <p className="mt-1 text-sm text-gray-500">
                {job?.title} • PUT /assessments/{jobId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/assessments"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Back
              </Link>
              <Link
                to={`/assessments/${jobId}/take`}
                className="px-3 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors"
              >
                Preview
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Settings */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-impact font-black uppercase text-primary-500 leading-tight tracking-tight mb-4">Assessment Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={assessment?.title || ''}
                    onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={assessment?.timeLimit || ''}
                    onChange={(e) => setAssessment(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
                    Description
                  </label>
                  <textarea
                    value={assessment?.description || ''}
                    onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assessment?.passingScore || ''}
                    onChange={(e) => setAssessment(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-impact font-black uppercase text-primary-500 leading-tight tracking-tight">
                  Questions ({assessment?.questions?.length || 0})
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addQuestion('multiple_choice')}
                    className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => addQuestion('text')}
                    className="px-3 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                  >
                    + Text Response
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {assessment?.questions?.map((question, index) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={(updates) => updateQuestion(question.id, updates)}
                    onDelete={() => deleteQuestion(question.id)}
                  />
                ))}
                
                {(!assessment?.questions || assessment.questions.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">❓</div>
                    <h3 className="text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">No questions yet</h3>
                    <p className="text-gray-500 mb-4">Add questions to start building your assessment.</p>
                    <div className="space-x-2">
                      <button
                        onClick={() => addQuestion('multiple_choice')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add Multiple Choice
                      </button>
                      <button
                        onClick={() => addQuestion('text')}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                      >
                        Add Text Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-impact font-black uppercase text-primary-500 leading-tight tracking-tight mb-4">Assessment Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium">{assessment?.questions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-medium">
                    {assessment?.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium">{assessment?.timeLimit || 'No limit'} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="font-medium">{assessment?.passingScore || 70}%</span>
                </div>
              </div>
            </div>

            {/* Question Types Help */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-impact font-black uppercase text-primary-500 leading-tight tracking-tight mb-4">Question Types</h3>
              <div className="space-y-3">
                <div className="border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900">Multiple Choice</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Candidates select one correct answer from multiple options. Automatically scored.
                  </p>
                </div>
                <div className="border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-900">Text Response</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Open-ended questions for detailed answers. Requires manual review.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-impact font-black uppercase text-primary-500 leading-tight tracking-tight mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/assessments/${jobId}/take`}
                  className="w-full px-4 py-2 text-center bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors block"
                >
                  Preview Assessment
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Editor Component
const QuestionEditor = ({ question, index, onUpdate, onDelete }) => {
  const updateOption = (optionId, updates) => {
    const newOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOption = {
      id: String.fromCharCode(97 + question.options.length), // a, b, c, d...
      text: `Option ${String.fromCharCode(65 + question.options.length)}`,
      isCorrect: false
    };
    onUpdate({ options: [...question.options, newOption] });
  };

  const removeOption = (optionId) => {
    const newOptions = question.options.filter(opt => opt.id !== optionId);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-impact font-black uppercase text-primary-500 leading-tight tracking-tight">
          Question {index + 1}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
            {question.type}
          </span>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
            Question Title
          </label>
          <input
            type="text"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
              Points
            </label>
            <input
              type="number"
              min="0"
              value={question.points || 0}
              onChange={(e) => onUpdate({ points: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {question.type === 'text' && (
            <div>
              <label className="block text-sm font-impact font-bold uppercase text-primary-500 leading-tight tracking-tight mb-2">
                Max Length
              </label>
              <input
                type="number"
                min="0"
                value={question.maxLength || 500}
                onChange={(e) => onUpdate({ maxLength: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {question.type === 'multiple_choice' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-impact font-black uppercase text-primary-500 leading-tight tracking-tight">
                Answer Options
              </label>
              <button
                onClick={addOption}
                className="px-2 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                + Add Option
              </button>
            </div>
            <div className="space-y-2">
              {question.options?.map((option, optIndex) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={option.isCorrect}
                    onChange={() => {
                      // Set this as correct and others as incorrect
                      const newOptions = question.options.map(opt => ({
                        ...opt,
                        isCorrect: opt.id === option.id
                      }));
                      onUpdate({ options: newOptions });
                    }}
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {question.options.length > 2 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
