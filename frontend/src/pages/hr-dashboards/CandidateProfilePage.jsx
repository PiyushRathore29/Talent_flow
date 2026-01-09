import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  User,
  Clock,
  MapPin,
  Edit3,
  ExternalLink,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import Timeline from "../../components/dashboard/Timeline";
import NotesModal from "../../components/modals/NotesModal";
import NotesSection from "../../components/common/NotesSection";
import { dbHelpers } from "../../lib/database";
import { getAssessmentByJobId } from "../../data/assessmentsData";
import { useAppStore } from "../../lib/store";

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const location = useLocation();
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [assessmentSent, setAssessmentSent] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [sendingAssessment, setSendingAssessment] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesKey, setNotesKey] = useState(0); // Force re-render of NotesSection
  const [referrerContext, setReferrerContext] = useState(null);

  const { saveAssessmentResponse } = useAppStore();

  // Detect referrer context on component mount
  useEffect(() => {
    // Check if we have a referrer URL in sessionStorage or URL parameters
    const urlParams = new URLSearchParams(location.search);
    const jobIdParam = urlParams.get("jobId");

    // Check sessionStorage for referrer context
    const storedReferrer = sessionStorage.getItem("candidateReferrer");

    if (jobIdParam) {
      // If jobId is in URL params, user came from job-specific candidates page
      setReferrerContext({ type: "job", jobId: jobIdParam });
    } else if (storedReferrer) {
      // Use stored referrer context
      try {
        setReferrerContext(JSON.parse(storedReferrer));
      } catch (e) {
        setReferrerContext(null);
      }
    } else {
      // Default to general candidates page
      setReferrerContext({ type: "general" });
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);

        // Fetch candidate details from IndexedDB
        console.log(
          "🔍 Fetching candidate from IndexedDB with ID:",
          candidateId
        );
        const candidateData = await dbHelpers.getCandidateById(
          parseInt(candidateId)
        );

        if (!candidateData) {
          throw new Error("Candidate not found");
        }

        console.log("👤 Found candidate:", candidateData);
        setCandidate(candidateData);

        // Fetch job details from IndexedDB
        if (candidateData.jobId) {
          console.log("💼 Fetching job with ID:", candidateData.jobId);
          const jobData = await dbHelpers.getJobById(candidateData.jobId);

          if (jobData) {
            console.log("💼 Found job:", jobData);
            setJob(jobData);

            // Load job-specific assessment from IndexedDB
            console.log(
              "🔍 Looking for assessment for jobId:",
              candidateData.jobId
            );

            try {
              // First try to get assessment from IndexedDB
              const dbAssessment = await dbHelpers.getAssessmentsByJob(
                candidateData.jobId
              );
              console.log("📝 Found assessments in DB:", dbAssessment);

              let jobAssessment = null;

              if (dbAssessment && dbAssessment.length > 0) {
                // Use the first assessment found for this job
                jobAssessment = dbAssessment[0];
                console.log(
                  "✅ Using assessment from IndexedDB:",
                  jobAssessment
                );
              } else {
                // Fallback to static data if no assessment in DB
                jobAssessment = getAssessmentByJobId(candidateData.jobId);
                console.log("📝 Using static assessment data:", jobAssessment);
              }

              if (jobAssessment) {
                setAssessment(jobAssessment);
                console.log("✅ Assessment set successfully");

                // Check if assessment has been completed by this candidate
                try {
                  const existingResponses = await useAppStore
                    .getState()
                    .getAssessmentResponses(jobAssessment.id, candidateId);
                  if (
                    existingResponses &&
                    Object.keys(existingResponses).length > 0
                  ) {
                    setAssessmentCompleted(true);
                  }
                } catch (error) {
                  console.log("📝 No existing responses found");
                }
              } else {
                console.log(
                  "❌ No assessment found for jobId:",
                  candidateData.jobId
                );
              }
            } catch (error) {
              console.error("❌ Error loading assessment:", error);
              // Fallback to static data
              const jobAssessment = getAssessmentByJobId(candidateData.jobId);
              if (jobAssessment) {
                setAssessment(jobAssessment);
                console.log("✅ Using fallback static assessment");
              }
            }
          } else {
            console.log("❌ Job not found with ID:", candidateData.jobId);
          }
        }

        // Fetch timeline entries for this candidate from IndexedDB
        console.log("📅 Fetching timeline for candidate:", candidateId);
        const timelineData = await dbHelpers.getTimelineEntries(
          parseInt(candidateId)
        );
        console.log("📅 Found timeline entries:", timelineData);
        setTimelineEntries(timelineData);
      } catch (err) {
        console.error("❌ Error fetching candidate data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateData();
    }
  }, [candidateId]);

  const getStageInfo = (stage) => {
    const stageMap = {
      applied: {
        name: "Applied",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      },
      screen: {
        name: "Screening",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      },
      tech: {
        name: "Technical",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      },
      offer: {
        name: "Offer",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      },
      hired: {
        name: "Hired",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      },
      rejected: {
        name: "Rejected",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      },
    };
    return (
      stageMap[stage] || {
        name: stage,
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      }
    );
  };

  // Generate realistic automated responses based on question type and job
  const generateAutomatedResponse = (question, jobTitle) => {
    const jobType = jobTitle?.toLowerCase() || "";
    console.log(
      "🤖 Generating response for question:",
      question.title,
      "Type:",
      question.type
    );

    switch (question.type) {
      case "single-choice":
        // Return a realistic choice based on the question
        if (question.options && question.options.length > 0) {
          // For technical questions, prefer correct answers
          if (
            question.title.toLowerCase().includes("react") &&
            question.options.some((opt) =>
              opt.text?.toLowerCase().includes("useeffect")
            )
          ) {
            return (
              question.options.find((opt) =>
                opt.text?.toLowerCase().includes("useeffect")
              )?.value || question.options[1].value
            );
          }
          // For other questions, return a random but reasonable choice
          const randomIndex = Math.floor(
            Math.random() * question.options.length
          );
          return (
            question.options[randomIndex].value ||
            question.options[randomIndex].text
          );
        }
        return null;

      case "multi-choice":
        if (question.options && question.options.length > 0) {
          // Select 2-3 options randomly
          const numSelections = Math.min(
            Math.floor(Math.random() * 3) + 2,
            question.options.length
          );
          const shuffled = [...question.options].sort(
            () => 0.5 - Math.random()
          );
          return shuffled
            .slice(0, numSelections)
            .map((opt) => opt.value || opt.text);
        }
        return [];

      case "short-text":
        if (jobType.includes("frontend") || jobType.includes("developer")) {
          return "React, JavaScript, TypeScript, HTML, CSS";
        } else if (jobType.includes("product")) {
          return "Agile, Scrum, User Stories, Analytics";
        } else if (jobType.includes("design")) {
          return "Figma, Adobe Creative Suite, User Research";
        }
        return "Professional experience with relevant tools and technologies";

      case "long-text":
        if (
          question.title.toLowerCase().includes("project") ||
          question.title.toLowerCase().includes("challenge")
        ) {
          if (jobType.includes("frontend") || jobType.includes("developer")) {
            return "I worked on a complex e-commerce platform where we needed to optimize performance for mobile users. The main challenge was implementing real-time inventory updates while maintaining fast page load times. I used React with server-side rendering and implemented efficient caching strategies. We reduced load times by 40% and improved conversion rates significantly. The project required close collaboration with backend developers and UX designers to ensure seamless user experience.";
          } else if (jobType.includes("product")) {
            return "I led the development of a new user onboarding flow for our SaaS platform. The challenge was reducing user drop-off during the initial setup process. Through user research and A/B testing, I identified key friction points and redesigned the experience. We implemented progressive disclosure and contextual help features. The result was a 35% increase in onboarding completion rates and improved user activation metrics.";
          }
        }
        return "I have extensive experience working on challenging projects that required innovative solutions and cross-functional collaboration. My approach focuses on understanding user needs, implementing best practices, and measuring success through key metrics.";

      case "numeric":
        if (
          question.title.toLowerCase().includes("years") ||
          question.title.toLowerCase().includes("experience")
        ) {
          return Math.floor(Math.random() * 8) + 3; // 3-10 years experience
        } else if (question.title.toLowerCase().includes("projects")) {
          return Math.floor(Math.random() * 15) + 5; // 5-20 projects
        }
        return Math.floor(Math.random() * 10) + 1;

      case "file-upload":
        // For demo purposes, return a placeholder
        return "portfolio_sample.pdf";

      default:
        return "";
    }
  };

  // Handle sending assessment to candidate
  const handleSendAssessment = async () => {
    if (!candidate || !job || sendingAssessment) return;

    try {
      setSendingAssessment(true);

      // Get job-specific assessment from IndexedDB first, then fallback to static data
      let jobAssessment = null;

      try {
        const dbAssessments = await dbHelpers.getAssessmentsByJob(job.id);
        if (dbAssessments && dbAssessments.length > 0) {
          jobAssessment = dbAssessments[0];
          console.log("✅ Using assessment from IndexedDB:", jobAssessment);
        }
      } catch (error) {
        console.log("📝 No assessment in DB, trying static data");
      }

      // Fallback to static data if no assessment in DB
      if (!jobAssessment) {
        jobAssessment = getAssessmentByJobId(job.id);
        console.log("📝 Using static assessment data:", jobAssessment);
      }

      if (!jobAssessment) {
        alert(`No assessment found for ${job.title} position.`);
        return;
      }

      setAssessment(jobAssessment);
      setAssessmentSent(true);
      console.log("📝 Assessment set for auto-fill:", jobAssessment);

      // Simulate 5-second wait time for candidate attempting the assessment
      setTimeout(async () => {
        try {
          // Generate automated responses for all questions using the fetched assessment
          const responses = {};

          // Use the fetched assessment sections (from database or static)
          const sections = jobAssessment.sections || [];
          console.log(
            "📝 Generating responses for assessment sections:",
            sections
          );

          for (const section of sections) {
            const questions = section.questions || [];
            for (const question of questions) {
              const response = generateAutomatedResponse(question, job.title);
              if (response !== null && response !== undefined) {
                responses[question.id] = response;
              }
            }
          }

          // Save responses to IndexedDB
          await saveAssessmentResponse(
            jobAssessment.id,
            candidateId,
            responses
          );

          setAssessmentCompleted(true);
          setSendingAssessment(false);

          // Update timeline
          const newTimelineEntry = {
            id: `timeline-${Date.now()}-${candidateId}`,
            candidateId: parseInt(candidateId),
            candidateName: candidate.name,
            action: "assessment_completed",
            actionType: "assessment_completed",
            description: `Completed ${jobAssessment.title}`,
            fromStage: candidate.stage || candidate.currentStage,
            toStage: candidate.stage || candidate.currentStage,
            timestamp: new Date().toISOString(),
            hrUserId: 1,
            hrUserName: "Admin User",
            metadata: {
              assessmentId: jobAssessment.id,
              assessmentTitle: jobAssessment.title,
              jobId: job.id,
              jobTitle: job.title,
            },
          };

          setTimelineEntries((prev) => [newTimelineEntry, ...prev]);
        } catch (error) {
          console.error("Failed to complete assessment:", error);
          setSendingAssessment(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Failed to send assessment:", error);
      setSendingAssessment(false);
    }
  };

  // Handle viewing assessment responses
  const handleViewResponses = async () => {
    if (assessment && assessmentCompleted) {
      try {
        // Get the responses from IndexedDB
        const responsesData = await useAppStore
          .getState()
          .getAssessmentResponses(assessment.id, candidateId);

        // Create a simple popup to show the responses
        let responseHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              ${assessment.title} - Responses
            </h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              Candidate: <strong>${candidate.name}</strong>
            </p>
        `;

        // Use the fetched assessment sections (from database or static)
        const sections = assessment.sections || [];
        console.log("📝 Using assessment sections for responses:", sections);

        for (const section of sections) {
          responseHtml += `
            <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px;">${section.title}</h3>
          `;

          const questions = section.questions || [];
          for (const question of questions) {
            const response = responsesData[question.id];
            responseHtml += `
              <div style="margin-bottom: 20px; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                <h4 style="color: #111827; margin-bottom: 8px;">${
                  question.title
                }</h4>
                <div style="color: #4b5563; margin-bottom: 8px;">
                  ${
                    response
                      ? formatResponse(question, response)
                      : "<em>No response</em>"
                  }
                </div>
              </div>
            `;
          }

          responseHtml += "</div>";
        }

        responseHtml += "</div>";

        // Open in new window
        const newWindow = window.open(
          "",
          "_blank",
          "width=900,height=700,scrollbars=yes"
        );
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Assessment Responses - ${candidate.name}</title>
              <style>
                body { margin: 0; padding: 20px; background-color: #f3f4f6; }
              </style>
            </head>
            <body>${responseHtml}</body>
          </html>
        `);
        newWindow.document.close();
      } catch (error) {
        console.error("Failed to load responses:", error);
        alert("Failed to load assessment responses. Please try again.");
      }
    }
  };

  // Format response for display
  const formatResponse = (question, response) => {
    switch (question.type) {
      case "single-choice":
        const option = question.options?.find(
          (opt) => (opt.value || opt.text) === response
        );
        return `<strong style="color: #3b82f6;">${
          option?.text || response
        }</strong>`;

      case "multi-choice":
        if (Array.isArray(response)) {
          return response
            .map((value) => {
              const option = question.options?.find(
                (opt) => (opt.value || opt.text) === value
              );
              return `<span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; margin: 2px;">${
                option?.text || value
              }</span>`;
            })
            .join(" ");
        }
        return response;

      case "short-text":
      case "long-text":
        return `<div style="padding: 8px; background-color: white; border-radius: 4px; border: 1px solid #d1d5db;">${response}</div>`;

      case "numeric":
        return `<strong style="color: #7c3aed;">${response}</strong>`;

      case "file-upload":
        return `<span style="color: #f59e0b;">📎 ${response}</span>`;

      default:
        return response;
    }
  };

  // Handle note added - refresh the notes section
  const handleNoteAdded = (newNote) => {
    setNotesKey((prev) => prev + 1); // Force NotesSection to re-fetch
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Candidate
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Candidate Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The candidate you're looking for doesn't exist.
          </p>
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  const stageInfo = getStageInfo(candidate.stage || candidate.currentStage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to={
                  referrerContext?.type === "job" && referrerContext?.jobId
                    ? `/candidates?jobId=${referrerContext.jobId}`
                    : "/candidates"
                }
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-4xl font-impact font-black uppercase text-primary-500 dark:text-primary-400 leading-none tracking-tight">
                  {candidate.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Candidate Profile • Applied{" "}
                  {new Date(
                    candidate.appliedDate || candidate.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${stageInfo.color}`}
              >
                {stageInfo.name}
              </span>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Candidate Details Card */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8 transition-colors duration-200">
              <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-6">
                Candidate Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Contact Information
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </div>
                      <div className="font-medium">{candidate.email}</div>
                    </div>
                  </div>

                  {candidate.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Phone
                        </div>
                        <div className="font-medium">{candidate.phone}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Applied Date
                      </div>
                      <div className="font-medium">
                        {new Date(
                          candidate.appliedDate || candidate.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Application Details
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Current Stage
                      </div>
                      <div className="font-medium">{stageInfo.name}</div>
                    </div>
                  </div>

                  {job && (
                    <>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Position
                          </div>
                          <div className="font-medium">{job.title}</div>
                        </div>
                      </div>

                      {job.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Location
                            </div>
                            <div className="font-medium">{job.location}</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last Updated
                      </div>
                      <div className="font-medium">
                        {new Date(
                          candidate.updatedAt || candidate.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-8">
              <NotesSection key={notesKey} candidateId={candidateId} />
            </div>

            {/* Timeline Section */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
                  Activity Timeline
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timelineEntries.length} activities
                </div>
              </div>

              <Timeline
                entries={timelineEntries}
                candidateId={parseInt(candidateId)}
                showCandidate={false}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-200">
              <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Schedule Interview
                </button>

                {/* Assessment Actions - Only show for technical stage */}
                {console.log(
                  "🎯 Debug - candidate stage:",
                  candidate?.stage,
                  "currentStage:",
                  candidate?.currentStage,
                  "assessment:",
                  !!assessment
                )}
                {(candidate?.stage === "tech" ||
                  candidate?.currentStage === "Technical" ||
                  candidate?.stage === "technical") &&
                  assessment && (
                    <>
                      {!assessmentSent && !assessmentCompleted && (
                        <button
                          onClick={handleSendAssessment}
                          disabled={sendingAssessment}
                          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-purple-600 dark:bg-purple-500 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {sendingAssessment ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Taking Assessment...
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Take Assessment
                            </>
                          )}
                        </button>
                      )}

                      {assessmentCompleted && (
                        <button
                          onClick={handleViewResponses}
                          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Responses
                        </button>
                      )}

                      {assessmentSent &&
                        !assessmentCompleted &&
                        sendingAssessment && (
                          <div className="w-full px-4 py-3 text-sm font-medium text-center text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30 rounded-md">
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Candidate is attempting the assessment...
                            </div>
                            <div className="text-xs mt-1 text-orange-600 dark:text-orange-400">
                              Auto-completing in progress
                            </div>
                          </div>
                        )}
                    </>
                  )}

                {(candidate?.stage === "tech" ||
                  candidate?.currentStage === "Technical" ||
                  candidate?.stage === "technical") &&
                  !assessment && (
                    <div className="w-full px-4 py-3 text-sm font-medium text-center text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 rounded-md">
                      No assessment available for this position
                    </div>
                  )}

                <button
                  onClick={() => setShowNotesModal(true)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Add Note
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Download Resume (dummy)
                </button>
              </div>
            </div>

            {/* Job Details */}
            {job && (
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
                    Job Details
                  </h3>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Position
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {job.title}
                    </div>
                  </div>

                  {job.department && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Department
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {job.department}
                      </div>
                    </div>
                  )}

                  {job.location && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Location
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {job.location}
                      </div>
                    </div>
                  )}

                  {job.type && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Type
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {job.type}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        candidateId={candidateId}
        candidateName={candidate?.name}
        onNoteAdded={handleNoteAdded}
      />
    </div>
  );
};

export default CandidateProfilePage;
