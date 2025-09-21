import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, Briefcase, FileText, TrendingUp, Clock, CheckCircle,
  ArrowRight, Calendar, Target, Activity
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalAssessments: 0,
    activeApplications: 0,
    recentActivity: [],
    candidatePipeline: [],
    jobApplicationTrends: [],
    assessmentCompletion: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs data - jobs API returns { success: true, data: [...], pagination: {...} }
      const jobsResponse = await fetch('/api/jobs?pageSize=1000');
      const jobsData = await jobsResponse.json();
      const jobs = jobsData.data || [];

      // Fetch candidates data - candidates API returns { data: [...], pagination: {...} }
      const candidatesResponse = await fetch('/api/candidates?pageSize=1000');
      const candidatesData = await candidatesResponse.json();
      const candidates = candidatesData.data || [];

      // Fetch assessments data - assessments API returns { success: true, data: [...] }
      const assessmentsResponse = await fetch('/api/assessments');
      const assessmentsData = await assessmentsResponse.json();
      const assessments = assessmentsData.success ? assessmentsData.data : [];

      // Calculate pipeline data
      const pipelineData = [
        { stage: 'Applied', count: candidates.filter(c => c.stage === 'applied').length },
        { stage: 'Screening', count: candidates.filter(c => c.stage === 'screen').length },
        { stage: 'Interview', count: candidates.filter(c => c.stage === 'interview').length },
        { stage: 'Final', count: candidates.filter(c => c.stage === 'final').length },
        { stage: 'Offer', count: candidates.filter(c => c.stage === 'offer').length },
        { stage: 'Hired', count: candidates.filter(c => c.stage === 'hired').length }
      ];

      // Calculate job application trends (mock data for now)
      const trendsData = [
        { month: 'Jan', applications: 45 },
        { month: 'Feb', applications: 52 },
        { month: 'Mar', applications: 61 },
        { month: 'Apr', applications: 58 },
        { month: 'May', applications: 67 },
        { month: 'Jun', applications: 74 }
      ];

      // Calculate assessment completion rates
      const completionData = [
        { name: 'Completed', value: assessments.filter(a => a.status === 'completed').length, color: '#10b981' },
        { name: 'In Progress', value: assessments.filter(a => a.status === 'in-progress').length, color: '#f59e0b' },
        { name: 'Not Started', value: assessments.filter(a => a.status === 'not-started').length, color: '#ef4444' }
      ];

      // Recent activity (mock data)
      const recentActivity = [
        { id: 1, type: 'application', message: 'John Doe applied for Senior Developer', time: '2 hours ago' },
        { id: 2, type: 'interview', message: 'Interview scheduled with Sarah Johnson', time: '4 hours ago' },
        { id: 3, type: 'assessment', message: 'Technical assessment completed by Mike Chen', time: '6 hours ago' },
        { id: 4, type: 'offer', message: 'Offer extended to Emma Wilson', time: '1 day ago' }
      ];

      const finalData = {
        totalJobs: jobs.length,
        totalCandidates: candidates.length,
        totalAssessments: assessments.length,
        activeApplications: candidates.filter(c => !['hired', 'rejected'].includes(c.stage)).length,
        recentActivity,
        candidatePipeline: pipelineData,
        jobApplicationTrends: trendsData,
        assessmentCompletion: completionData
      };
      
      // Debug: Log the final counts
      console.log('📊 Dashboard data:', {
        jobs: jobs.length,
        candidates: candidates.length,
        assessments: assessments.length,
        activeApplications: candidates.filter(c => !['hired', 'rejected'].includes(c.stage)).length
      });
      
      setDashboardData(finalData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'teal' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-impact font-medium uppercase text-primary-500 tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-impact font-semibold uppercase text-primary-500 leading-tight tracking-wide">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your hiring process</p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Activity className="w-4 h-4 mr-2" />
            View Jobs Flow
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <div className="flex items-center px-3 py-2 text-teal-600 bg-teal-50 rounded-lg font-medium">
              <Target className="w-4 h-4 mr-3" />
              Overview
            </div>
            <Link to="/candidates" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Users className="w-4 h-4 mr-3" />
              Candidates
            </Link>
            <Link to="/jobs" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Briefcase className="w-4 h-4 mr-3" />
              Jobs
            </Link>
            <Link to="/assessments" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <FileText className="w-4 h-4 mr-3" />
              Assessments
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
            {/* Candidate Pipeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 tracking-wide mb-4">Candidate Pipeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.candidatePipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Application Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 tracking-wide mb-4">Application Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.jobApplicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 tracking-wide mb-4">Assessment Completion</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.assessmentCompletion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.assessmentCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {dashboardData.assessmentCompletion.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-impact font-medium uppercase text-primary-500 tracking-wide mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'application' && <Users className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'interview' && <Calendar className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'assessment' && <FileText className="w-5 h-5 text-orange-500" />}
                      {activity.type === 'offer' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;