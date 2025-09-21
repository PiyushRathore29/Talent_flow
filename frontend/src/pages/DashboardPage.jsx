import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeCandidates: 0,
    completedAssessments: 0,
    hiredThisMonth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch jobs
        const jobsResponse = await fetch('/api/jobs?pageSize=100');
        const jobsData = await jobsResponse.json();
        const jobs = jobsData.data || [];

        // Fetch candidates
        const candidatesResponse = await fetch('/api/candidates?pageSize=100');
        const candidatesData = await candidatesResponse.json();
        const candidates = candidatesData.data || [];

        // Fetch assessments
        const assessmentsResponse = await fetch('/api/assessments?pageSize=100');
        const assessmentsData = await assessmentsResponse.json();
        const assessments = assessmentsData.data || [];

        // Calculate stats
        const hiredThisMonth = candidates.filter(c => 
          c.stage === 'hired' && 
          new Date(c.updatedAt || c.createdAt).getMonth() === new Date().getMonth()
        ).length;

        setStats({
          totalJobs: jobs.length,
          activeCandidates: candidates.filter(c => !['hired', 'rejected'].includes(c.stage)).length,
          completedAssessments: assessments.length,
          hiredThisMonth
        });

        // Generate recent activity
        const activity = [
          { type: 'candidate', message: `${candidates.length} candidates in pipeline`, time: '2 hours ago' },
          { type: 'job', message: `${jobs.filter(j => j.status === 'active').length} active job postings`, time: '4 hours ago' },
          { type: 'assessment', message: `${assessments.length} assessments configured`, time: '6 hours ago' },
          { type: 'hire', message: `${hiredThisMonth} hires this month`, time: '1 day ago' }
        ];
        setRecentActivity(activity);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-hero font-impact font-black uppercase text-white leading-none mb-4 lg:mb-8 tracking-tight">
              TALENT
              <br />
              <span className="text-primary-400">DASHBOARD</span>
            </h1>
            <p className="text-large font-impact font-black uppercase text-gray-300 leading-none tracking-tight max-w-2xl mx-auto">
              YOUR COMPLETE HIRING MANAGEMENT SYSTEM. TRACK CANDIDATES, MANAGE JOBS, 
              AND STREAMLINE YOUR RECRUITMENT PROCESS.
            </p>
            <div className="mt-8">
              <span className="text-medium font-impact font-black uppercase text-gray-400 tracking-tight">
                WELCOME BACK, <span className="text-white">{user?.firstName || user?.username || 'USER'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            title="TOTAL JOBS"
            value={stats.totalJobs}
            subtitle="Active Positions"
            color="blue"
            link="/jobs"
          />
          <StatCard
            title="ACTIVE CANDIDATES"
            value={stats.activeCandidates}
            subtitle="In Pipeline"
            color="green"
            link="/candidates"
          />
          <StatCard
            title="ASSESSMENTS"
            value={stats.completedAssessments}
            subtitle="Configured"
            color="purple"
            link="/assessments"
          />
          <StatCard
            title="HIRED THIS MONTH"
            value={stats.hiredThisMonth}
            subtitle="New Hires"
            color="orange"
          />
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <NavigationCard
            title="JOBS MANAGEMENT"
            description="Create, edit, and manage job postings. Track applications and control the hiring pipeline."
            link="/jobs"
            icon="💼"
            features={["Create Job Postings", "Manage Applications", "Track Hiring Progress"]}
          />
          <NavigationCard
            title="CANDIDATES PIPELINE"
            description="Visual kanban board for managing candidates through your hiring stages."
            link="/candidates"
            icon="👥"
            features={["Kanban Board View", "Stage Management", "Candidate Profiles"]}
          />
          <NavigationCard
            title="ASSESSMENTS BUILDER"
            description="Create and manage assessments for evaluating candidate skills and fit."
            link="/assessments"
            icon="📊"
            features={["Custom Questions", "Automated Scoring", "Response Analytics"]}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-heading font-impact font-black uppercase text-primary-500 leading-none mb-4 lg:mb-8 tracking-tight">
            RECENT ACTIVITY
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mb-16">
          <h2 className="text-heading font-impact font-black uppercase text-primary-500 leading-none mb-4 lg:mb-8 tracking-tight">
            QUICK ACTIONS
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <QuickActionButton
              title="POST NEW JOB"
              link="/jobs?action=create"
              color="blue"
            />
            <QuickActionButton
              title="ADD CANDIDATE"
              link="/candidates?action=create"
              color="green"
            />
            <QuickActionButton
              title="CREATE ASSESSMENT"
              link="/assessments?action=create"
              color="purple"
            />
            <QuickActionButton
              title="VIEW ANALYTICS"
              link="/analytics"
              color="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, color, link }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-white',
    green: 'from-green-500 to-green-600 text-white',
    purple: 'from-purple-500 to-purple-600 text-white',
    orange: 'from-orange-500 to-orange-600 text-white'
  };

  const CardContent = () => (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200`}>
      <div className="text-small font-impact font-black uppercase leading-none tracking-tight opacity-90 mb-2">
        {title}
      </div>
      <div className="text-display-sm font-impact font-black uppercase leading-none tracking-tight mb-2">
        {value}
      </div>
      <div className="text-small font-impact font-black uppercase leading-none tracking-tight opacity-80">
        {subtitle}
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="block">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

// Navigation Card Component
const NavigationCard = ({ title, description, link, icon, features }) => (
  <Link to={link} className="block group">
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-gray-300 h-full">
      <div className="text-display-sm mb-4">{icon}</div>
      <h3 className="text-heading font-impact font-black uppercase text-primary-500 leading-none tracking-tight group-hover:text-blue-600 transition-colors mb-4">
        {title}
      </h3>
      <p className="text-medium font-impact font-black uppercase text-primary-700 leading-none tracking-tight mb-6">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
            <span className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </Link>
);

// Activity Item Component
const ActivityItem = ({ type, message, time }) => {
  const iconMap = {
    candidate: '👤',
    job: '💼',
    assessment: '📊',
    hire: '🎉'
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-4">
        <span className="text-heading">{iconMap[type]}</span>
        <span className="text-medium font-impact font-black uppercase text-primary-500 leading-none tracking-tight">{message}</span>
      </div>
      <span className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight">{time}</span>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ title, link, color }) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  return (
    <Link
      to={link}
      className={`${colorClasses[color]} text-white px-8 py-4 rounded-xl font-impact font-black uppercase leading-none tracking-tight hover:transform hover:scale-105 transition-all duration-200 shadow-lg`}
    >
      {title}
    </Link>
  );
};

export default DashboardPage;