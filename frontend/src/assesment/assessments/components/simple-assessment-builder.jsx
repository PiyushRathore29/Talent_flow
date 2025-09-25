import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Save,
  Trash2,
  Type,
  Hash,
  CheckSquare,
  Circle,
} from "lucide-react";
import { db } from "../../../lib/database.js";

const SimpleAssessmentBuilder = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState({
    title: "Untitled Assessment",
    description: "",
    sections: [
      {
        id: "section-1",
        title: "New Section",
        description: "",
        questions: [],
      },
    ],
  });

  const [previewResponses, setPreviewResponses] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [existingAssessmentId, setExistingAssessmentId] = useState(null);

  // Load existing assessment for this job
  useEffect(() => {
    const loadExistingAssessment = async () => {
      try {
        const existingAssessment = await db.assessments
          .where("jobId")
          .equals(parseInt(jobId))
          .first();

        if (existingAssessment) {
          setAssessment({
            title: existingAssessment.title,
            description: existingAssessment.description,
            sections: existingAssessment.sections || [
              {
                id: "section-1",
                title: "New Section",
                description: "",
                questions: [],
              },
            ],
          });
          setIsEditing(true);
          setExistingAssessmentId(existingAssessment.id);
          console.log("📝 Loaded existing assessment:", existingAssessment);
        }
      } catch (error) {
        console.error("❌ Error loading existing assessment:", error);
      }
    };

    if (jobId) {
      loadExistingAssessment();
    }
  }, [jobId]);

  // Question type buttons configuration
  const questionTypes = [
    {
      id: "short-text",
      icon: Type,
      label: "Text",
      description: "Single line text input",
    },
    {
      id: "numeric",
      icon: Hash,
      label: "123 Numeric",
      description: "Number input",
    },
    {
      id: "single-choice",
      icon: Circle,
      label: "Single Choice",
      description: "Select one option",
    },
    {
      id: "multi-choice",
      icon: CheckSquare,
      label: "Multiple Choice",
      description: "Select multiple options",
    },
  ];

  const addQuestion = (type, sectionIndex = 0) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type,
      title: "",
      description: "",
      required: false,
      options:
        type === "single-choice" || type === "multi-choice"
          ? [
              { id: "opt1", text: "Option 1", value: "option1" },
              { id: "opt2", text: "Option 2", value: "option2" },
            ]
          : undefined,
      validation: {},
    };

    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section, idx) =>
        idx === sectionIndex
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      ),
    }));
  };

  const updateQuestion = (questionId, updates) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      })),
    }));
  };

  const deleteQuestion = (questionId) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.filter((q) => q.id !== questionId),
      })),
    }));
  };

  const updateOption = (questionId, optionId, updates) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((opt) =>
                  opt.id === optionId ? { ...opt, ...updates } : opt
                ),
              }
            : q
        ),
      })),
    }));
  };

  const addOption = (questionId) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: [
                  ...q.options,
                  {
                    id: `opt-${Date.now()}`,
                    text: `Option ${q.options.length + 1}`,
                    value: `option${q.options.length + 1}`,
                  },
                ],
              }
            : q
        ),
      })),
    }));
  };

  const removeOption = (questionId, optionId) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.filter((opt) => opt.id !== optionId),
              }
            : q
        ),
      })),
    }));
  };

  const handleSave = async () => {
    try {
      const assessmentData = {
        jobId: parseInt(jobId),
        title: assessment.title,
        description: assessment.description,
        sections: assessment.sections,
        settings: {
          timeLimit: null,
          allowBackNavigation: true,
          randomizeQuestions: false,
          showProgressBar: true,
        },
        status: "active",
        updatedAt: new Date(),
      };

      if (isEditing && existingAssessmentId) {
        // Update existing assessment
        await db.assessments.update(existingAssessmentId, assessmentData);
        console.log("✅ Assessment updated successfully");
      } else {
        // Create new assessment
        assessmentData.createdAt = new Date();
        await db.assessments.add(assessmentData);
        console.log("✅ Assessment created successfully");
      }

      // Navigate back to jobs page
      navigate("/jobs");
    } catch (error) {
      console.error("❌ Error saving assessment:", error);
      alert("Failed to save assessment: " + error.message);
    }
  };

  // ➕ Add new section
  const addSection = () => {
    setAssessment((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `section-${Date.now()}`,
          title: "New Section",
          description: "",
          questions: [],
        },
      ],
    }));
  };

  const renderQuestion = (question, index) => {
    return (
      <div
        key={question.id}
        className="mb-6 p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-3">
          <input
            type="text"
            value={question.title}
            onChange={(e) =>
              updateQuestion(question.id, { title: e.target.value })
            }
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
            placeholder="Question title"
          />
          <button
            onClick={() => deleteQuestion(question.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Options for choice questions */}
        {(question.type === "single-choice" ||
          question.type === "multi-choice") && (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    updateOption(question.id, option.id, {
                      text: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Option ${optionIndex + 1}`}
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(question.id, option.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addOption(question.id)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add Option
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPreviewQuestion = (question, index) => {
    const answer = previewResponses[question.id] || "";

    return (
      <div
        key={question.id}
        className="mb-6 p-4 bg-white rounded-lg border border-gray-200"
      >
        <h4 className="text-lg font-semibold mb-3">
          {index + 1}. {question.title || "Untitled Question"}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h4>

        {/* Single Choice */}
        {question.type === "single-choice" && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={(e) =>
                    setPreviewResponses((prev) => ({
                      ...prev,
                      [question.id]: e.target.value,
                    }))
                  }
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
                className="flex items-center space-x-3 cursor-pointer"
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
                      setPreviewResponses((prev) => ({
                        ...prev,
                        [question.id]: [...currentAnswers, option.value],
                      }));
                    } else {
                      setPreviewResponses((prev) => ({
                        ...prev,
                        [question.id]: currentAnswers.filter(
                          (v) => v !== option.value
                        ),
                      }));
                    }
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* Text Input */}
        {question.type === "short-text" && (
          <input
            type="text"
            value={answer}
            onChange={(e) =>
              setPreviewResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
          />
        )}

        {/* Numeric Input */}
        {question.type === "numeric" && (
          <input
            type="number"
            value={answer}
            onChange={(e) =>
              setPreviewResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a number"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Assessment" : "Assessment Builder"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Editing existing assessment"
                : "Creating new assessment"}{" "}
              for Job ID: {jobId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/jobs")}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Jobs
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              {isEditing ? "Update Assessment" : "Save Assessment"}
            </button>
          </div>
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
                onChange={(e) =>
                  setAssessment((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assessment title"
              />
            </div>

            {/* Sections */}
            {assessment.sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg mb-4"
              >
                {/* Section Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        setAssessment((prev) => ({
                          ...prev,
                          sections: prev.sections.map((s, idx) =>
                            idx === sectionIndex
                              ? { ...s, title: e.target.value }
                              : s
                          ),
                        }))
                      }
                      className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                      placeholder="Section title"
                    />
                    <button className="text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-4">
                  {/* Questions */}
                  <div className="space-y-4 mb-4">
                    {section.questions.map((question, index) =>
                      renderQuestion(question, index)
                    )}
                  </div>

                  {/* Add Question Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {questionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => addQuestion(type.id, sectionIndex)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Section Button */}
            <button
              onClick={addSection}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 mt-4"
            >
              <Plus className="w-5 h-5 mx-auto mb-1" />
              Add New Section
            </button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Live Preview</h2>

            {assessment.sections.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">No sections yet</p>
                <p className="text-sm">
                  Start building on the left to see preview here
                </p>
              </div>
            ) : (
              assessment.sections.map((section, sectionIndex) => (
                <div key={section.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.questions.map((question, index) =>
                      renderPreviewQuestion(question, index)
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAssessmentBuilder;
