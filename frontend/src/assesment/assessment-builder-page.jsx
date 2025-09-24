import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Settings, Eye, Save, FileText, Clock, BarChart } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssessmentBuilder = () => {
  // Mock data for existing assessments
  const assessments = [{
    id: 1,
    title: "Frontend Developer Assessment",
    description: "Comprehensive evaluation for React developers",
    status: "active",
    questions: 12,
    duration: 45,
    responses: 23
  }, {
    id: 2,
    title: "Leadership Skills Assessment",
    description: "Evaluating management and leadership capabilities",
    status: "draft",
    questions: 8,
    duration: 30,
    responses: 0
  }, {
    id: 3,
    title: "UX Design Portfolio Review",
    description: "Portfolio-based assessment for UX designers",
    status: "active",
    questions: 15,
    duration: 60,
    responses: 18
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-8",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex justify-between items-center",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-3xl font-bold tracking-tight",
          children: "Assessment Builder"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground",
          children: "Create and manage custom assessments for your hiring process"
        })]
      }), /*#__PURE__*/_jsxs(Button, {
        children: [/*#__PURE__*/_jsx(Plus, {
          className: "mr-2 h-4 w-4"
        }), "New Assessment"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid gap-4 md:grid-cols-3",
      children: [/*#__PURE__*/_jsxs(Card, {
        children: [/*#__PURE__*/_jsxs(CardHeader, {
          className: "flex flex-row items-center justify-between space-y-0 pb-2",
          children: [/*#__PURE__*/_jsx(CardTitle, {
            className: "text-sm font-medium",
            children: "Total Assessments"
          }), /*#__PURE__*/_jsx(FileText, {
            className: "h-4 w-4 text-muted-foreground"
          })]
        }), /*#__PURE__*/_jsxs(CardContent, {
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-2xl font-bold",
            children: (assessments || []).length
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-muted-foreground",
            children: [(assessments || []).filter(a => a.status === "active").length, " ", "active"]
          })]
        })]
      }), /*#__PURE__*/_jsxs(Card, {
        children: [/*#__PURE__*/_jsxs(CardHeader, {
          className: "flex flex-row items-center justify-between space-y-0 pb-2",
          children: [/*#__PURE__*/_jsx(CardTitle, {
            className: "text-sm font-medium",
            children: "Total Responses"
          }), /*#__PURE__*/_jsx(BarChart, {
            className: "h-4 w-4 text-muted-foreground"
          })]
        }), /*#__PURE__*/_jsxs(CardContent, {
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-2xl font-bold",
            children: assessments.reduce((sum, a) => sum + a.responses, 0)
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "Across all assessments"
          })]
        })]
      }), /*#__PURE__*/_jsxs(Card, {
        children: [/*#__PURE__*/_jsxs(CardHeader, {
          className: "flex flex-row items-center justify-between space-y-0 pb-2",
          children: [/*#__PURE__*/_jsx(CardTitle, {
            className: "text-sm font-medium",
            children: "Avg. Duration"
          }), /*#__PURE__*/_jsx(Clock, {
            className: "h-4 w-4 text-muted-foreground"
          })]
        }), /*#__PURE__*/_jsxs(CardContent, {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "text-2xl font-bold",
            children: [Math.round((assessments || []).reduce((sum, a) => sum + a.duration, 0) / Math.max((assessments || []).length, 1)), " ", "min"]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "Average completion time"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "space-y-4",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl font-semibold",
        children: "Your Assessments"
      }), /*#__PURE__*/_jsx("div", {
        className: "grid gap-4",
        children: (assessments || []).map(assessment => /*#__PURE__*/_jsxs(Card, {
          className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 shadow-md hover:shadow-lg",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-start justify-between",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "space-y-1",
                children: [/*#__PURE__*/_jsx(CardTitle, {
                  className: "text-lg text-blue-900",
                  children: assessment.title
                }), /*#__PURE__*/_jsx(CardDescription, {
                  className: "text-blue-700",
                  children: assessment.description
                })]
              }), /*#__PURE__*/_jsx(Badge, {
                variant: assessment.status === "active" ? "default" : "secondary",
                className: assessment.status === "active" ? "bg-green-500 hover:bg-green-600" : "",
                children: assessment.status
              })]
            })
          }), /*#__PURE__*/_jsx(CardContent, {
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-6 text-sm text-blue-600",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(FileText, {
                    className: "h-4 w-4"
                  }), assessment.questions, " questions"]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(Clock, {
                    className: "h-4 w-4"
                  }), assessment.duration, " min"]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(BarChart, {
                    className: "h-4 w-4"
                  }), assessment.responses, " responses"]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex gap-2",
                children: [/*#__PURE__*/_jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  children: [/*#__PURE__*/_jsx(Eye, {
                    className: "mr-2 h-4 w-4"
                  }), "Preview"]
                }), /*#__PURE__*/_jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  children: [/*#__PURE__*/_jsx(Settings, {
                    className: "mr-2 h-4 w-4"
                  }), "Edit"]
                }), assessment.status === "draft" && /*#__PURE__*/_jsxs(Button, {
                  size: "sm",
                  children: [/*#__PURE__*/_jsx(Save, {
                    className: "mr-2 h-4 w-4"
                  }), "Publish"]
                })]
              })]
            })
          })]
        }, assessment.id))
      })]
    }), /*#__PURE__*/_jsxs(Card, {
      children: [/*#__PURE__*/_jsxs(CardHeader, {
        children: [/*#__PURE__*/_jsx(CardTitle, {
          children: "Getting Started"
        }), /*#__PURE__*/_jsx(CardDescription, {
          children: "Create your first assessment in minutes"
        })]
      }), /*#__PURE__*/_jsx(CardContent, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium",
              children: "1"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h4", {
                className: "font-medium",
                children: "Choose Assessment Type"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Select from technical skills, personality, or custom assessment templates"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium",
              children: "2"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h4", {
                className: "font-medium",
                children: "Add Questions"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Create multiple choice, text, or coding questions with our intuitive builder"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium",
              children: "3"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h4", {
                className: "font-medium",
                children: "Configure & Publish"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Set time limits, scoring, and publish to start collecting responses"
              })]
            })]
          })]
        })
      })]
    })]
  });
};