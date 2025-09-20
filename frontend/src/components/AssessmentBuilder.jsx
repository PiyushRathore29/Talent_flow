import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Save, 
  Eye, 
  Settings, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';
import { 
  questionTypes, 
  createNewQuestion, 
  createNewSection,
  sampleAssessment,
  STORAGE_KEYS
} from '../data/assessmentsData';
import QuestionEditor from './QuestionEditor';
import AssessmentPreview from './AssessmentPreview';

const AssessmentBuilder = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [isDirty, setIsDirty] = useState(false);

  // Load assessment from localStorage or create new one
  useEffect(() => {
    const savedAssessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '{}');
    const assessmentKey = `job-${jobId}`;
    
    if (savedAssessments[assessmentKey]) {
      setAssessment(savedAssessments[assessmentKey]);
    } else {
      // Create new assessment based on sample
      const newAssessment = {
        ...sampleAssessment,
        id: `assessment-${jobId}-${Date.now()}`,
        jobId,
        title: `Assessment for Job ${jobId}`,
        sections: []
      };
      setAssessment(newAssessment);
    }
  }, [jobId]);

  // Auto-save assessment to localStorage
  useEffect(() => {
    if (assessment && isDirty) {
      const savedAssessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '{}');
      savedAssessments[`job-${jobId}`] = assessment;
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(savedAssessments));
      setIsDirty(false);
    }
  }, [assessment, isDirty, jobId]);

  const updateAssessment = (updates) => {
    setAssessment(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const addSection = () => {
    const newSection = createNewSection();
    updateAssessment({
      sections: [...assessment.sections, newSection]
    });
  };

  const updateSection = (sectionId, updates) => {
    updateAssessment({
      sections: assessment.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  };

  const deleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      updateAssessment({
        sections: assessment.sections.filter(section => section.id !== sectionId)
      });
    }
  };

  const addQuestion = (sectionId, questionType) => {
    const newQuestion = createNewQuestion(questionType, sectionId);
    updateAssessment({
      sections: assessment.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    });
    setSelectedQuestionId(newQuestion.id);
  };

  const updateQuestion = (questionId, updates) => {
    updateAssessment({
      sections: assessment.sections.map(section => ({
        ...section,
        questions: section.questions.map(question =>
          question.id === questionId ? { ...question, ...updates } : question
        )
      }))
    });
  };

  const deleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      updateAssessment({
        sections: assessment.sections.map(section => ({
          ...section,
          questions: section.questions.filter(question => question.id !== questionId)
        }))
      });
      if (selectedQuestionId === questionId) {
        setSelectedQuestionId(null);
      }
    }
  };

  const duplicateQuestion = (questionId) => {
    const sourceQuestion = assessment.sections
      .flatMap(s => s.questions)
      .find(q => q.id === questionId);
    
    if (sourceQuestion) {
      const duplicatedQuestion = {
        ...sourceQuestion,
        id: `q-${Date.now()}`,
        title: `${sourceQuestion.title} (Copy)`
      };
      
      updateAssessment({
        sections: assessment.sections.map(section =>
          section.questions.some(q => q.id === questionId)
            ? { ...section, questions: [...section.questions, duplicatedQuestion] }
            : section
        )
      });
    }
  };

  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getSelectedQuestion = () => {
    if (!selectedQuestionId) return null;
    return assessment.sections
      .flatMap(s => s.questions)
      .find(q => q.id === selectedQuestionId);
  };

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading assessment builder...</p>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <AssessmentPreview 
        assessment={assessment} 
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Builder</h1>
            <p className="text-gray-600">Job ID: {jobId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => navigate(`/dashboard/employer/${jobId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Save className="w-4 h-4" />
              Save & Exit
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-81px)]">
        {/* Left Panel - Assessment Structure */}
        <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Title
              </label>
              <input
                type="text"
                value={assessment.title}
                onChange={(e) => updateAssessment({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={assessment.description}
                onChange={(e) => updateAssessment({ description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {assessment.sections.map((section, sectionIndex) => {
                const isCollapsed = collapsedSections.has(section.id);
                
                return (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleSectionCollapse(section.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </button>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                            placeholder="Section title"
                          />
                        </div>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {!isCollapsed && (
                        <textarea
                          value={section.description}
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          placeholder="Section description (optional)"
                          className="w-full mt-2 px-0 py-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
                          rows="1"
                        />
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="p-4">
                        {/* Questions */}
                        {section.questions.map((question, questionIndex) => (
                          <div
                            key={question.id}
                            onClick={() => setSelectedQuestionId(question.id)}
                            className={`mb-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedQuestionId === question.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-sm text-gray-500">
                                  {questionTypes.find(t => t.id === question.type)?.icon}
                                </span>
                                <span className="font-medium">
                                  {question.title || 'Untitled Question'}
                                </span>
                                {question.required && (
                                  <span className="text-red-500 text-sm">*</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateQuestion(question.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteQuestion(question.id);
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Question Buttons */}
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Add Question:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {questionTypes.map(type => (
                              <button
                                key={type.id}
                                onClick={() => addQuestion(section.id, type.id)}
                                className="flex items-center gap-2 p-2 text-sm border border-gray-200 rounded hover:border-primary-300 hover:bg-primary-50"
                              >
                                <span>{type.icon}</span>
                                <span>{type.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Section Button */}
              <button
                onClick={addSection}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50"
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Question Editor */}
        <div className="w-1/2 bg-white overflow-y-auto">
          {selectedQuestionId ? (
            <QuestionEditor
              question={getSelectedQuestion()}
              allQuestions={assessment.sections.flatMap(s => s.questions)}
              onUpdate={(updates) => updateQuestion(selectedQuestionId, updates)}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a question to edit its settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;