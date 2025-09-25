import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Save, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { STORAGE_KEYS } from "../data/assessmentsData";

// Simple Live Preview Component
const LivePreview = ({ assessment }) => {
  const [answers, setAnswers] = useState({});

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const renderQuestion = (question, index) => {
    const answer = answers[question.id] || "";

    return (
      <div key={question.id} className="mb-6 p-4 bg-white rounded-lg border">
        <h4 className="text-lg font-semibold mb-3">
          {index + 1}. {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h4>

        {/* Single Choice */}
        {question.type === "single-choice" && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 cursor-pointer p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple Choice */}
        {question.type === "multi-choice" && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 cursor-pointer p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={
                    Array.isArray(answer) && answer.includes(option.value)
                  }
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    if (e.target.checked) {
                      updateAnswer(question.id, [
                        ...currentAnswers,
                        option.value,
                      ]);
                    } else {
                      updateAnswer(
                        question.id,
                        currentAnswers.filter((v) => v !== option.value)
                      );
                    }
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!assessment || !assessment.sections || assessment.sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">No assessment created yet</p>
          <p className="text-sm">
            Start building on the left to see preview here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{assessment.title}</h2>
        {assessment.description && (
          <p className="text-gray-600 mb-6">{assessment.description}</p>
        )}

        {assessment.sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}

            <div className="space-y-4">
              {section.questions.map((question, questionIndex) =>
                renderQuestion(question, questionIndex)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AssessmentBuilder = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  // Load assessment from localStorage or create new one
  useEffect(() => {
    const savedAssessments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || "{}"
    );
    const assessmentKey = `job-${jobId}`;

    if (savedAssessments[assessmentKey]) {
      setAssessment(savedAssessments[assessmentKey]);
    } else {
      const newAssessment = {
        id: `assessment-${jobId}-${Date.now()}`,
        jobId,
        title: "New Assessment",
        description: "",
        sections: [],
      };
      setAssessment(newAssessment);
    }
  }, [jobId]);

  // Auto-save assessment
  useEffect(() => {
    if (assessment) {
      const savedAssessments = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || "{}"
      );
      savedAssessments[`job-${jobId}`] = assessment;
      localStorage.setItem(
        STORAGE_KEYS.ASSESSMENTS,
        JSON.stringify(savedAssessments)
      );
    }
  }, [assessment, jobId]);

  const updateAssessment = (updates) => {
    setAssessment((prev) => ({ ...prev, ...updates }));
  };

  const createNewSection = () => ({
    id: `section-${Date.now()}`,
    title: "New Section",
    description: "",
    questions: [],
  });

  const createNewQuestion = (type, sectionId) => ({
    id: `q-${Date.now()}`,
    type,
    title:
      type === "single-choice"
        ? "Single Choice Question"
        : "Multiple Choice Question",
    required: false,
    options:
      type === "single-choice" || type === "multi-choice"
        ? [
            { id: "opt-1", text: "Option 1", value: "option1" },
            { id: "opt-2", text: "Option 2", value: "option2" },
          ]
        : [],
  });

  const addSection = () => {
    const newSection = createNewSection();
    updateAssessment({
      sections: [...assessment.sections, newSection],
    });
  };

  const updateSection = (sectionId, updates) => {
    updateAssessment({
      sections: assessment.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const deleteSection = (sectionId) => {
    if (window.confirm("Delete this section?")) {
      updateAssessment({
        sections: assessment.sections.filter(
          (section) => section.id !== sectionId
        ),
      });
    }
  };

  const addQuestion = (sectionId, questionType) => {
    const newQuestion = createNewQuestion(questionType, sectionId);
    updateAssessment({
      sections: assessment.sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      ),
    });
  };

  const updateQuestion = (questionId, updates) => {
    updateAssessment({
      sections: assessment.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) =>
          question.id === questionId ? { ...question, ...updates } : question
        ),
      })),
    });
  };

  const deleteQuestion = (questionId) => {
    if (window.confirm("Delete this question?")) {
      updateAssessment({
        sections: assessment.sections.map((section) => ({
          ...section,
          questions: section.questions.filter(
            (question) => question.id !== questionId
          ),
        })),
      });
    }
  };
  console.log("HIII");
  const updateOption = (questionId, optionId, updates) => {
    updateAssessment({
      sections: assessment.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: question.options.map((option) =>
                  option.id === optionId ? { ...option, ...updates } : option
                ),
              }
            : question
        ),
      })),
    });
  };

  const addOption = (questionId) => {
    updateAssessment({
      sections: assessment.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: [
                  ...question.options,
                  {
                    id: `opt-${Date.now()}`,
                    text: `Option ${question.options.length + 1}`,
                    value: `option${question.options.length + 1}`,
                  },
                ],
              }
            : question
        ),
      })),
    });
  };

  const removeOption = (questionId, optionId) => {
    updateAssessment({
      sections: assessment.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: question.options.filter(
                  (option) => option.id !== optionId
                ),
              }
            : question
        ),
      })),
    });
  };

  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Assessment Builder
          </h1>
          <button
            onClick={() => navigate(`/dashboard/employer/${jobId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save & Exit
          </button>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex h-[calc(100vh-81px)]">
        {/* Left Panel - Builder */}
        <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6">
            {/* Assessment Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Title
              </label>
              <input
                type="text"
                value={assessment.title}
                onChange={(e) => updateAssessment({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assessment title"
              />
            </div>

            {/* Assessment Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={assessment.description}
                onChange={(e) =>
                  updateAssessment({ description: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assessment description"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {assessment.sections.map((section, sectionIndex) => {
                const isCollapsed = collapsedSections.has(section.id);

                return (
                  <div
                    key={section.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    {/* Section Header */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleSectionCollapse(section.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {isCollapsed ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronUp className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              updateSection(section.id, {
                                title: e.target.value,
                              })
                            }
                            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                            placeholder="Section title"
                          />
                        </div>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {!isCollapsed && (
                        <div className="mt-3">
                          <textarea
                            value={section.description}
                            onChange={(e) =>
                              updateSection(section.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Section description (optional)"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                          />
                        </div>
                      )}
                    </div>

                    {/* Section Content */}
                    {!isCollapsed && (
                      <div className="p-4">
                        {/* Questions */}
                        <div className="space-y-4 mb-4">
                          {section.questions.map((question, questionIndex) => (
                            <div
                              key={question.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <input
                                  type="text"
                                  value={question.title}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      title: e.target.value,
                                    })
                                  }
                                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                                  placeholder="Question title"
                                />
                                <button
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Options */}
                              {(question.type === "single-choice" ||
                                question.type === "multi-choice") && (
                                <div className="space-y-2">
                                  {question.options?.map(
                                    (option, optionIndex) => (
                                      <div
                                        key={option.id}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="text"
                                          value={option.text}
                                          onChange={(e) =>
                                            updateOption(
                                              question.id,
                                              option.id,
                                              { text: e.target.value }
                                            )
                                          }
                                          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder={`Option ${
                                            optionIndex + 1
                                          }`}
                                        />
                                        {question.options.length > 2 && (
                                          <button
                                            onClick={() =>
                                              removeOption(
                                                question.id,
                                                option.id
                                              )
                                            }
                                            className="text-gray-500 hover:text-red-600"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    )
                                  )}
                                  <button
                                    onClick={() => addOption(question.id)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    + Add Option
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Question Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              addQuestion(section.id, "single-choice")
                            }
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                            Single Choice
                          </button>
                          <button
                            onClick={() =>
                              addQuestion(section.id, "multi-choice")
                            }
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                            Multiple Choice
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Section Button */}
              <button
                onClick={addSection}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600"
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 bg-gray-50">
          <LivePreview assessment={assessment} />
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;
