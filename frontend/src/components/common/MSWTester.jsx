import React, { useState, useEffect } from "react";
import {
  apiClient,
  jobsAPI,
  candidatesAPI,
  assessmentsAPI,
} from "../../mocks/apiClient";

const MSWTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const setTestResult = (testName, result) => {
    setResults((prev) => ({ ...prev, [testName]: result }));
    setLoading((prev) => ({ ...prev, [testName]: false }));
    setError((prev) => ({ ...prev, [testName]: null }));
  };

  const setTestError = (testName, err) => {
    setError((prev) => ({ ...prev, [testName]: err.message }));
    setLoading((prev) => ({ ...prev, [testName]: false }));
  };

  const setTestLoading = (testName) => {
    setLoading((prev) => ({ ...prev, [testName]: true }));
    setError((prev) => ({ ...prev, [testName]: null }));
  };

  const runTest = async (testName, testFunction) => {
    setTestLoading(testName);
    try {
      const result = await testFunction();
      setTestResult(testName, result);
    } catch (err) {
      setTestError(testName, err);
    }
  };

  const TestSection = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const TestButton = ({ testName, label, onClick, variant = "primary" }) => {
    const isLoading = loading[testName];
    const hasError = error[testName];
    const hasResult = results[testName];

    const getButtonClass = () => {
      if (hasError) return "bg-red-500 hover:bg-red-600 text-white";
      if (hasResult) return "bg-green-500 hover:bg-green-600 text-white";
      if (variant === "secondary")
        return "bg-gray-500 hover:bg-gray-600 text-white";
      return "bg-blue-500 hover:bg-blue-600 text-white";
    };

    return (
      <div className="space-y-2">
        <button
          onClick={() => runTest(testName, onClick)}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded transition-colors ${getButtonClass()} ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Loading..." : label}
        </button>

        {hasError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            ❌ {hasError}
          </div>
        )}

        {hasResult && !hasError && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            ✅ Success
            {results[testName]?.data && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">
                  View Response
                </summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                  {JSON.stringify(results[testName], null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MSW API Tester
          </h1>
          <p className="text-gray-600">
            Test all Mock Service Worker endpoints
          </p>
        </div>

        {/* Jobs API Tests */}
        <TestSection title="Jobs API">
          <TestButton
            testName="getJobs"
            label="GET /jobs"
            onClick={() => jobsAPI.getAll({ page: 1, pageSize: 5 })}
          />

          <TestButton
            testName="createJob"
            label="POST /jobs"
            onClick={() =>
              jobsAPI.create({
                title: "Senior React Developer",
                status: "active",
                tags: ["React", "JavaScript", "TypeScript"],
                description: "Looking for an experienced React developer...",
              })
            }
          />

          <TestButton
            testName="updateJob"
            label="PATCH /jobs/1"
            onClick={() =>
              jobsAPI.update(1, {
                title: "Updated Job Title",
                status: "archived",
              })
            }
          />

          <TestButton
            testName="reorderJob"
            label="PATCH /jobs/1/reorder"
            onClick={() => jobsAPI.reorder(1, 1, 3)}
            variant="secondary"
          />

          <TestButton
            testName="getJobById"
            label="GET /jobs/1"
            onClick={() => jobsAPI.getById(1)}
          />

          <TestButton
            testName="searchJobs"
            label="Search Jobs"
            onClick={() =>
              jobsAPI.getAll({
                search: "developer",
                status: "active",
                sort: "title",
              })
            }
          />
        </TestSection>

        {/* Candidates API Tests */}
        <TestSection title="Candidates API">
          <TestButton
            testName="getCandidates"
            label="GET /candidates"
            onClick={() => candidatesAPI.getAll({ page: 1, pageSize: 5 })}
          />

          <TestButton
            testName="createCandidate"
            label="POST /candidates"
            onClick={() =>
              candidatesAPI.create({
                name: "John Doe",
                email: "john.doe.test@example.com",
                stage: "applied",
                jobId: 1,
                profile: {
                  skills: ["React", "Node.js"],
                  experience: 3,
                },
              })
            }
          />

          <TestButton
            testName="updateCandidate"
            label="PATCH /candidates/1"
            onClick={() =>
              candidatesAPI.update(1, {
                stage: "screen",
                notes: "Moved to screening stage",
              })
            }
          />

          <TestButton
            testName="getCandidateTimeline"
            label="GET /candidates/1/timeline"
            onClick={() => candidatesAPI.getTimeline(1)}
          />

          <TestButton
            testName="getCandidateById"
            label="GET /candidates/1"
            onClick={() => candidatesAPI.getById(1)}
          />

          <TestButton
            testName="filterCandidates"
            label="Filter Candidates"
            onClick={() =>
              candidatesAPI.getAll({
                stage: "applied",
                search: "developer",
              })
            }
          />
        </TestSection>

        {/* Assessments API Tests */}
        <TestSection title="Assessments API">
          <TestButton
            testName="getAssessment"
            label="GET /assessments/1"
            onClick={() => assessmentsAPI.get(1)}
          />

          <TestButton
            testName="saveAssessment"
            label="PUT /assessments/1"
            onClick={() =>
              assessmentsAPI.save(1, {
                title: "React Developer Assessment",
                description: "Technical assessment for React developers",
                timeLimit: 60,
                passingScore: 75,
                questions: [
                  {
                    id: "q1",
                    type: "multiple_choice",
                    title: "What is React?",
                    options: [
                      {
                        id: "a",
                        text: "A JavaScript library",
                        isCorrect: true,
                      },
                      { id: "b", text: "A database", isCorrect: false },
                      { id: "c", text: "A CSS framework", isCorrect: false },
                    ],
                    points: 5,
                  },
                  {
                    id: "q2",
                    type: "text",
                    title: "Explain React hooks",
                    maxLength: 500,
                    points: 10,
                  },
                ],
              })
            }
          />

          <TestButton
            testName="submitAssessment"
            label="POST /assessments/1/submit"
            onClick={() =>
              assessmentsAPI.submit(1, {
                candidateId: 1,
                responses: {
                  q1: "a",
                  q2: "React hooks are functions that let you use state and other React features...",
                },
                startedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                timeTaken: 1800, // 30 minutes in seconds
              })
            }
          />

          <TestButton
            testName="getAssessmentResponses"
            label="GET /assessments/1/responses"
            onClick={() => assessmentsAPI.getResponses(1)}
          />

          <TestButton
            testName="getAssessmentResponsesForCandidate"
            label="GET /assessments/1/responses?candidateId=1"
            onClick={() => assessmentsAPI.getResponses(1, 1)}
          />
        </TestSection>

        {/* Bulk Operations */}
        <TestSection title="Bulk Operations & Error Testing">
          <TestButton
            testName="testReorderError"
            label="Test Reorder Error (500)"
            onClick={async () => {
              // Try multiple times to trigger the 10% error rate
              for (let i = 0; i < 10; i++) {
                try {
                  await jobsAPI.reorder(1, 1, 2);
                } catch (error) {
                  if (error.message.includes("Internal server error")) {
                    throw error; // This is the expected error
                  }
                }
              }
              return { message: "No error occurred in 10 attempts" };
            }}
            variant="secondary"
          />

          <TestButton
            testName="testValidationError"
            label="Test Validation Error"
            onClick={() => jobsAPI.create({})} // Missing required title
            variant="secondary"
          />

          <TestButton
            testName="testNotFound"
            label="Test Not Found Error"
            onClick={() => jobsAPI.getById(999)}
            variant="secondary"
          />

          <TestButton
            testName="runAllBasicTests"
            label="Run All Basic Tests"
            onClick={async () => {
              const tests = [
                () => jobsAPI.getAll(),
                () => candidatesAPI.getAll(),
                () => assessmentsAPI.get(1),
              ];

              const results = await Promise.allSettled(
                tests.map((test) => test())
              );
              const successful = results.filter(
                (r) => r.status === "fulfilled"
              ).length;

              return {
                message: `${successful}/${tests.length} tests passed`,
                results: results.map((r) => r.status),
              };
            }}
          />
        </TestSection>
      </div>
    </div>
  );
};

export default MSWTester;
