/*
 * ASSESSMENT SUBMISSION COMPONENT - AssessmentSubmit.jsx
 *
 * CANDIDATE ASSESSMENT FLOW EXPLANATION:
 * 1) Candidate clicks "Take Assessment" button from job listing
 * 2) Navigate to /assessments/:jobId/submit route
 * 3) Component loads assessment data from database using jobId
 * 4) Display assessment questions with different input types
 * 5) Candidate fills out responses and submits
 * 6) Responses are saved to database and candidate is redirected
 *
 * DATA FLOW:
 * - jobId comes from URL parameters (from job they're applying to)
 * - Assessment data fetched from IndexedDB using jobId
 * - Candidate responses stored locally in component state
 * - On submit: responses saved to assessmentResponses table
 * - Success message shown, then redirect to candidate jobs page
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../lib/database.js";
import { assessmentsAPI } from "../../lib/api/indexedDBClient";

const AssessmentSubmit = () => {
  // Get jobId from URL parameters - this tells us which assessment to load
  const { jobId } = useParams();
  const navigate = useNavigate();

  // COMPONENT STATE MANAGEMENT:
  // assessment: The assessment data loaded from database
  // responses: Object storing candidate's answers (questionId: answer)
  // loading: Shows loading spinner while fetching assessment
  // submitting: Shows "Submitting..." text during form submission
  // error: Displays error messages if something goes wrong
  // success: Shows success message after successful submission
  const [assessment, setAssessment] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ASSESSMENT LOADING FLOW:
  // Step 1: When component mounts, load assessment data for the specific jobId
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);

        // Step 2: Try to get assessment from database first
        // Look up assessment by jobId in the assessments table
        const assessmentData = await db.assessments
          .where("jobId")
          .equals(parseInt(jobId))
          .first();

        if (assessmentData) {
          // Step 3a: Assessment found in database, use it
          setAssessment(assessmentData);
        } else {
          // Step 3b: No assessment found, create mock assessment for testing
          // This ensures the component works even without pre-created assessments
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
        // Step 4: Handle any errors during assessment loading
        console.error("Error loading assessment:", error);
        setError("Failed to load assessment");
      } finally {
        // Step 5: Always stop loading spinner
        setLoading(false);
      }
    };

    loadAssessment();
  }, [jobId]); // Re-run when jobId changes

  // RESPONSE HANDLING FUNCTION:
  // Called when candidate selects/changes an answer to any question
  // Updates the responses state object with the new answer
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value, // Store answer with questionId as key
    }));
  };

  // ASSESSMENT SUBMISSION FLOW:
  // Step 1: Candidate clicks "Submit Assessment" button
  // Step 2: Validate responses and prepare submission data
  // Step 3: Save responses to database
  // Step 4: Show success message and redirect
  const handleSubmit = async () => {
    try {
      // Step 1: Start submission process
      setSubmitting(true);
      setError(null);

      // Step 2: Create candidate ID (in real app, this would come from authentication)
      // For now, using mock candidate ID = 1
      const candidateId = 1;

      // Step 3: Prepare submission data object
      const submissionData = {
        candidateId: candidateId,
        responses: responses, // All candidate's answers
        startedAt: new Date().toISOString(),
        timeTaken: 0, // Could be calculated based on start time
      };

      // Step 4: Submit to API (using IndexedDB directly instead of MSW)
      // MSW API commented out - using IndexedDB directly for persistence
      // const response = await fetch(`/api/assessments/${jobId}/submit`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(submissionData),
      // });
      // if (!response.ok) throw new Error("Failed to submit assessment");
      // const result = await response.json();

      // Step 5: Use IndexedDB directly to save submission
      const result = await assessmentsAPI.submit(jobId, submissionData);
      setSuccess(true);

      // Step 6: Store response in local database for HR to review
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

      // Step 7: Redirect candidate back to jobs page after 3 seconds
      setTimeout(() => {
        navigate("/dashboard/candidate/jobs");
      }, 3000);
    } catch (error) {
      // Handle submission errors
      console.error("Error submitting assessment:", error);
      setError("Failed to submit assessment. Please try again.");
    } finally {
      // Always stop submission loading state
      setSubmitting(false);
    }
  };

  // QUESTION RENDERING FUNCTION:
  // Renders different types of questions based on question.type
  // Handles: single-choice, multi-choice, short-text, long-text, numeric
  const renderQuestion = (question, sectionIndex, questionIndex) => {
    // Get the candidate's current response for this question
    const response = responses[question.id] || "";

    return (
      <div
        key={question.id}
        className="mb-6 p-4 bg-white rounded-lg border border-gray-200"
      >
        {/* Question header with number, title, and required indicator */}
        <h4 className="text-lg font-semibold mb-3">
          {questionIndex + 1}. {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h4>

        {/* SINGLE CHOICE QUESTION TYPE */}
        {/* Renders radio buttons - candidate can select only one option */}
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

        {/* MULTIPLE CHOICE QUESTION TYPE */}
        {/* Renders checkboxes - candidate can select multiple options */}
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
                    // Handle multiple selections by managing an array of selected values
                    const currentAnswers = Array.isArray(response)
                      ? response
                      : [];
                    if (e.target.checked) {
                      // Add option to selected answers
                      handleResponseChange(question.id, [
                        ...currentAnswers,
                        option.value,
                      ]);
                    } else {
                      // Remove option from selected answers
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

        {/* SHORT TEXT QUESTION TYPE */}
        {/* Renders single-line text input */}
        {question.type === "short-text" && (
          <input
            type="text"
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
          />
        )}

        {/* LONG TEXT QUESTION TYPE */}
        {/* Renders multi-line textarea for longer responses */}
        {question.type === "long-text" && (
          <textarea
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter your answer"
          />
        )}

        {/* NUMERIC QUESTION TYPE */}
        {/* Renders number input for numeric answers */}
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

  // LOADING STATE UI:
  // Shows spinner while fetching assessment data from database
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

  // SUCCESS STATE UI:
  // Shows success message after assessment is submitted
  // Automatically redirects to candidate jobs page after 3 seconds
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

  // ERROR STATE UI:
  // Shows error message if assessment could not be found
  // Provides button to go back to jobs page
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

  // MAIN ASSESSMENT UI:
  // Renders the complete assessment form with questions and submit button
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* ASSESSMENT HEADER SECTION */}
        {/* Shows assessment title and description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {assessment.title}
          </h1>
          <p className="text-gray-600">{assessment.description}</p>
        </div>

        {/* QUESTIONS SECTION */}
        {/* Renders all assessment sections and their questions */}
        <div className="space-y-6">
          {assessment.sections?.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {/* Render each question in this section */}
                {section.questions?.map((question, questionIndex) =>
                  renderQuestion(question, sectionIndex, questionIndex)
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {/* Shows any submission errors to the candidate */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* SUBMIT BUTTON SECTION */}
        {/* Button to submit the completed assessment */}
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
