import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Target,
  Activity,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../layout/ThemeToggle";
import db, { dbHelpers } from "../../lib/database";
import { formatDistanceToNow } from "date-fns";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { signOut } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalAssessments: 0,
    activeApplications: 0,
    recentActivity: [],
    mainMetrics: [],
    candidatePipeline: [],
    jobApplicationTrends: [],
    assessmentCompletion: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data directly from IndexedDB
      const candidatesFromDB = await dbHelpers.getAllCandidates();
      const jobsFromDB = await dbHelpers.getAllJobs();
      const assessmentsFromDB = await db.assessments.toArray();

      // Calculate main metrics data for chart
      const mainMetricsData = [
        {
          metric: "Job Openings",
          value: jobsFromDB.length,
          color: "#0d9488",
        },
        {
          metric: "Total Candidates",
          value: candidatesFromDB.length,
          color: "#3b82f6",
        },
        {
          metric: "Assessments",
          value: assessmentsFromDB.length,
          color: "#8b5cf6",
        },
        {
          metric: "Active Apps",
          value: candidatesFromDB.filter(
            (c) => !["hired", "rejected"].includes(c.currentStage || c.stage)
          ).length,
          color: "#10b981",
        },
      ];

      // Calculate pipeline data using IndexedDB candidates
      const pipelineData = [
        {
          stage: "Applied",
          count: candidatesFromDB.filter((c) => c.stage === "applied").length,
        },
        {
          stage: "Screening",
          count: candidatesFromDB.filter((c) => c.stage === "screen").length,
        },
        {
          stage: "Technical",
          count: candidatesFromDB.filter((c) => c.stage === "tech").length,
        },
        {
          stage: "Offer",
          count: candidatesFromDB.filter((c) => c.stage === "offer").length,
        },
        {
          stage: "Hired",
          count: candidatesFromDB.filter((c) => c.stage === "hired").length,
        },
        {
          stage: "Rejected",
          count: candidatesFromDB.filter((c) => c.stage === "rejected").length,
        },
      ];

      // Calculate job application trends (mock data for now)
      const trendsData = [
        { month: "Jan", applications: 45 },
        { month: "Feb", applications: 52 },
        { month: "Mar", applications: 61 },
        { month: "Apr", applications: 58 },
        { month: "May", applications: 67 },
        { month: "Jun", applications: 74 },
      ];

      // Calculate assessment completion rates
      const completionData = [
        {
          name: "Completed",
          value: assessmentsFromDB.filter((a) => a.status === "completed")
            .length,
          color: "#10b981",
        },
        {
          name: "In Progress",
          value: assessmentsFromDB.filter((a) => a.status === "in-progress")
            .length,
          color: "#f59e0b",
        },
        {
          name: "Not Started",
          value: assessmentsFromDB.filter((a) => a.status === "not-started")
            .length,
          color: "#ef4444",
        },
      ];

      // Fetch recent activity from timeline
      let recentActivity = [];
      try {
        const timelineEntries = await dbHelpers.getTimelineEntries(null, 10); // Get latest 10 entries
        recentActivity = timelineEntries.map((entry) => ({
          id: entry.id,
          type: entry.action === "created" ? "application" : "stage_change",
          message:
            entry.action === "created"
              ? `${entry.candidateName} applied for a position`
              : `${entry.candidateName} moved to ${entry.toStage}`,
          time: formatDistanceToNow(new Date(entry.timestamp), {
            addSuffix: true,
          }),
        }));
      } catch (timelineError) {
        console.error(
          "Failed to fetch timeline data for analytics:",
          timelineError
        );
        recentActivity = [];
      }

      const finalData = {
        totalJobs: jobsFromDB.length,
        totalCandidates: candidatesFromDB.length,
        totalAssessments: assessmentsFromDB.length,
        activeApplications: candidatesFromDB.filter(
          (c) => !["hired", "rejected"].includes(c.stage)
        ).length,
        recentActivity,
        mainMetrics: mainMetricsData,
        candidatePipeline: pipelineData,
        jobApplicationTrends: trendsData,
        assessmentCompletion: completionData,
      };

      // Debug: Log the final counts
      console.log("📊 Dashboard data from IndexedDB:", {
        jobs: jobsFromDB.length,
        candidates: candidatesFromDB.length,
        assessments: assessmentsFromDB.length,
        activeApplications: candidatesFromDB.filter(
          (c) => !["hired", "rejected"].includes(c.stage)
        ).length,
      });

      setDashboardData(finalData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "teal" }) => (
    <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-impact font-medium uppercase text-primary-500 dark:text-primary-400 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}
        >
          <Icon
            className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-impact font-semibold uppercase text-primary-500 dark:text-primary-400 leading-tight tracking-wide">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Overview of your hiring process
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2" />
              View Jobs Flow
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 min-h-screen">
          <nav className="p-4 space-y-2">
            <div className="flex items-center px-3 py-2 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-lg font-medium">
              <Target className="w-4 h-4 mr-3" />
              Overview
            </div>
            <Link
              to="/candidates"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Users className="w-4 h-4 mr-3" />
              Candidates
            </Link>
            <Link
              to="/jobs"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-3" />
              Jobs
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Briefcase}
              title="Active Job Openings"
              value={dashboardData.totalJobs}
              subtitle="Positions available"
              color="teal"
            />
            <StatCard
              icon={Users}
              title="Total Candidates"
              value={dashboardData.totalCandidates}
              subtitle="In pipeline"
              color="blue"
            />
            <StatCard
              icon={FileText}
              title="Assessments"
              value={dashboardData.totalAssessments}
              subtitle="Created"
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              title="Active Applications"
              value={dashboardData.activeApplications}
              subtitle="In progress"
              color="green"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Main Metrics Chart */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 dark:text-primary-400 tracking-wide mb-4">
                Key Metrics Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.mainMetrics}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="metric"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 11,
                    }}
                    axisLine={{ stroke: isDarkMode ? "#4b5563" : "#9ca3af" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: isDarkMode ? "#4b5563" : "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#000000" : "#ffffff",
                      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Application Trends */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 dark:text-primary-400 tracking-wide mb-4">
                Application Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.jobApplicationTrends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: isDarkMode ? "#4b5563" : "#9ca3af" }}
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: isDarkMode ? "#4b5563" : "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#000000" : "#ffffff",
                      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#0d9488"
                    fill="#0d9488"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assessment Completion */}

            {/* Recent Activity */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 dark:text-primary-400 tracking-wide mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        {activity.type === "application" && (
                          <Users className="w-5 h-5 text-blue-500" />
                        )}
                        {activity.type === "stage_change" && (
                          <ArrowRight className="w-5 h-5 text-green-500" />
                        )}
                        {activity.type === "interview" && (
                          <Calendar className="w-5 h-5 text-purple-500" />
                        )}
                        {activity.type === "assessment" && (
                          <FileText className="w-5 h-5 text-orange-500" />
                        )}
                        {activity.type === "offer" && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No recent activity</p>
                    <p className="text-xs mt-1">
                      Activity will appear here as candidates progress
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
