import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../lib/database.js";

const AssessmentSubmit = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load assessment data
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);

        // Try to get assessment from database first
        const assessmentData = await db.assessments
          .where("jobId")
          .equals(parseInt(jobId))
          .first();

        if (assessmentData) {
          setAssessment(assessmentData);
        } else {
          // If not found in database, create a simple mock assessment for testing
          setAssessment({
            id: parseInt(jobId),
            jobId: parseInt(jobId),
            title: `Assessment for Job ${jobId}`,
            description: "Please complete this assessment",
            sections: [
              {
                id: "section-1",
                title: "General Questions",
                questions: [
                  {
                    id: "q1",
                    type: "single-choice",
                    title: "How many years of experience do you have?",
                    required: true,
                    options: [
                      { id: "opt1", text: "0-1 years", value: "0-1" },
                      { id: "opt2", text: "2-3 years", value: "2-3" },
                      { id: "opt3", text: "4-5 years", value: "4-5" },
                      { id: "opt4", text: "5+ years", value: "5+" },
                    ],
                  },
                  {
                    id: "q2",
                    type: "long-text",
                    title: "Tell us about yourself",
                    required: true,
                  },
                  {
                    id: "q3",
                    type: "numeric",
                    title: "What is your expected salary?",
                    required: false,
                  },
                ],
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error loading assessment:", error);
        setError("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [jobId]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Create a mock candidate ID (in real app, this would come from auth)
      const candidateId = 1;

      const submissionData = {
        candidateId: candidateId,
        responses: responses,
        startedAt: new Date().toISOString(),
        timeTaken: 0, // Could be calculated based on start time
      };

      // Submit to the MSW endpoint
      const response = await fetch(`/api/assessments/${jobId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);

        // Store response locally in database as well
        await db.assessmentResponses.add({
          assessmentId: parseInt(jobId),
          candidateId: candidateId,
          responses: responses,
          submittedAt: new Date(),
          score: result.data?.score || 0,
          passed: result.data?.passed || false,
          timeTaken: submissionData.timeTaken,
          isCompleted: true,
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/dashboard/candidate/jobs");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit assessment");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError("Failed to submit assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, sectionIndex, questionIndex) => {
    const response = responses[question.id] || "";

    return (
      <div
        key={question.id}
        className="mb-6 p-4 bg-white rounded-lg border border-gray-200"
      >
        <h4 className="text-lg font-semibold mb-3">
          {questionIndex + 1}. {question.title}
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
                  checked={response === option.value}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
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
                    Array.isArray(response) && response.includes(option.value)
                  }
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(response)
                      ? response
                      : [];
                    if (e.target.checked) {
                      handleResponseChange(question.id, [
                        ...currentAnswers,
                        option.value,
                      ]);
                    } else {
                      handleResponseChange(
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

        {/* Text Input */}
        {question.type === "short-text" && (
          <input
            type="text"
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
          />
        )}

        {/* Long Text */}
        {question.type === "long-text" && (
          <textarea
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter your answer"
          />
        )}

        {/* Numeric Input */}
        {question.type === "numeric" && (
          <input
            type="number"
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a number"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment Submitted!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for completing the assessment. You will be redirected
            shortly.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The assessment for job {jobId} could not be found.
          </p>
          <button
            onClick={() => navigate("/dashboard/candidate/jobs")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {assessment.title}
          </h1>
          <p className="text-gray-600">{assessment.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {assessment.sections?.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.questions?.map((question, questionIndex) =>
                  renderQuestion(question, sectionIndex, questionIndex)
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {submitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSubmit;
