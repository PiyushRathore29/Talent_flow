import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  Copy,
  Check,
  Database,
  Zap,
  Users,
  GitBranch,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const sidebarSections = [
    {
      title: "Get Started",
      icon: FileText,
      items: [
        { id: "introduction", title: "Introduction" },
        { id: "installation", title: "Installation" },
        { id: "getting-started", title: "Getting Started" },
        { id: "tech-stack", title: "Tech Stack" },
      ],
    },
    {
      title: "Architecture",
      icon: Settings,
      items: [
        { id: "database-schema", title: "Database Schema" },
        { id: "msw-setup", title: "MSW (Mock Service Worker)" },
        { id: "authentication", title: "Authentication System" },
        { id: "routing", title: "Routing & Navigation" },
        { id: "theme-system", title: "Theme System" },
      ],
    },
    {
      title: "Core Features",
      icon: Zap,
      items: [
        { id: "job-management", title: "Job Management" },
        { id: "candidate-tracking", title: "Candidate Tracking" },
        { id: "react-flows", title: "React Flow System" },
        { id: "assessment-system", title: "Assessment System" },
        { id: "analytics", title: "Analytics Dashboard" },
        { id: "candidate-management", title: "Candidate Management" },
      ],
    },
    {
      title: "API Reference",
      icon: Database,
      items: [
        { id: "jobs-api", title: "Jobs API" },
        { id: "candidates-api", title: "Candidates API" },
        { id: "assessments-api", title: "Assessments API" },
        { id: "database-operations", title: "Database Operations" },
        { id: "authentication-api", title: "Authentication API" },
        { id: "api-client", title: "API Client" },
      ],
    },
    {
      title: "Development",
      icon: GitBranch,
      items: [
        { id: "seeding-data", title: "Data Seeding" },
        { id: "component-structure", title: "Component Structure" },
        { id: "ui-components", title: "UI Component Library" },
        { id: "artificial-latency", title: "Artificial Latency" },
        { id: "development-tools", title: "Development Tools" },
      ],
    },
  ];

  const CodeBlock = ({ code, language = "javascript", id }) => (
    <div className="bg-gray-900 dark:bg-black rounded-lg overflow-hidden border border-gray-700 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-400 uppercase">
            {language}
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-300">{code}</code>
      </pre>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "introduction":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                INTRODUCTION
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Welcome to TalentFlow Documentation. This is a comprehensive
                React-based talent acquisition platform built with modern web
                technologies, featuring advanced candidate tracking, job
                management, assessment systems, and real-time analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-2">
                  WHAT IS TALENTFLOW?
                </h3>
                <p className="text-base font-inter text-blue-700 dark:text-blue-200">
                  TalentFlow is a modern recruitment platform that streamlines
                  the hiring process with intuitive job management, candidate
                  tracking, React Flow visualizations, and powerful analytics.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-2">
                  KEY FEATURES
                </h3>
                <ul className="text-base font-inter text-green-700 dark:text-green-200 space-y-1">
                  <li>• Interactive React Flow job pipelines</li>
                  <li>• Advanced assessment system</li>
                  <li>• Real-time candidate tracking</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-impact font-bold uppercase text-yellow-800 dark:text-yellow-300 mb-2">
                ARCHITECTURE OVERVIEW
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-inter text-yellow-700 dark:text-yellow-200">
                <div>
                  <strong>Frontend:</strong> React 19, Vite, TailwindCSS
                </div>
                <div>
                  <strong>Database:</strong> IndexedDB with Dexie.js
                </div>
                <div>
                  <strong>Mocking:</strong> MSW (Mock Service Worker)
                </div>
              </div>
            </div>
          </div>
        );

      case "installation":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                INSTALLATION
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                Get started with TalentFlow by setting up your development
                environment and installing the necessary dependencies.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                PREREQUISITES
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <ul className="text-sm font-inter text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Node.js 18+ and npm/yarn</li>
                  <li>• Modern web browser with IndexedDB support</li>
                  <li>• Git for version control</li>
                </ul>
              </div>

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                CLONE & INSTALL
              </h3>
              <CodeBlock
                code={`# Clone the repository
git clone <repository-url>
cd frontend-design/frontend

# Install dependencies
npm install
# or with yarn
yarn install`}
                language="bash"
                id="clone-install"
              />

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                DEVELOPMENT SETUP
              </h3>
              <CodeBlock
                code={`# Start development server
npm run dev
# or
yarn dev

# The application will be available at:
# http://localhost:5173`}
                language="bash"
                id="dev-setup"
              />

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                BUILD FOR PRODUCTION
              </h3>
              <CodeBlock
                code={`# Build the application
npm run build
# or
yarn build

# Preview the build
npm run preview
# or
yarn preview`}
                language="bash"
                id="build-setup"
              />

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mt-8">
                DISABLING MSW IN PRODUCTION
              </h3>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-6">
                In production, MSW (Mock Service Worker) must be disabled since
                there's no backend server. The application uses IndexedDB
                directly for data persistence.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-impact font-bold uppercase text-yellow-800 dark:text-yellow-300 mb-3">
                  ⚠️ WHY DISABLE MSW IN PRODUCTION?
                </h4>
                <div className="space-y-2 text-sm font-inter text-yellow-700 dark:text-yellow-200">
                  <div>
                    • <strong>No Backend Server:</strong> Production deployment
                    is static hosting (Vercel/Netlify)
                  </div>
                  <div>
                    • <strong>API Endpoints Don't Exist:</strong> /api/jobs,
                    /api/candidates return 404 errors
                  </div>
                  <div>
                    • <strong>MSW Overhead:</strong> Unnecessary service worker
                    in production
                  </div>
                  <div>
                    • <strong>IndexedDB Direct Access:</strong> Better
                    performance without MSW layer
                  </div>
                  <div>
                    • <strong>Cleaner Console:</strong> No MSW warnings or
                    intercept messages
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h4 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                  PRODUCTION CONFIGURATION
                </h4>
                <CodeBlock
                  code={`// main.jsx - MSW disabled for production
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// MSW commented out - using IndexedDB directly
// import { initializeMSW } from "./mocks/browser.js";

import {
  initializeDatabase,
  forceReSeedDatabase,
  forceReSeedAssessments,
} from "./lib/initializeDatabase.js";

// Initialize database before rendering the app
const startApp = async () => {
  // MSW commented out - using IndexedDB directly
  // await initializeMSW();

  // Initialize database (auto-seed if empty)
  await initializeDatabase();

  // Expose debugging functions to window in development
  if (import.meta.env.DEV) {
    window.forceReSeedDatabase = forceReSeedDatabase;
    window.forceReSeedAssessments = forceReSeedAssessments;
  }

  // Render the app
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

startApp();`}
                  language="javascript"
                  id="production-msw-disable"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-6">
                <h4 className="text-lg font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-3">
                  🔄 HYBRID API CLIENT
                </h4>
                <p className="text-sm font-inter text-blue-700 dark:text-blue-200 mb-3">
                  The application uses a hybrid API client that automatically
                  falls back to IndexedDB:
                </p>
                <CodeBlock
                  code={`// indexedDBClient.js - Hybrid approach
const shouldUseMSW = () => {
  // MSW disabled - always use IndexedDB directly
  return false;
  // return import.meta.env.DEV && typeof window !== 'undefined' && window.__MSW_WORKER__;
};

export const apiCall = async (endpoint, options = {}) => {
  // Try MSW first if available (development)
  if (shouldUseMSW()) {
    // MSW logic commented out
  }
  
  // IndexedDB fallback for production or when MSW fails
  console.log(\`🔄 [API] Using IndexedDB fallback for \${method} \${endpoint}\`);
  return await handleIndexedDBFallback(endpoint, method, body);
};`}
                  language="javascript"
                  id="hybrid-api-client"
                />
              </div>
            </div>
          </div>
        );

      case "tech-stack":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                TECH STACK
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                TalentFlow is built with modern web technologies for optimal
                performance and developer experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  FRONTEND CORE
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div className="flex justify-between">
                    <span>React</span>
                    <span className="font-mono">v19.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vite</span>
                    <span className="font-mono">v6.3.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>React Router</span>
                    <span className="font-mono">v7.9.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TailwindCSS</span>
                    <span className="font-mono">v3.4.1</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  DATA & STATE
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div className="flex justify-between">
                    <span>IndexedDB (Dexie)</span>
                    <span className="font-mono">v4.2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zustand</span>
                    <span className="font-mono">v5.0.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MSW</span>
                    <span className="font-mono">v2.11.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Axios</span>
                    <span className="font-mono">v1.9.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-purple-800 dark:text-purple-300 mb-4">
                  UI & INTERACTIONS
                </h3>
                <div className="space-y-3 text-sm font-inter text-purple-700 dark:text-purple-200">
                  <div className="flex justify-between">
                    <span>React Flow</span>
                    <span className="font-mono">v12.8.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Framer Motion</span>
                    <span className="font-mono">v12.23.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DnD Kit</span>
                    <span className="font-mono">v6.3.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lucide React</span>
                    <span className="font-mono">v0.511.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-orange-800 dark:text-orange-300 mb-4">
                  DEVELOPMENT
                </h3>
                <div className="space-y-3 text-sm font-inter text-orange-700 dark:text-orange-200">
                  <div className="flex justify-between">
                    <span>ESLint</span>
                    <span className="font-mono">v9.27.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PostCSS</span>
                    <span className="font-mono">v8.4.35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Autoprefixer</span>
                    <span className="font-mono">v10.4.21</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zod</span>
                    <span className="font-mono">v3.23.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                GETTING STARTED
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Follow this quick start guide to begin using TalentFlow in your
                application.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                BASIC USAGE
              </h3>
              <CodeBlock
                code={`import TalentFlow from 'talentflow-sdk';

// Initialize the client
const client = new TalentFlow({
  apiKey: process.env.TALENTFLOW_API_KEY,
  baseURL: 'https://api.talentflow.com'
});

// Fetch all jobs
const jobs = await client.jobs.list();
console.log('Jobs:', jobs);`}
                language="javascript"
                id="basic-usage"
              />

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mt-8">
                CREATE A JOB
              </h3>
              <CodeBlock
                code={`const newJob = await client.jobs.create({
  title: 'Senior Frontend Developer',
  description: 'We are looking for an experienced React developer...',
  location: 'Remote',
  type: 'full-time',
  requirements: [
    '5+ years React experience',
    'TypeScript proficiency',
    'Strong communication skills'
  ]
});

console.log('Created job:', newJob.id);`}
                language="javascript"
                id="create-job"
              />
            </div>
          </div>
        );

      case "database-schema":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                DATABASE SCHEMA
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                TalentFlow uses IndexedDB with Dexie.js for client-side data
                storage. The database schema is designed for efficient talent
                management operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  AUTHENTICATION TABLES
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>users:</strong> User accounts with roles
                    (hr/candidate)
                  </div>
                  <div>
                    <strong>companies:</strong> Company information and settings
                  </div>
                  <div>
                    <strong>sessions:</strong> Active user sessions with tokens
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  JOB MANAGEMENT
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>
                    <strong>jobs:</strong> Job postings with metadata
                  </div>
                  <div>
                    <strong>jobStages:</strong> Pipeline stages for each job
                  </div>
                  <div>
                    <strong>applications:</strong> Candidate applications to
                    jobs
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-purple-800 dark:text-purple-300 mb-4">
                  CANDIDATE TRACKING
                </h3>
                <div className="space-y-3 text-sm font-inter text-purple-700 dark:text-purple-200">
                  <div>
                    <strong>candidates:</strong> Candidate profiles and current
                    stage
                  </div>
                  <div>
                    <strong>candidateHistory:</strong> Stage progression history
                  </div>
                  <div>
                    <strong>candidateNotes:</strong> HR notes and comments
                  </div>
                  <div>
                    <strong>timeline:</strong> Comprehensive activity tracking
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-orange-800 dark:text-orange-300 mb-4">
                  ASSESSMENT SYSTEM
                </h3>
                <div className="space-y-3 text-sm font-inter text-orange-700 dark:text-orange-200">
                  <div>
                    <strong>assessments:</strong> Assessment definitions and
                    settings
                  </div>
                  <div>
                    <strong>assessmentQuestions:</strong> Individual questions
                    with options
                  </div>
                  <div>
                    <strong>assessmentResponses:</strong> Candidate answers and
                    scores
                  </div>
                  <div>
                    <strong>assessmentAttempts:</strong> Multiple attempt
                    tracking
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                DATABASE INITIALIZATION
              </h3>
              <CodeBlock
                code={`// Database initialization with Dexie
import Dexie from 'dexie';

export class TalentFlowDB extends Dexie {
  constructor() {
    super('TalentFlowDB');
    
    this.version(7).stores({
      // Authentication & Users
      users: '++id, email, &username, companyId, role, createdAt, lastLogin',
      companies: '++id, &name, domain, createdAt',
      sessions: '++id, userId, token, expiresAt, createdAt',
      
      // Job Management
      jobs: '++id, companyId, title, status, createdById, createdAt, updatedAt',
      jobStages: '++id, jobId, name, order, type, position, nodeId, createdAt',
      
      // Candidate Management
      candidates: '++id, companyId, jobId, userId, name, email, phone, currentStageId, appliedDate, createdAt',
      candidateHistory: '++id, candidateId, fromStageId, toStageId, changedBy, changedAt, note',
      candidateNotes: '++id, candidateId, authorId, text, mentions, createdAt',
      
      // Timeline System
      timeline: '++id, candidateId, candidateName, action, actionType, description, fromStage, toStage, timestamp, hrUserId, hrUserName, jobId, jobTitle, metadata',
      
      // Application System
      applications: '++id, jobId, candidateId, candidateName, candidateEmail, status, appliedAt, createdAt, updatedAt',
      
      // Enhanced Assessment System
      assessments: '++id, jobId, title, description, sections, settings, status, createdById, createdAt, updatedAt',
      assessmentSections: '++id, assessmentId, title, description, order, createdAt',
      assessmentQuestions: '++id, assessmentId, sectionId, type, title, description, options, validation, required, order, createdAt',
      assessmentResponses: '++id, assessmentId, candidateId, questionResponses, submittedAt, timeTaken, score, isCompleted, startedAt',
      assessmentAttempts: '++id, assessmentId, candidateId, attemptNumber, responses, submittedAt, score, timeSpent, isCompleted',
      
      // Application Settings
      appSettings: '++id, userId, companyId, settings, updatedAt'
    });
  }
}`}
                language="javascript"
                id="db-schema"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                DATABASE OPERATIONS
              </h3>
              <CodeBlock
                code={`// Key database operations
import { dbHelpers } from '../lib/database';

// User and Company Management
const createUser = async (userData) => {
  return await dbHelpers.createUser({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'hr',
    companyId: 1,
    password: 'hashedpassword'
  });
};

const createCompany = async (companyData) => {
  return await dbHelpers.createCompany({
    name: 'TechCorp Inc',
    domain: 'techcorp.com'
  });
};

// Job and Stage Management
const createJob = async (jobData) => {
  return await dbHelpers.createJob({
    companyId: 1,
    title: 'Senior React Developer',
    description: 'Join our team...',
    location: 'Remote',
    status: 'active',
    createdById: 1
  });
};

const createJobStage = async (stageData) => {
  return await dbHelpers.createJobStage({
    jobId: 1,
    name: 'Screening',
    order: 1,
    type: 'default',
    position: { x: 100, y: 100 },
    nodeId: 'stage-1'
  });
};

// Candidate Management
const createCandidate = async (candidateData) => {
  return await dbHelpers.createCandidate({
    companyId: 1,
    jobId: 1,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567890',
    currentStageId: 'applied',
    appliedDate: new Date().toISOString(),
    profile: {
      skills: ['React', 'Node.js', 'TypeScript'],
      experience: 5,
      education: 'Computer Science'
    }
  });
};

// Assessment Management
const createAssessment = async (assessmentData) => {
  return await dbHelpers.createAssessment({
    jobId: 1,
    title: 'Technical Skills Assessment',
    description: 'Evaluate candidate technical abilities',
    sections: [
      {
        title: 'Programming Skills',
        questions: [
          {
            type: 'single-choice',
            title: 'What is React?',
            options: [
              { text: 'A JavaScript library', value: 'library', isCorrect: true },
              { text: 'A programming language', value: 'language' }
            ],
            required: true
          }
        ]
      }
    ],
    settings: {
      timeLimit: 3600,
      allowRetake: false,
      passingScore: 70
    }
  });
};`}
                language="javascript"
                id="db-operations-examples"
              />
            </div>
          </div>
        );

      case "authentication":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                AUTHENTICATION SYSTEM
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow implements a comprehensive authentication system with
                role-based access control, session management, and user
                profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  USER ROLES & PERMISSIONS
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>HR Users:</strong> Full access to job management,
                    candidate tracking, assessments, analytics
                  </div>
                  <div>
                    <strong>Candidate Users:</strong> Access to job
                    applications, assessments, profile management
                  </div>
                  <div>
                    <strong>Company Isolation:</strong> Users belong to
                    companies with data isolation
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  SESSION MANAGEMENT
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>
                    <strong>Token-based:</strong> Secure session tokens stored
                    in localStorage
                  </div>
                  <div>
                    <strong>Auto-renewal:</strong> Sessions extend on user
                    activity
                  </div>
                  <div>
                    <strong>Route Protection:</strong> Automatic redirects based
                    on authentication status
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                AUTHENTICATION FLOW
              </h3>
              <CodeBlock
                code={`// Sign Up Process
const handleSignUp = async (userData) => {
  const result = await signUp({
    email: 'user@example.com',
    password: 'securepassword',
    role: 'hr', // or 'candidate'
    companyName: 'TechCorp', // for HR users
    companyDomain: 'techcorp.com',
    firstName: 'John',
    lastName: 'Doe'
  });
  
  if (result.success) {
    // User created and logged in automatically
    navigate('/dashboard');
  }
};

// Sign In Process
const handleSignIn = async (email, password) => {
  const result = await signIn(email, password);
  if (result.success) {
    // Redirect based on role
    navigate(user.role === 'hr' ? '/dashboard' : '/dashboard/candidate');
  }
};

// Using AuthContext in Components
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, company, signOut, isHR, isCandidate } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <p>Company: {company?.name}</p>
      <p>Role: {user?.role}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};`}
                language="javascript"
                id="auth-flow"
              />
            </div>
          </div>
        );

      case "routing":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                ROUTING & NAVIGATION
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow uses React Router v7 for client-side routing with
                role-based access control and protected routes.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                COMPLETE PAGE STRUCTURE
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  <div className="mb-4">
                    <strong>src/pages/</strong>
                  </div>
                  <div className="ml-4 mb-2">
                    <div>
                      <strong>landing-page/</strong>
                    </div>
                    <div className="ml-4">
                      <div>• MainPage.jsx - Homepage with hero section</div>
                      <div>
                        • ServicesPage.jsx - Features and services overview
                      </div>
                      <div>
                        • CompaniesPage.jsx - Company showcase and testimonials
                      </div>
                      <div>
                        • ProjectsPage.jsx - Project portfolio and case studies
                      </div>
                      <div>• DocsPage.jsx - Complete documentation system</div>
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <div>
                      <strong>login/</strong>
                    </div>
                    <div className="ml-4">
                      <div>• SignInPage.jsx - User authentication</div>
                      <div>
                        • SignUpPage.jsx - User registration with role selection
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <div>
                      <strong>hr-dashboards/</strong>
                    </div>
                    <div className="ml-4">
                      <div>• EmployerDashboardPage.jsx - Main HR dashboard</div>
                      <div>
                        • CandidatesPage.jsx - Candidate management board
                      </div>
                      <div>
                        • CandidateProfilePage.jsx - Individual candidate
                        details
                      </div>
                      <div>• JobDetailPage.jsx - Job posting management</div>
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <div>
                      <strong>candidate-dashboards/</strong>
                    </div>
                    <div className="ml-4">
                      <div>
                        • CandidateDashboardPage.jsx - Candidate overview
                      </div>
                      <div>
                        • CandidateJobsPage.jsx - Available job listings
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <div>
                      <strong>flow/</strong>
                    </div>
                    <div className="ml-4">
                      <div>• JobFlowPage.jsx - React Flow job pipeline</div>
                      <div>• JobsPage.jsx - Job management interface</div>
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <div>
                      • DatabaseSeederPage.jsx - Development data seeding tool
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                ROUTE PROTECTION
              </h3>
              <CodeBlock
                code={`// Route protection with role-based access
import ProtectedRoute from '../components/layout/ProtectedRoute';

// HR-only routes
<Route path="/dashboard" element={
  <ProtectedRoute allowedRoles={["hr"]}>
    <AnalyticsDashboard />
  </ProtectedRoute>
} />

<Route path="/jobs" element={
  <ProtectedRoute allowedRoles={["hr"]}>
    <JobsPage />
  </ProtectedRoute>
} />

<Route path="/jobs/:jobId" element={
  <ProtectedRoute allowedRoles={["hr"]}>
    <JobDetailPage />
  </ProtectedRoute>
} />

<Route path="/dashboard/flow/:jobId" element={
  <ProtectedRoute allowedRoles={["hr"]}>
    <FlowDashboard />
  </ProtectedRoute>
} />

// Candidate-only routes
<Route path="/dashboard/candidate" element={
  <ProtectedRoute allowedRoles={["candidate"]}>
    <CandidateDashboardPage />
  </ProtectedRoute>
} />

<Route path="/dashboard/candidate/jobs" element={
  <ProtectedRoute allowedRoles={["candidate"]}>
    <CandidateJobsPage />
  </ProtectedRoute>
} />

// Public routes (redirect if authenticated)
<Route path="/signin" element={
  <PublicRoute>
    <SignInPage />
  </PublicRoute>
} />

<Route path="/signup" element={
  <PublicRoute>
    <SignUpPage />
  </PublicRoute>
} />`}
                language="javascript"
                id="route-protection"
              />

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                NAVIGATION FLOW
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h4 className="text-lg font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-3">
                    HR USER FLOW
                  </h4>
                  <div className="text-sm font-inter text-blue-700 dark:text-blue-200 space-y-2">
                    <div>1. Sign In → Dashboard (Analytics)</div>
                    <div>2. Jobs → Create/Manage Jobs</div>
                    <div>3. Job Detail → Flow Pipeline</div>
                    <div>4. Candidates → Profile Management</div>
                    <div>5. Assessments → Create/Review</div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h4 className="text-lg font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-3">
                    CANDIDATE FLOW
                  </h4>
                  <div className="text-sm font-inter text-green-700 dark:text-green-200 space-y-2">
                    <div>1. Sign In → Candidate Dashboard</div>
                    <div>2. Browse Jobs → Apply</div>
                    <div>3. Take Assessments</div>
                    <div>4. Track Application Status</div>
                    <div>5. View Profile/Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "theme-system":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                THEME SYSTEM
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow includes a comprehensive theme system with dark/light
                mode support, customizable colors, and consistent design tokens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  THEME FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Dark/Light mode toggle</div>
                  <div>• System preference detection</div>
                  <div>• Persistent theme storage</div>
                  <div>• Smooth transitions between themes</div>
                  <div>• TailwindCSS integration</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  DESIGN TOKENS
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Primary color system</div>
                  <div>• Semantic color tokens</div>
                  <div>• Typography scale</div>
                  <div>• Spacing system</div>
                  <div>• Border radius values</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                THEME CONTEXT USAGE
              </h3>
              <CodeBlock
                code={`// Using ThemeContext in components
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-primary-500 dark:text-primary-400">
        Current theme: {theme}
      </h1>
      <button 
        onClick={toggleTheme}
        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
};

// ThemeProvider setup in App.jsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}`}
                language="javascript"
                id="theme-context"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                TAILWINDCSS CONFIGURATION
              </h3>
              <CodeBlock
                code={`// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        // Custom color tokens
      },
      fontFamily: {
        'impact': ['Impact', 'Arial Black', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
};`}
                language="javascript"
                id="tailwind-config"
              />
            </div>
          </div>
        );

      case "msw-setup":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                MSW (MOCK SERVICE WORKER)
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                TalentFlow uses MSW (Mock Service Worker) to provide realistic
                API mocking for development and testing. All API endpoints are
                mocked and integrate with IndexedDB for persistent data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  MSW HANDLERS
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>jobHandlers:</strong> Job CRUD operations with
                    pagination
                  </div>
                  <div>
                    <strong>candidateHandlers:</strong> Candidate management and
                    tracking
                  </div>
                  <div>
                    <strong>assessmentHandlers:</strong> Assessment creation and
                    submission
                  </div>
                  <div>
                    <strong>utils:</strong> Latency simulation and error
                    handling
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Realistic API latency simulation</div>
                  <div>• IndexedDB integration for persistence</div>
                  <div>• Error handling and edge cases</div>
                  <div>• Development debugging tools</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                MSW INITIALIZATION
              </h3>
              <CodeBlock
                code={`// MSW setup in main.jsx
import { initializeMSW } from './mocks/browser.js';

const startApp = async () => {
  // Initialize MSW (only in development)
  await initializeMSW();
  
  // Initialize database (auto-seed if empty)
  await initializeDatabase();
  
  // Render the app
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

startApp();`}
                language="javascript"
                id="msw-init"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                AVAILABLE ENDPOINTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-inter text-gray-700 dark:text-gray-300">
                <div>
                  <strong>Jobs API:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>GET /api/jobs</li>
                    <li>POST /api/jobs</li>
                    <li>PATCH /api/jobs/:id</li>
                    <li>DELETE /api/jobs/:id</li>
                  </ul>
                </div>
                <div>
                  <strong>Candidates API:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>GET /api/candidates</li>
                    <li>POST /api/candidates</li>
                    <li>PATCH /api/candidates/:id</li>
                    <li>GET /api/candidates/:id/timeline</li>
                  </ul>
                </div>
                <div>
                  <strong>Assessments API:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>GET /api/assessments/:jobId</li>
                    <li>PUT /api/assessments/:jobId</li>
                    <li>POST /api/assessments/:jobId/submit</li>
                    <li>GET /api/assessments/:jobId/responses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "jobs-api":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                JOBS API
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Manage job postings with full CRUD operations and advanced
                filtering capabilities.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  LIST JOBS
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-green-600 dark:text-green-400">
                    GET /api/jobs
                  </code>
                </div>
                <CodeBlock
                  code={`// Fetch jobs with pagination and filters
const response = await fetch('/api/jobs?' + new URLSearchParams({
  page: '1',
  pageSize: '10',
  status: 'active',
  search: 'developer'
}));

const { data, pagination } = await response.json();`}
                  language="javascript"
                  id="list-jobs"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  CREATE JOB
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    POST /api/jobs
                  </code>
                </div>
                <CodeBlock
                  code={`const newJob = await fetch('/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  },
  body: JSON.stringify({
    title: 'Senior React Developer',
    description: 'Join our team...',
    location: 'Remote',
    status: 'active'
  })
});`}
                  language="javascript"
                  id="create-job-api"
                />
              </div>
            </div>
          </div>
        );

      case "react-flows":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                REACT FLOW SYSTEM
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                TalentFlow uses React Flow (@xyflow/react) to create interactive
                job pipeline visualizations. The system allows HR users to
                manage candidate flow through customizable hiring stages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  CUSTOM NODES
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>JobNode:</strong> Job information and metadata
                    display
                  </div>
                  <div>
                    <strong>CandidateNode:</strong> Candidate lists grouped by
                    stage
                  </div>
                  <div>
                    <strong>StageTitleNode:</strong> Stage headers with
                    edit/delete actions
                  </div>
                  <div>
                    <strong>AssessmentNode:</strong> Assessment integration
                    points
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  INTERACTIVE FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Drag-and-drop candidate movement</div>
                  <div>• Dynamic stage addition/removal</div>
                  <div>• Real-time position persistence</div>
                  <div>• Context menus and actions</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                FLOW COMPONENT STRUCTURE
              </h3>
              <CodeBlock
                code={`// FlowDashboard.jsx - Main flow component
import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';

const nodeTypes = {
  job: JobNode,
  candidate: CandidateNode,
  stageTitle: StageTitleNode,
  assessment: AssessmentNode
};

const FlowDashboard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Dynamic node generation based on job stages
  const generateNodesAndEdges = (jobData, stagesData) => {
    // Creates nodes for job, stages, and candidates
    // Connects them with appropriate edges
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};`}
                language="javascript"
                id="react-flow-structure"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                FLOW PERSISTENCE
              </h3>
              <CodeBlock
                code={`// Flow data is stored in job.flowData
const flowData = {
  nodes: [
    {
      id: 'job-1',
      type: 'job',
      position: { x: 100, y: 50 },
      data: { job: jobObject }
    },
    {
      id: 'candidates-stage1',
      type: 'candidate',
      position: { x: 300, y: 200 },
      data: { 
        stage: 'stage1',
        candidates: [/* candidate objects */]
      }
    }
  ],
  edges: [
    {
      id: 'job-to-stage1',
      source: 'job-1',
      target: 'candidates-stage1',
      type: 'smoothstep'
    }
  ]
};

// Saved to IndexedDB via updateJobFlow()
await updateJobFlow(jobId, flowData);`}
                language="javascript"
                id="flow-persistence"
              />
            </div>
          </div>
        );

      case "assessment-system":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                ASSESSMENT SYSTEM
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                TalentFlow includes a comprehensive assessment system for
                evaluating candidates. HR users can create custom assessments
                with various question types, and candidates can complete them as
                part of the hiring process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  QUESTION TYPES
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>Short Text:</strong> Single line text input
                  </div>
                  <div>
                    <strong>Numeric:</strong> Number input with validation
                  </div>
                  <div>
                    <strong>Single Choice:</strong> Radio button selection
                  </div>
                  <div>
                    <strong>Multiple Choice:</strong> Checkbox selection
                  </div>
                  <div>
                    <strong>Long Text:</strong> Multi-line text area
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  ASSESSMENT FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Live preview during creation</div>
                  <div>• Automatic scoring for choice questions</div>
                  <div>• Time limit configuration</div>
                  <div>• Retake policies</div>
                  <div>• Response analytics</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                ASSESSMENT BUILDER
              </h3>
              <CodeBlock
                code={`// SimpleAssessmentBuilder.jsx
const SimpleAssessmentBuilder = () => {
  const [assessment, setAssessment] = useState({
    title: "Untitled Assessment",
    description: "",
    sections: [{
      id: "section-1",
      title: "New Section",
      questions: []
    }]
  });

  const addQuestion = (type) => {
    const newQuestion = {
      id: \`q-\${Date.now()}\`,
      type,
      title: "",
      description: "",
      required: false,
      options: type === "single-choice" || type === "multi-choice" 
        ? [{ id: "opt1", text: "Option 1" }, { id: "opt2", text: "Option 2" }]
        : undefined
    };
    
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === 0 ? { ...section, questions: [...section.questions, newQuestion] } : section
      )
    }));
  };

  // Live preview and save functionality
};`}
                language="javascript"
                id="assessment-builder"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                ASSESSMENT SEEDING
              </h3>
              <CodeBlock
                code={`// seedAssessments.js - Pre-built assessment templates
const assessmentTemplates = {
  developer: {
    title: 'Technical Skills Assessment',
    sections: [{
      questions: [
        {
          type: 'single-choice',
          title: 'What is the time complexity of binary search?',
          options: [
            { text: 'O(n)', value: 'O(n)' },
            { text: 'O(log n)', value: 'O(log n)', isCorrect: true },
            { text: 'O(n²)', value: 'O(n²)' },
            { text: 'O(1)', value: 'O(1)' }
          ]
        }
      ]
    }]
  }
};

// Auto-generates assessments for jobs 1-15 with job-specific content`}
                language="javascript"
                id="assessment-seeding"
              />
            </div>
          </div>
        );

      case "candidates-api":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                CANDIDATES API
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Manage candidate profiles, track their progress through hiring
                stages, and maintain comprehensive candidate history.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  LIST CANDIDATES
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-green-600 dark:text-green-400">
                    GET /api/candidates
                  </code>
                </div>
                <CodeBlock
                  code={`// Fetch candidates with filtering
const response = await fetch('/api/candidates?' + new URLSearchParams({
  page: '1',
  pageSize: '10',
  stage: 'applied',
  search: 'developer',
  jobId: '1'
}));

const { data, pagination } = await response.json();`}
                  language="javascript"
                  id="list-candidates"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  CREATE CANDIDATE
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    POST /api/candidates
                  </code>
                </div>
                <CodeBlock
                  code={`const newCandidate = await fetch('/api/candidates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    jobId: 1,
    currentStageId: 'applied',
    profile: {
      skills: ['React', 'Node.js'],
      experience: 3,
      education: 'Computer Science'
    }
  })
});`}
                  language="javascript"
                  id="create-candidate-api"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  UPDATE CANDIDATE STAGE
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-orange-600 dark:text-orange-400">
                    PATCH /api/candidates/:id
                  </code>
                </div>
                <CodeBlock
                  code={`const updatedCandidate = await fetch('/api/candidates/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  },
  body: JSON.stringify({
    currentStageId: 'screen',
    notes: 'Moved to screening stage after initial review'
  })
});`}
                  language="javascript"
                  id="update-candidate-api"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  GET CANDIDATE TIMELINE
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400">
                    GET /api/candidates/:id/timeline
                  </code>
                </div>
                <CodeBlock
                  code={`// Get comprehensive candidate activity timeline
const timeline = await fetch('/api/candidates/1/timeline', {
  headers: {
    'Authorization': 'Bearer your_token'
  }
});

const timelineData = await timeline.json();
// Returns: { candidateId, candidateName, activities: [...] }`}
                  language="javascript"
                  id="candidate-timeline-api"
                />
              </div>
            </div>
          </div>
        );

      case "assessments-api":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                ASSESSMENTS API
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Create, manage, and track assessments for job positions. Handle
                candidate responses and scoring automatically.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  GET ASSESSMENT
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-green-600 dark:text-green-400">
                    GET /api/assessments/:jobId
                  </code>
                </div>
                <CodeBlock
                  code={`// Get assessment for a specific job
const assessment = await fetch('/api/assessments/1', {
  headers: {
    'Authorization': 'Bearer your_token'
  }
});

const assessmentData = await assessment.json();`}
                  language="javascript"
                  id="get-assessment-api"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  CREATE/UPDATE ASSESSMENT
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    PUT /api/assessments/:jobId
                  </code>
                </div>
                <CodeBlock
                  code={`const assessmentData = {
  title: 'Technical Skills Assessment',
  description: 'Evaluate candidate technical abilities',
  sections: [{
    title: 'Programming Skills',
    questions: [{
      type: 'single-choice',
      title: 'What is the time complexity of binary search?',
      options: [
        { text: 'O(n)', value: 'O(n)' },
        { text: 'O(log n)', value: 'O(log n)', isCorrect: true },
        { text: 'O(n²)', value: 'O(n²)' }
      ],
      required: true
    }]
  }],
  settings: {
    timeLimit: 3600, // 1 hour in seconds
    allowRetake: false,
    passingScore: 70
  }
};

const response = await fetch('/api/assessments/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  },
  body: JSON.stringify(assessmentData)
});`}
                  language="javascript"
                  id="create-assessment-api"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  SUBMIT ASSESSMENT RESPONSE
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-orange-600 dark:text-orange-400">
                    POST /api/assessments/:jobId/submit
                  </code>
                </div>
                <CodeBlock
                  code={`const response = {
  candidateId: 1,
  responses: {
    'q1': { questionId: 'q1', value: 'O(log n)' },
    'q2': { questionId: 'q2', value: 'JavaScript' }
  },
  timeTaken: 1800, // 30 minutes in seconds
  startedAt: '2024-01-15T10:00:00Z'
};

const result = await fetch('/api/assessments/1/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  },
  body: JSON.stringify(response)
});

// Returns: { assessmentId, candidateId, score, passed, completedAt }`}
                  language="javascript"
                  id="submit-assessment-api"
                />
              </div>

              <div>
                <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mb-4">
                  GET ASSESSMENT RESPONSES
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400">
                    GET /api/assessments/:jobId/responses
                  </code>
                </div>
                <CodeBlock
                  code={`// Get all responses for an assessment
const responses = await fetch('/api/assessments/1/responses?' + new URLSearchParams({
  page: '1',
  pageSize: '20',
  sortBy: 'score',
  sortOrder: 'desc'
}), {
  headers: {
    'Authorization': 'Bearer your_token'
  }
});

const responseData = await responses.json();`}
                  language="javascript"
                  id="get-responses-api"
                />
              </div>
            </div>
          </div>
        );

      case "database-operations":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                DATABASE OPERATIONS
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow uses IndexedDB with Dexie.js for client-side data
                storage. All database operations are handled through helper
                functions and integrate with MSW for API simulation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  CORE OPERATIONS
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>dbHelpers:</strong> Main database interface with
                    CRUD operations
                  </div>
                  <div>
                    <strong>initializeDatabase:</strong> Auto-seeding and schema
                    setup
                  </div>
                  <div>
                    <strong>clearAllData:</strong> Reset database for
                    development
                  </div>
                  <div>
                    <strong>Session Management:</strong> User authentication and
                    tokens
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  DATA RELATIONSHIPS
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>
                    <strong>Companies → Users:</strong> One-to-many relationship
                  </div>
                  <div>
                    <strong>Jobs → Stages:</strong> Hierarchical stage
                    management
                  </div>
                  <div>
                    <strong>Candidates → History:</strong> Timeline tracking
                  </div>
                  <div>
                    <strong>Assessments → Responses:</strong> Question-answer
                    pairs
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                DATABASE HELPER FUNCTIONS
              </h3>
              <CodeBlock
                code={`// Core database operations
import { dbHelpers } from '../lib/database';

// User operations
const user = await dbHelpers.createUser(userData);
const user = await dbHelpers.getUserById(id);
const user = await dbHelpers.getUserByEmail(email);
await dbHelpers.updateUser(id, updates);

// Company operations
const company = await dbHelpers.createCompany(companyData);
const company = await dbHelpers.getCompanyById(id);
const company = await dbHelpers.getCompanyByName(name);

// Job operations
const job = await dbHelpers.createJob(jobData);
const jobs = await dbHelpers.getAllJobs(filters);
await dbHelpers.updateJob(id, updates);
await dbHelpers.deleteJob(id);

// Candidate operations
const candidate = await dbHelpers.createCandidate(candidateData);
const candidates = await dbHelpers.getAllCandidates(filters);
await dbHelpers.updateCandidate(id, updates);
await dbHelpers.moveCandidateToStage(candidateId, stageId, note);

// Assessment operations
const assessment = await dbHelpers.createAssessment(assessmentData);
const responses = await dbHelpers.getAssessmentResponses(assessmentId);
await dbHelpers.submitAssessmentResponse(responseData);

// Timeline operations
await dbHelpers.addTimelineEntry(entryData);
const timeline = await dbHelpers.getCandidateTimeline(candidateId);`}
                language="javascript"
                id="db-operations"
              />
            </div>
          </div>
        );

      case "authentication-api":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                AUTHENTICATION API
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow implements a complete authentication system with
                role-based access control, session management, and user
                profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  USER ROLES
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>HR:</strong> Full access to all features, job
                    management, candidate tracking
                  </div>
                  <div>
                    <strong>Candidate:</strong> Limited access to job
                    applications and assessments
                  </div>
                  <div>
                    <strong>Company-based:</strong> Users belong to companies
                    with isolated data
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  SESSION MANAGEMENT
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>
                    <strong>Token-based:</strong> Secure session tokens stored
                    in localStorage
                  </div>
                  <div>
                    <strong>Auto-renewal:</strong> Sessions extend on activity
                  </div>
                  <div>
                    <strong>Role validation:</strong> Route protection based on
                    user roles
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                AUTHENTICATION CONTEXT
              </h3>
              <CodeBlock
                code={`// Using the AuthContext in components
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { 
    user, 
    company, 
    signIn, 
    signOut, 
    isAuthenticated, 
    isHR, 
    isCandidate 
  } = useAuth();

  // Check authentication status
  if (!isAuthenticated()) {
    return <LoginForm />;
  }

  // Role-based rendering
  if (isHR()) {
    return <HRDashboard />;
  }

  if (isCandidate()) {
    return <CandidateDashboard />;
  }

  return <div>Loading...</div>;
};

// Sign in functionality
const handleSignIn = async (email, password) => {
  const result = await signIn(email, password);
  if (result.success) {
    // Redirect based on role
    navigate(user.role === 'hr' ? '/dashboard' : '/dashboard/candidate');
  } else {
    setError(result.error);
  }
};`}
                language="javascript"
                id="auth-context"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                PROTECTED ROUTES
              </h3>
              <CodeBlock
                code={`// Route protection with role-based access
import ProtectedRoute from '../components/layout/ProtectedRoute';

// HR-only routes
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute allowedRoles={["hr"]}>
      <AnalyticsDashboard />
    </ProtectedRoute>
  } 
/>

// Candidate-only routes
<Route 
  path="/dashboard/candidate" 
  element={
    <ProtectedRoute allowedRoles={["candidate"]}>
      <CandidateDashboard />
    </ProtectedRoute>
  } 
/>

// Public routes (redirect if authenticated)
<Route 
  path="/signin" 
  element={
    <PublicRoute>
      <SignInPage />
    </PublicRoute>
  } 
/>`}
                language="javascript"
                id="protected-routes"
              />
            </div>
          </div>
        );

      case "api-client":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                API CLIENT
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow includes a comprehensive API client for interacting
                with all endpoints. The client handles authentication, error
                management, and request/response transformation.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                API CLIENT USAGE
              </h3>
              <CodeBlock
                code={`// Using the API client
import { APIClient } from '../mocks/apiClient';

const apiClient = new APIClient({
  baseURL: '/api',
  timeout: 10000,
  retries: 3
});

// Jobs API
const jobs = await apiClient.jobs.getAll({ page: 1, pageSize: 10 });
const job = await apiClient.jobs.getById(1);
const newJob = await apiClient.jobs.create(jobData);
await apiClient.jobs.update(1, updateData);
await apiClient.jobs.delete(1);

// Candidates API
const candidates = await apiClient.candidates.getAll({ stage: 'applied' });
const candidate = await apiClient.candidates.getById(1);
const timeline = await apiClient.candidates.getTimeline(1);
await apiClient.candidates.update(1, { currentStageId: 'screen' });

// Assessments API
const assessment = await apiClient.assessments.getByJobId(1);
await apiClient.assessments.update(1, assessmentData);
const result = await apiClient.assessments.submit(1, responseData);
const responses = await apiClient.assessments.getResponses(1);`}
                language="javascript"
                id="api-client-usage"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  CLIENT FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Automatic authentication header injection</div>
                  <div>• Request/response interceptors</div>
                  <div>• Error handling and retry logic</div>
                  <div>• TypeScript support with type definitions</div>
                  <div>• Request/response logging for debugging</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  ERROR HANDLING
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Network error detection</div>
                  <div>• HTTP status code handling</div>
                  <div>• Authentication error recovery</div>
                  <div>• User-friendly error messages</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "job-management":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                JOB MANAGEMENT
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Comprehensive job posting and management system with advanced
                filtering, status tracking, and pipeline integration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  JOB CREATION
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Rich text job descriptions</div>
                  <div>• Location and remote options</div>
                  <div>• Salary range specification</div>
                  <div>• Required skills and qualifications</div>
                  <div>• Company branding and logos</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  JOB LIFECYCLE
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Draft → Active → Paused → Closed</div>
                  <div>• Automatic expiration dates</div>
                  <div>• Application deadline tracking</div>
                  <div>• Candidate limit management</div>
                  <div>• Job template system</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                JOB MANAGEMENT FEATURES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Advanced Filtering
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• Filter by status, location, department</li>
                    <li>• Search by title, description, skills</li>
                    <li>• Sort by creation date, application count</li>
                    <li>• Custom date range filtering</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Job Analytics</h4>
                  <ul className="text-sm space-y-2">
                    <li>• Application count and conversion rates</li>
                    <li>• Time-to-hire metrics</li>
                    <li>• Source tracking (where candidates found job)</li>
                    <li>• Performance comparisons</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                JOB CREATION EXAMPLE
              </h3>
              <CodeBlock
                code={`// Creating a new job posting
const newJob = await dbHelpers.createJob({
  companyId: 1,
  title: 'Senior React Developer',
  description: \`We are looking for an experienced React developer to join our team...
  
  ## Responsibilities:
  - Develop and maintain React applications
  - Collaborate with design and backend teams
  - Write clean, maintainable code
  - Participate in code reviews
  
  ## Requirements:
  - 5+ years React experience
  - TypeScript proficiency
  - Experience with Redux/Zustand
  - Strong communication skills\`,
  location: 'San Francisco, CA',
  remoteAllowed: true,
  salaryRange: {
    min: 120000,
    max: 180000,
    currency: 'USD'
  },
  employmentType: 'full-time',
  experienceLevel: 'senior',
  skills: ['React', 'TypeScript', 'Redux', 'Node.js'],
  status: 'active',
  createdById: 1,
  applicationDeadline: '2024-02-15',
  maxApplications: 100
});

// Job stages are automatically created
const defaultStages = [
  { name: 'Applied', order: 1 },
  { name: 'Screening', order: 2 },
  { name: 'Interview', order: 3 },
  { name: 'Offer', order: 4 },
  { name: 'Hired', order: 5 }
];`}
                language="javascript"
                id="job-creation"
              />
            </div>
          </div>
        );

      case "candidate-tracking":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                CANDIDATE TRACKING
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Real-time candidate progress tracking through customizable
                hiring pipelines with automated stage transitions and activity
                logging.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  STAGE MANAGEMENT
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Customizable pipeline stages</div>
                  <div>• Drag-and-drop candidate movement</div>
                  <div>• Bulk stage transitions</div>
                  <div>• Stage-specific actions and requirements</div>
                  <div>• Automatic stage progression rules</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  ACTIVITY TRACKING
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Real-time activity feeds</div>
                  <div>• Email communication tracking</div>
                  <div>• Interview scheduling and notes</div>
                  <div>• Assessment completion tracking</div>
                  <div>• Automated status updates</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                CANDIDATE MOVEMENT EXAMPLE
              </h3>
              <CodeBlock
                code={`// Moving a candidate to next stage
const moveCandidate = async (candidateId, newStageId, note) => {
  const candidate = await dbHelpers.getCandidateById(candidateId);
  const oldStageId = candidate.currentStageId;
  
  // Update candidate stage
  await dbHelpers.updateCandidate(candidateId, {
    currentStageId: newStageId,
    updatedAt: new Date().toISOString()
  });
  
  // Add to history
  await dbHelpers.createCandidateHistory({
    candidateId,
    fromStageId: oldStageId,
    toStageId: newStageId,
    changedBy: currentUser.id,
    changedAt: new Date().toISOString(),
    note: note || 'Moved to next stage'
  });
  
  // Add timeline entry
  await dbHelpers.addTimelineEntry({
    candidateId,
    candidateName: candidate.name,
    action: 'stage_changed',
    actionType: 'transition',
    description: \`Moved from \${oldStageId} to \${newStageId}\`,
    fromStage: oldStageId,
    toStage: newStageId,
    timestamp: new Date().toISOString(),
    hrUserId: currentUser.id,
    hrUserName: currentUser.firstName + ' ' + currentUser.lastName,
    jobId: candidate.jobId,
    jobTitle: job.title
  });
};

// Bulk stage transitions
const bulkMoveCandidates = async (candidateIds, newStageId, note) => {
  const promises = candidateIds.map(id => 
    moveCandidate(id, newStageId, note)
  );
  await Promise.all(promises);
};`}
                language="javascript"
                id="candidate-tracking"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                TIMELINE SYSTEM
              </h3>
              <CodeBlock
                code={`// Timeline entry structure
const timelineEntry = {
  candidateId: 1,
  candidateName: 'Jane Smith',
  action: 'assessment_completed',
  actionType: 'milestone',
  description: 'Completed Technical Skills Assessment with score 85%',
  fromStage: 'screening',
  toStage: 'screening',
  timestamp: '2024-01-15T14:30:00Z',
  hrUserId: 2,
  hrUserName: 'John Doe',
  jobId: 1,
  jobTitle: 'Senior React Developer',
  metadata: {
    assessmentId: 1,
    score: 85,
    timeTaken: 1800,
    passed: true
  }
};

// Getting candidate timeline
const getCandidateTimeline = async (candidateId) => {
  const timeline = await dbHelpers.getCandidateTimeline(candidateId);
  return timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Timeline event types
const eventTypes = {
  'stage_changed': 'Stage Transition',
  'assessment_completed': 'Assessment Completed',
  'interview_scheduled': 'Interview Scheduled',
  'interview_completed': 'Interview Completed',
  'note_added': 'Note Added',
  'email_sent': 'Email Sent',
  'application_received': 'Application Received',
  'offer_extended': 'Offer Extended',
  'offer_accepted': 'Offer Accepted',
  'offer_declined': 'Offer Declined'
};`}
                language="javascript"
                id="timeline-system"
              />
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                ANALYTICS DASHBOARD
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Comprehensive analytics and reporting system providing insights
                into hiring performance, candidate flow, and recruitment
                metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  KEY METRICS
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Time-to-hire averages</div>
                  <div>• Application conversion rates</div>
                  <div>• Stage-wise candidate distribution</div>
                  <div>• Source effectiveness analysis</div>
                  <div>• Assessment completion rates</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  VISUALIZATION
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Interactive charts and graphs</div>
                  <div>• Real-time data updates</div>
                  <div>• Customizable date ranges</div>
                  <div>• Exportable reports</div>
                  <div>• Comparative analysis tools</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                ANALYTICS COMPONENTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Dashboard Widgets
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• Total applications this month</li>
                    <li>• Active job postings count</li>
                    <li>• Candidates in interview stage</li>
                    <li>• Average time per stage</li>
                    <li>• Top performing job sources</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Detailed Reports
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• Candidate pipeline analysis</li>
                    <li>• Hiring funnel conversion rates</li>
                    <li>• Assessment performance metrics</li>
                    <li>• Interview feedback trends</li>
                    <li>• Cost-per-hire calculations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                ANALYTICS DATA STRUCTURE
              </h3>
              <CodeBlock
                code={`// Analytics data calculation
const calculateAnalytics = async (companyId, dateRange) => {
  const { startDate, endDate } = dateRange;
  
  // Get all candidates in date range
  const candidates = await dbHelpers.getAllCandidates({
    companyId,
    appliedDate: { $gte: startDate, $lte: endDate }
  });
  
  // Calculate metrics
  const metrics = {
    totalApplications: candidates.length,
    hiredCount: candidates.filter(c => c.currentStageId === 'hired').length,
    rejectedCount: candidates.filter(c => c.currentStageId === 'rejected').length,
    averageTimeToHire: calculateAverageTimeToHire(candidates),
    stageDistribution: calculateStageDistribution(candidates),
    sourceEffectiveness: calculateSourceEffectiveness(candidates),
    assessmentMetrics: await calculateAssessmentMetrics(candidates)
  };
  
  return metrics;
};

// Stage distribution calculation
const calculateStageDistribution = (candidates) => {
  const stages = ['applied', 'screen', 'interview', 'offer', 'hired', 'rejected'];
  return stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter(c => c.currentStageId === stage).length;
    return acc;
  }, {});
};

// Time to hire calculation
const calculateAverageTimeToHire = (candidates) => {
  const hiredCandidates = candidates.filter(c => c.currentStageId === 'hired');
  if (hiredCandidates.length === 0) return 0;
  
  const totalDays = hiredCandidates.reduce((sum, candidate) => {
    const appliedDate = new Date(candidate.appliedDate);
    const hiredDate = new Date(candidate.updatedAt);
    return sum + Math.ceil((hiredDate - appliedDate) / (1000 * 60 * 60 * 24));
  }, 0);
  
  return Math.round(totalDays / hiredCandidates.length);
};`}
                language="javascript"
                id="analytics-structure"
              />
            </div>
          </div>
        );

      case "candidate-management":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                CANDIDATE MANAGEMENT
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                Complete candidate lifecycle management including profile
                management, communication tracking, notes system, and
                comprehensive timeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  PROFILE MANAGEMENT
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Comprehensive candidate profiles</div>
                  <div>• Resume and document storage</div>
                  <div>• Skills and experience tracking</div>
                  <div>• Contact information management</div>
                  <div>• Portfolio and work samples</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  NOTES & COMMUNICATION
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Rich text notes with formatting</div>
                  <div>• Email communication tracking</div>
                  <div>• Interview feedback and scores</div>
                  <div>• Internal team collaboration</div>
                  <div>• Note templates and tagging</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                CANDIDATE NOTES SYSTEM
              </h3>
              <CodeBlock
                code={`// Creating candidate notes
const addCandidateNote = async (candidateId, noteData) => {
  const note = await dbHelpers.createCandidateNote({
    candidateId,
    authorId: currentUser.id,
    text: noteData.text,
    mentions: noteData.mentions || [],
    type: noteData.type || 'general', // 'interview', 'screening', 'general'
    tags: noteData.tags || [],
    isPrivate: noteData.isPrivate || false,
    createdAt: new Date().toISOString()
  });
  
  // Add to timeline
  await dbHelpers.addTimelineEntry({
    candidateId,
    candidateName: candidate.name,
    action: 'note_added',
    actionType: 'communication',
    description: \`Note added: "\${noteData.text.substring(0, 50)}..."\`,
    timestamp: new Date().toISOString(),
    hrUserId: currentUser.id,
    hrUserName: currentUser.firstName + ' ' + currentUser.lastName,
    jobId: candidate.jobId,
    metadata: { noteId: note.id, noteType: noteData.type }
  });
  
  return note;
};

// Note types and templates
const noteTypes = {
  'interview': {
    title: 'Interview Notes',
    template: \`## Interview Notes
**Date:** [DATE]
**Interviewer:** [NAME]
**Duration:** [DURATION]

### Technical Assessment
[Notes about technical skills]

### Communication Skills
[Notes about communication]

### Overall Impression
[Overall assessment]

### Recommendation
[Recommendation]\`
  },
  'screening': {
    title: 'Phone Screening',
    template: \`## Phone Screening Notes
**Date:** [DATE]
**Duration:** [DURATION]

### Key Points Discussed
- [Point 1]
- [Point 2]

### Questions Asked
[Questions and answers]

### Next Steps
[Next steps]\`
  },
  'general': {
    title: 'General Notes',
    template: \`## Notes
[Your notes here]\`
  }
};`}
                language="javascript"
                id="notes-system"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                TIMELINE INTEGRATION
              </h3>
              <CodeBlock
                code={`// Comprehensive timeline for candidate
const getCandidateCompleteTimeline = async (candidateId) => {
  const candidate = await dbHelpers.getCandidateById(candidateId);
  const timeline = await dbHelpers.getCandidateTimeline(candidateId);
  const notes = await dbHelpers.getCandidateNotes(candidateId);
  const history = await dbHelpers.getCandidateHistory(candidateId);
  
  // Combine all activities into a single timeline
  const allActivities = [
    ...timeline.map(item => ({ ...item, type: 'timeline' })),
    ...notes.map(note => ({
      type: 'note',
      timestamp: note.createdAt,
      action: 'note_added',
      description: \`Note: \${note.text.substring(0, 100)}...\`,
      author: note.authorId,
      metadata: { noteId: note.id, noteType: note.type }
    })),
    ...history.map(change => ({
      type: 'history',
      timestamp: change.changedAt,
      action: 'stage_changed',
      description: \`Stage changed: \${change.fromStageId} → \${change.toStageId}\`,
      author: change.changedBy,
      metadata: { fromStage: change.fromStageId, toStage: change.toStageId, note: change.note }
    }))
  ];
  
  // Sort by timestamp (newest first)
  return allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Timeline activity types
const timelineActivityTypes = {
  'application_received': {
    icon: '📝',
    color: 'blue',
    description: 'Application received'
  },
  'stage_changed': {
    icon: '🔄',
    color: 'green',
    description: 'Stage changed'
  },
  'note_added': {
    icon: '📝',
    color: 'gray',
    description: 'Note added'
  },
  'assessment_completed': {
    icon: '✅',
    color: 'purple',
    description: 'Assessment completed'
  },
  'interview_scheduled': {
    icon: '📅',
    color: 'orange',
    description: 'Interview scheduled'
  },
  'email_sent': {
    icon: '📧',
    color: 'blue',
    description: 'Email sent'
  },
  'offer_extended': {
    icon: '🎉',
    color: 'green',
    description: 'Offer extended'
  }
};`}
                language="javascript"
                id="timeline-integration"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                CANDIDATE SEARCH & FILTERING
              </h3>
              <CodeBlock
                code={`// Advanced candidate search
const searchCandidates = async (filters) => {
  const {
    search,
    stage,
    jobId,
    skills,
    experience,
    location,
    dateRange,
    sortBy,
    sortOrder
  } = filters;
  
  let query = db.candidates.toCollection();
  
  // Apply filters
  if (search) {
    query = query.filter(candidate => 
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (stage) {
    query = query.filter(candidate => candidate.currentStageId === stage);
  }
  
  if (jobId) {
    query = query.filter(candidate => candidate.jobId === jobId);
  }
  
  if (skills && skills.length > 0) {
    query = query.filter(candidate => 
      candidate.profile?.skills?.some(skill => skills.includes(skill))
    );
  }
  
  if (experience) {
    query = query.filter(candidate => 
      candidate.profile?.experience >= experience
    );
  }
  
  // Apply sorting
  if (sortBy) {
    query = query.sortBy(sortBy);
  }
  
  return await query.toArray();
};

// Usage example
const candidates = await searchCandidates({
  search: 'react developer',
  stage: 'interview',
  skills: ['React', 'TypeScript'],
  experience: 3,
  sortBy: 'appliedDate',
  sortOrder: 'desc'
});`}
                language="javascript"
                id="candidate-search"
              />
            </div>
          </div>
        );

      case "seeding-data":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                DATA SEEDING
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200 mb-8">
                TalentFlow includes comprehensive data seeding to populate the
                database with realistic sample data for development and testing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  SEEDING COMPONENTS
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>
                    <strong>Companies:</strong> 1000 sample companies with
                    domains
                  </div>
                  <div>
                    <strong>Users:</strong> HR and candidate accounts
                  </div>
                  <div>
                    <strong>Jobs:</strong> 25 diverse job postings
                  </div>
                  <div>
                    <strong>Candidates:</strong> Realistic candidate profiles
                  </div>
                  <div>
                    <strong>Assessments:</strong> 15 Job-specific assessment
                    templates
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  SEEDING FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Auto-seeding on first launch</div>
                  <div>• Realistic data relationships</div>
                  <div>• Timeline and history generation</div>
                  <div>• Assessment templates by job type</div>
                  <div>• Debug utilities for re-seeding</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                SEEDING PROCESS
              </h3>
              <CodeBlock
                code={`// seedDatabase.js - Main seeding function
export const seedDatabase = async () => {
  try {
    // Clear existing data
    await clearDatabase();
    
    // Seed in order of dependencies
    const companyIds = await seedCompanies();
    const userIds = await seedUsers(companyIds);
    const jobIds = await seedJobs(companyIds, userIds);
    await seedJobStages(jobIds);
    const candidateIds = await seedCandidates(companyIds, jobIds, userIds);
    await seedCandidateHistory(candidateIds, userIds);
    await seedTimeline(candidateIds);
    await seedAssessments();
    
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// Auto-initialization in main.jsx
const startApp = async () => {
  await initializeMSW();
  await initializeDatabase(); // Auto-seeds if empty
  // ... render app
};`}
                language="javascript"
                id="seeding-process"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                DEBUG UTILITIES
              </h3>
              <CodeBlock
                code={`// Available in browser console for debugging
window.forceReSeedDatabase = forceReSeedDatabase;
window.forceReSeedAssessments = forceReSeedAssessments;

// Usage in browser console:
// forceReSeedDatabase() - Clear and re-seed all data
// forceReSeedAssessments() - Re-seed only assessments

// Database seeder page at /seed-database
// Provides UI for manual seeding operations`}
                language="javascript"
                id="debug-utilities"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                SAMPLE DATA STRUCTURE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-inter text-gray-700 dark:text-gray-300">
                <div>
                  <strong>Companies (3):</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>TechCorp Inc</li>
                    <li>StartupHub</li>
                    <li>DataFlow Solutions</li>
                  </ul>
                </div>
                <div>
                  <strong>Job Categories:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>Software Engineering</li>
                    <li>Product Management</li>
                    <li>Design & UX</li>
                    <li>Sales & Marketing</li>
                  </ul>
                </div>
                <div>
                  <strong>Assessment Types:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>Technical Skills</li>
                    <li>Leadership & Management</li>
                    <li>Design Fundamentals</li>
                    <li>Sales & Communication</li>
                  </ul>
                </div>
                <div>
                  <strong>User Roles:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>HR Managers</li>
                    <li>Hiring Managers</li>
                    <li>Candidates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "component-structure":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                COMPONENT STRUCTURE
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow follows a well-organized component architecture with
                clear separation of concerns, reusable components, and
                maintainable code structure.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                COMPLETE COMPONENT ARCHITECTURE
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  <div className="mb-4">
                    <strong>src/components/</strong>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Core Components:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• Header.jsx - Main navigation header</div>
                      <div>• Footer.jsx - Site footer with links</div>
                      <div>• Logo.jsx - Company logo component</div>
                      <div>• ThemeToggle.jsx - Dark/light mode toggle</div>
                      <div>• ProtectedRoute.jsx - Route protection wrapper</div>
                      <div>• Toast.jsx - Notification system</div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Dashboard Components:</strong>
                    </div>
                    <div className="ml-4">
                      <div>
                        • AnalyticsDashboard.jsx - Main analytics interface
                      </div>
                      <div>• EmployerDashboard.jsx - HR dashboard layout</div>
                      <div>• CandidateDashboard.jsx - Candidate dashboard</div>
                      <div>• DashboardSidebar.jsx - Navigation sidebar</div>
                      <div>
                        • AuthenticatedHeader.jsx - Authenticated user header
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Job Management:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• JobModal.jsx - Job creation/editing modal</div>
                      <div>
                        • CandidateJobsBoard.jsx - Job listings for candidates
                      </div>
                      <div>
                        • CandidatesBoard.jsx - Candidate management board
                      </div>
                      <div>• KanbanCard.jsx - Individual candidate cards</div>
                      <div>• KanbanColumn.jsx - Stage columns</div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>React Flow System:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• FlowDashboard.jsx - Main flow interface</div>
                      <div>• flow/JobNode.jsx - Job information nodes</div>
                      <div>• flow/CandidateNode.jsx - Candidate list nodes</div>
                      <div>• flow/StageTitleNode.jsx - Stage header nodes</div>
                      <div>
                        • flow/AssessmentNode.jsx - Assessment integration nodes
                      </div>
                      <div>
                        • flow/AddStageEdge.jsx - Custom edge components
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Assessment System:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• Assessment.jsx - Assessment display component</div>
                      <div>
                        • AssessmentBuilder.jsx - Assessment creation interface
                      </div>
                      <div>
                        • AssessmentModal.jsx - Assessment editing modal
                      </div>
                      <div>• AssessmentPreview.jsx - Assessment preview</div>
                      <div>• AssessmentSubmit.jsx - Assessment submission</div>
                      <div>
                        • AssessmentResponsesViewer.jsx - Response analysis
                      </div>
                      <div>• QuestionEditor.jsx - Question creation editor</div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Profile & User Management:</strong>
                    </div>
                    <div className="ml-4">
                      <div>
                        • CandidateProfile.jsx - Candidate profile display
                      </div>
                      <div>
                        • CandidateSignUpForm.jsx - Candidate registration
                      </div>
                      <div>• EmployerSignUpForm.jsx - HR registration</div>
                      <div>• ProfileTimeline.jsx - User activity timeline</div>
                      <div>• ResumeSidebar.jsx - Resume information panel</div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Landing Page Components:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• HeroSection.jsx - Main hero banner</div>
                      <div>• ServicesHeroSection.jsx - Services page hero</div>
                      <div>
                        • CompaniesHeroSection.jsx - Companies page hero
                      </div>
                      <div>• ProjectsHeroSection.jsx - Projects page hero</div>
                      <div>• ServicesSection.jsx - Services overview</div>
                      <div>• CompaniesSection.jsx - Company showcase</div>
                      <div>• ProjectsSection.jsx - Project portfolio</div>
                      <div>• TeamSection.jsx - Team member display</div>
                      <div>• TestimonialsSection.jsx - Client testimonials</div>
                      <div>• ProcessSection.jsx - Process explanation</div>
                      <div>• AwardsSection.jsx - Awards and recognition</div>
                      <div>
                        • BrandStrategySection.jsx - Brand strategy info
                      </div>
                      <div>• ServiceImagesSection.jsx - Service visuals</div>
                      <div>• ProjectsStatsSection.jsx - Project statistics</div>
                      <div>
                        • ProjectsCTASection.jsx - Call-to-action sections
                      </div>
                      <div>• NotesSection.jsx - Notes and comments</div>
                      <div>• Timeline.jsx - Project timeline display</div>
                      <div>• SignUpOptions.jsx - Registration options</div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Modal Components:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• StageModal.jsx - Stage creation/editing</div>
                      <div>• NotesModal.jsx - Notes creation modal</div>
                    </div>
                  </div>

                  <div className="ml-4 mb-4">
                    <div>
                      <strong>Development Tools:</strong>
                    </div>
                    <div className="ml-4">
                      <div>• MSWTester.jsx - API testing interface</div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                COMPONENT PATTERNS & CONVENTIONS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-3">
                    Component Organization
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• Feature-based folder structure</li>
                    <li>• Reusable UI components in /ui</li>
                    <li>• Page-specific components in /pages</li>
                    <li>• Shared components in root /components</li>
                    <li>• Clear naming conventions</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-3">Code Standards</h4>
                  <ul className="text-sm space-y-2">
                    <li>• Functional components with hooks</li>
                    <li>• Props destructuring and validation</li>
                    <li>• Consistent error handling</li>
                    <li>• Loading states and UX patterns</li>
                    <li>• Accessibility considerations</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                  COMPONENT STRUCTURE EXAMPLE
                </h3>
                <CodeBlock
                  code={`// Example component structure
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';

const CandidateProfile = ({ candidateId, onUpdate }) => {
  // State management
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Context hooks
  const { user, isHR } = useAuth();
  
  // Effects
  useEffect(() => {
    loadCandidate();
  }, [candidateId]);
  
  // Event handlers
  const handleUpdate = async (updates) => {
    try {
      setLoading(true);
      await updateCandidate(candidateId, updates);
      setCandidate(prev => ({ ...prev, ...updates }));
      onUpdate?.(updates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Loading state
  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }
  
  // Error state
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  // Main render
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold">{candidate.name}</h2>
        <p className="text-gray-600">{candidate.email}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Current Stage:</label>
            <span className="ml-2 px-2 py-1 bg-blue-100 rounded">
              {candidate.currentStageId}
            </span>
          </div>
          
          {isHR() && (
            <div className="flex gap-2">
              <Button onClick={() => handleUpdate({ currentStageId: 'interview' })}>
                Move to Interview
              </Button>
              <Button variant="outline" onClick={() => handleUpdate({ status: 'rejected' })}>
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateProfile;`}
                  language="javascript"
                  id="component-structure-example"
                />
              </div>
            </div>
          </div>
        );

      case "ui-components":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                UI COMPONENT LIBRARY
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow includes a comprehensive set of reusable UI
                components built with TailwindCSS and designed for consistency
                and accessibility.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                AVAILABLE UI COMPONENTS
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  <div className="mb-4">
                    <strong>src/components/ui/</strong>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold mb-2">Form Components:</div>
                      <div className="ml-4 space-y-1">
                        <div>• Button.jsx - Multiple variants and sizes</div>
                        <div>• Input.jsx - Text input with validation</div>
                        <div>• Label.jsx - Form labels</div>
                        <div>• Textarea.jsx - Multi-line text input</div>
                        <div>• Select.jsx - Dropdown selection</div>
                        <div>• Checkbox.jsx - Checkbox input</div>
                        <div>• RadioGroup.jsx - Radio button groups</div>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2">
                        Layout Components:
                      </div>
                      <div className="ml-4 space-y-1">
                        <div>• Card.jsx - Content containers</div>
                        <div>• Dialog.jsx - Modal dialogs</div>
                        <div>• Tabs.jsx - Tabbed interfaces</div>
                        <div>• Separator.jsx - Visual dividers</div>
                        <div>• ScrollArea.jsx - Custom scrollbars</div>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2">
                        Feedback Components:
                      </div>
                      <div className="ml-4 space-y-1">
                        <div>• Badge.jsx - Status indicators</div>
                        <div>• Progress.jsx - Progress bars</div>
                        <div>• Alert.jsx - Alert messages</div>
                        <div>• Skeleton.jsx - Loading placeholders</div>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2">
                        Navigation Components:
                      </div>
                      <div className="ml-4 space-y-1">
                        <div>• DropdownMenu.jsx - Dropdown menus</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                    COMPONENT FEATURES
                  </h3>
                  <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                    <div>• Consistent design system</div>
                    <div>• Dark mode support</div>
                    <div>• Accessibility compliant</div>
                    <div>• TypeScript ready</div>
                    <div>• Customizable variants</div>
                    <div>• Responsive design</div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                    USAGE PATTERNS
                  </h3>
                  <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                    <div>• Forwarded refs for form libraries</div>
                    <div>• Polymorphic component support</div>
                    <div>• Compound component patterns</div>
                    <div>• CSS-in-JS with TailwindCSS</div>
                    <div>• Consistent API design</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                  UI COMPONENT EXAMPLES
                </h3>
                <CodeBlock
                  code={`// Button component usage
import { Button } from '../ui/button';

// Different button variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">📧</Button>

// Card component usage
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';

<Card className="w-96">
  <CardHeader>
    <h3 className="text-lg font-semibold">Job Posting</h3>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600">Senior React Developer position...</p>
  </CardContent>
  <CardFooter>
    <Button>Apply Now</Button>
  </CardFooter>
</Card>

// Form components
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

<div className="space-y-4">
  <div>
    <Label htmlFor="name">Full Name</Label>
    <Input id="name" placeholder="Enter your name" />
  </div>
  
  <div>
    <Label htmlFor="role">Role</Label>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hr">HR Manager</SelectItem>
        <SelectItem value="candidate">Candidate</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

// Badge and Progress components
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

<div className="space-y-4">
  <div className="flex gap-2">
    <Badge variant="default">Active</Badge>
    <Badge variant="secondary">Pending</Badge>
    <Badge variant="destructive">Rejected</Badge>
  </div>
  
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>Application Progress</span>
      <span>75%</span>
    </div>
    <Progress value={75} className="w-full" />
  </div>
</div>`}
                  language="javascript"
                  id="ui-components-examples"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                  COMPONENT CUSTOMIZATION
                </h3>
                <CodeBlock
                  code={`// Customizing components with TailwindCSS
import { cn } from '../lib/utils';

// Extending base component styles
const CustomButton = ({ className, variant = "default", ...props }) => {
  return (
    <Button
      className={cn(
        "transition-all duration-200 hover:scale-105",
        variant === "primary" && "bg-gradient-to-r from-blue-500 to-purple-600",
        className
      )}
      {...props}
    />
  );
};

// Creating compound components
const JobCard = ({ children, className, ...props }) => (
  <Card className={cn("hover:shadow-lg transition-shadow", className)} {...props}>
    {children}
  </Card>
);

const JobCardHeader = ({ children, className, ...props }) => (
  <CardHeader className={cn("pb-3", className)} {...props}>
    {children}
  </CardHeader>
);

const JobCardContent = ({ children, className, ...props }) => (
  <CardContent className={cn("pt-0", className)} {...props}>
    {children}
  </CardContent>
);

// Usage
<JobCard>
  <JobCardHeader>
    <h3>Senior React Developer</h3>
    <Badge>Remote</Badge>
  </JobCardHeader>
  <JobCardContent>
    <p>Join our team of talented developers...</p>
    <CustomButton variant="primary">Apply Now</CustomButton>
  </JobCardContent>
</JobCard>`}
                  language="javascript"
                  id="component-customization"
                />
              </div>
            </div>
          </div>
        );

      case "artificial-latency":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                ARTIFICIAL LATENCY
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow includes sophisticated artificial latency and error
                simulation for realistic API testing and development experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  LATENCY SIMULATION
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• Realistic network delays</div>
                  <div>• Configurable latency ranges</div>
                  <div>• Different delays for read vs write operations</div>
                  <div>• Random latency within specified ranges</div>
                  <div>• Critical operation prioritization</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  ERROR SIMULATION
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• Configurable error rates</div>
                  <div>• Multiple HTTP status codes</div>
                  <div>• Realistic error messages</div>
                  <div>• Different error rates per operation type</div>
                  <div>• Error logging and debugging</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                LATENCY CONFIGURATION
              </h3>
              <CodeBlock
                code={`// MSW Utils - Artificial Latency and Error Simulation
import { withLatencyAndErrors, withLatency, LATENCY_CONFIG } from '../mocks/utils';

// Configuration for different endpoint types
export const LATENCY_CONFIG = {
  // Write operations (POST, PUT, PATCH, DELETE) - higher latency + errors
  WRITE: {
    minLatency: 200,
    maxLatency: 1200,
    errorRate: 0.07, // 7% error rate
    statusCodes: [500, 502, 503]
  },
  
  // Read operations (GET) - lower latency, no errors
  READ: {
    minLatency: 100,
    maxLatency: 500,
    errorRate: 0
  },
  
  // Critical operations - very low error rate
  CRITICAL: {
    minLatency: 300,
    maxLatency: 800,
    errorRate: 0.02, // 2% error rate
    statusCodes: [500, 503]
  }
};

// Usage in MSW handlers
import { rest } from 'msw';

// Write operations with latency and errors
export const jobHandlers = [
  rest.post('/api/jobs', withLatencyAndErrors(
    async (req, res, ctx) => {
      // Handler logic here
      return res(ctx.json({ success: true }));
    },
    LATENCY_CONFIG.WRITE
  )),
  
  // Read operations with latency only
  rest.get('/api/jobs', withLatency(
    async (req, res, ctx) => {
      // Handler logic here
      return res(ctx.json({ data: [] }));
    },
    LATENCY_CONFIG.READ
  )),
  
  // Critical operations with minimal errors
  rest.post('/api/auth/login', withLatencyAndErrors(
    async (req, res, ctx) => {
      // Handler logic here
      return res(ctx.json({ success: true }));
    },
    LATENCY_CONFIG.CRITICAL
  ))
];`}
                language="javascript"
                id="latency-config"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                LATENCY UTILITY FUNCTIONS
              </h3>
              <CodeBlock
                code={`// withLatencyAndErrors - For write operations
export const withLatencyAndErrors = (handler, options = {}) => {
  const {
    minLatency = 200,
    maxLatency = 1200,
    errorRate = 0.07, // 7% error rate
    statusCodes = [500, 502, 503]
  } = options;

  return async (...args) => {
    // Simulate artificial latency
    const latency = Math.random() * (maxLatency - minLatency) + minLatency;
    await new Promise(resolve => setTimeout(resolve, latency));

    // Simulate random errors
    if (Math.random() < errorRate) {
      const randomStatusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      const errorMessages = {
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable'
      };
      
      console.log(\`🚨 [MSW] Simulated error: \${randomStatusCode} \${errorMessages[randomStatusCode]}\`);
      
      return new HttpResponse(
        JSON.stringify({
          success: false,
          error: errorMessages[randomStatusCode],
          code: 'SIMULATED_ERROR',
          timestamp: new Date().toISOString()
        }),
        { 
          status: randomStatusCode,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // If no error, proceed with original handler
    return await handler(...args);
  };
};

// withLatency - For read operations (no errors)
export const withLatency = (handler, options = {}) => {
  const {
    minLatency = 100,
    maxLatency = 500
  } = options;

  return async (...args) => {
    // Simulate artificial latency
    const latency = Math.random() * (maxLatency - minLatency) + minLatency;
    await new Promise(resolve => setTimeout(resolve, latency));

    return await handler(...args);
  };
};`}
                language="javascript"
                id="latency-functions"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                REALISTIC API SIMULATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Write Operations
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• POST /api/jobs - 200-1200ms latency</li>
                    <li>• PATCH /api/candidates - 7% error rate</li>
                    <li>• PUT /api/assessments - Realistic delays</li>
                    <li>• DELETE operations - Higher latency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Read Operations
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• GET /api/jobs - 100-500ms latency</li>
                    <li>• GET /api/candidates - No errors</li>
                    <li>• GET /api/assessments - Fast responses</li>
                    <li>• Search operations - Quick results</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                ERROR SIMULATION FEATURES
              </h3>
              <CodeBlock
                code={`// Error simulation includes:
// 1. Random error rates (2-7% depending on operation)
// 2. Multiple HTTP status codes
// 3. Realistic error messages
// 4. Error logging for debugging

const errorMessages = {
  500: 'Internal Server Error',
  502: 'Bad Gateway', 
  503: 'Service Unavailable'
};

// Error response format
{
  "success": false,
  "error": "Internal Server Error",
  "code": "SIMULATED_ERROR",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Usage in development
// 1. Test error handling in components
// 2. Verify loading states work correctly
// 3. Ensure proper error boundaries
// 4. Test retry mechanisms
// 5. Validate user feedback systems

// Console logging for debugging
console.log('🚨 [MSW] Simulated error: 500 Internal Server Error');
console.log('⏱️ [MSW] Request latency: 847ms');
console.log('✅ [MSW] Request successful: 200ms');`}
                language="javascript"
                id="error-simulation"
              />
            </div>
          </div>
        );

      case "development-tools":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                DEVELOPMENT TOOLS
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow includes several development tools and utilities to
                help with debugging, testing, and development workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-4">
                  AVAILABLE TOOLS
                </h3>
                <div className="space-y-3 text-sm font-inter text-blue-700 dark:text-blue-200">
                  <div>• MSWTester - API endpoint testing</div>
                  <div>• DatabaseSeederPage - Data seeding interface</div>
                  <div>• Browser console utilities</div>
                  <div>• Development debugging helpers</div>
                  <div>• Database inspection tools</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-impact font-bold uppercase text-green-800 dark:text-green-300 mb-4">
                  DEBUGGING FEATURES
                </h3>
                <div className="space-y-3 text-sm font-inter text-green-700 dark:text-green-200">
                  <div>• API request/response logging</div>
                  <div>• Database state inspection</div>
                  <div>• Component state debugging</div>
                  <div>• Error boundary implementation</div>
                  <div>• Performance monitoring</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                MSW TESTER USAGE
              </h3>
              <CodeBlock
                code={`// MSWTester component provides API testing interface
// Available at /msw-tester route

// Test Jobs API
const testJobsAPI = async () => {
  // GET /api/jobs
  const jobs = await fetch('/api/jobs').then(r => r.json());
  
  // POST /api/jobs
  const newJob = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test Job',
      description: 'Test description',
      location: 'Remote'
    })
  }).then(r => r.json());
  
  console.log('Jobs API test results:', { jobs, newJob });
};

// Test Candidates API
const testCandidatesAPI = async () => {
  const candidates = await fetch('/api/candidates').then(r => r.json());
  console.log('Candidates:', candidates);
};

// Test Assessments API
const testAssessmentsAPI = async () => {
  const assessment = await fetch('/api/assessments/1').then(r => r.json());
  console.log('Assessment:', assessment);
};`}
                language="javascript"
                id="msw-tester-usage"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-impact font-bold uppercase text-gray-800 dark:text-gray-300 mb-4">
                DATABASE SEEDER TOOLS
              </h3>
              <CodeBlock
                code={`// Database seeding utilities available in browser console
// Access via window object for debugging

// Force re-seed entire database
window.forceReSeedDatabase();

// Re-seed only assessments
window.forceReSeedAssessments();

// Clear all data
window.clearAllData();

// Inspect database state
const inspectDatabase = async () => {
  const db = window.db || await import('./lib/database').then(m => m.default);
  
  console.log('Companies:', await db.companies.toArray());
  console.log('Users:', await db.users.toArray());
  console.log('Jobs:', await db.jobs.toArray());
  console.log('Candidates:', await db.candidates.toArray());
  console.log('Assessments:', await db.assessments.toArray());
};

// Database seeder page at /seed-database
// Provides UI for manual seeding operations

// Available seeding operations:
// - Seed companies and users
// - Seed jobs with stages
// - Seed candidates with history
// - Seed assessments with questions
// - Seed timeline entries
// - Clear and reset database`}
                language="javascript"
                id="database-tools"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
              DOCUMENTATION
            </h1>
            <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
              Select a section from the sidebar to view detailed documentation.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
        <div className="pt-32 lg:pt-40">
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-56 fixed left-0 top-32 lg:top-40 h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors duration-200 z-10">
              <div className="p-4">
                <h2 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-white mb-4 transition-colors duration-200">
                  DOCS
                </h2>

                {sidebarSections.map((section, sectionIndex) => {
                  const Icon = section.icon;
                  return (
                    <div key={sectionIndex} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-xs font-impact font-bold uppercase text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          {section.title}
                        </h3>
                      </div>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => setActiveSection(item.id)}
                              className={`w-full text-left px-2 py-1.5 text-xs font-inter rounded-md transition-colors duration-200 ${
                                activeSection === item.id
                                  ? "bg-primary-500 text-white"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-56 min-w-0">
              <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-12 overflow-hidden">
                {/* Header Section - Same spacing as HeroSection */}
                <div className="mb-8 lg:mb-16">
                  <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-6 transition-colors duration-200">
                    DOCUMENTATION
                  </h1>
                  <p className="text-lg lg:text-xl font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight tracking-tight max-w-3xl transition-colors duration-200">
                    Complete guide and Mock reference for TalentFlow platform
                    integration.
                  </p>
                </div>

                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DocsPage;
