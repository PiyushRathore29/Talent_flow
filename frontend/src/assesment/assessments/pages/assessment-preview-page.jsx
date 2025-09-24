import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useAppStore } from "../../../lib/store";
import { AssessmentPreview } from "../components/assessment-preview";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentPreviewPage = () => {
  const {
    assessmentId
  } = useParams();
  const navigate = useNavigate();
  const {
    assessments,
    loading
  } = useAppStore();
  const [assessment, setAssessment] = useState(null);
  useEffect(() => {
    if (assessmentId && assessments.length > 0) {
      const foundAssessment = assessments.find(a => a.id === assessmentId);
      setAssessment(foundAssessment || null);
    }
  }, [assessmentId, assessments]);
  const handleBack = () => {
    navigate("/assessments");
  };
  const handleEdit = () => {
    if (assessment) {
      if (assessment.jobId) {
        navigate(`/assessments/builder/${assessment.jobId}/${assessment.id}`);
      } else {
        navigate(`/assessments/builder/standalone/${assessment.id}`);
      }
    }
  };
  if (loading.loadAssessments) {
    return /*#__PURE__*/_jsx("div", {
      className: "space-y-6 p-6 h-full overflow-hidden",
      style: {
        backgroundColor: "#000319"
      },
      children: /*#__PURE__*/_jsxs("div", {
        className: "max-w-4xl mx-auto space-y-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-4",
          children: [/*#__PURE__*/_jsx(Skeleton, {
            className: "h-10 w-10 bg-gray-800"
          }), /*#__PURE__*/_jsx(Skeleton, {
            className: "h-8 w-64 bg-gray-800"
          })]
        }), /*#__PURE__*/_jsx(Skeleton, {
          className: "h-96 w-full bg-gray-800"
        })]
      })
    });
  }
  if (!assessment) {
    return /*#__PURE__*/_jsx("div", {
      className: "space-y-6 p-6 h-full overflow-hidden",
      style: {
        backgroundColor: "#000319"
      },
      children: /*#__PURE__*/_jsxs("div", {
        className: "max-w-4xl mx-auto",
        children: [/*#__PURE__*/_jsx("div", {
          className: "flex items-center gap-4 mb-6",
          children: /*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            onClick: handleBack,
            className: "text-gray-400 hover:text-white",
            children: [/*#__PURE__*/_jsx(ArrowLeft, {
              className: "mr-2 h-4 w-4"
            }), "Back to Assessments"]
          })
        }), /*#__PURE__*/_jsx(Card, {
          className: "bg-gray-800 border-gray-700",
          children: /*#__PURE__*/_jsxs(CardContent, {
            className: "p-8 text-center",
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-xl text-gray-300 mb-4",
              children: "Assessment Not Found"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-gray-400 mb-6",
              children: "The assessment you're looking for doesn't exist or has been removed."
            }), /*#__PURE__*/_jsx(Button, {
              onClick: handleBack,
              className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300",
              children: "Return to Assessments"
            })]
          })
        })]
      })
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "space-y-6 p-6 h-full overflow-hidden",
    style: {
      backgroundColor: "#000319"
    },
    children: /*#__PURE__*/_jsxs("div", {
      className: "max-w-4xl mx-auto",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-4",
          children: [/*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            onClick: handleBack,
            className: "text-gray-400 hover:text-white",
            children: [/*#__PURE__*/_jsx(ArrowLeft, {
              className: "mr-2 h-4 w-4"
            }), "Back to Assessments"]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h1", {
              className: "text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
              children: "Assessment Preview"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-gray-400",
              children: assessment.title
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex gap-2",
          children: /*#__PURE__*/_jsxs(Button, {
            variant: "outline",
            onClick: handleEdit,
            className: "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700",
            children: [/*#__PURE__*/_jsx(ExternalLink, {
              className: "mr-2 h-4 w-4"
            }), "Edit Assessment"]
          })
        })]
      }), /*#__PURE__*/_jsxs(Card, {
        className: "bg-gray-800 border-gray-700",
        children: [/*#__PURE__*/_jsxs(CardHeader, {
          children: [/*#__PURE__*/_jsx(CardTitle, {
            className: "text-white",
            children: "Live Preview"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-gray-400",
            children: "This is how candidates will see your assessment"
          })]
        }), /*#__PURE__*/_jsx(CardContent, {
          children: /*#__PURE__*/_jsx(AssessmentPreview, {
            assessment: assessment
          })
        })]
      })]
    })
  });
};