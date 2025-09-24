import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Copy, Check } from "lucide-react";

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const sidebarSections = [
    {
      title: "Get Started",
      items: [
        { id: "introduction", title: "Introduction" },
        { id: "installation", title: "Installation" },
        { id: "getting-started", title: "Getting Started" },
      ],
    },
    {
      title: "API Reference",
      items: [
        { id: "authentication", title: "Authentication" },
        { id: "jobs-api", title: "Jobs API" },
        { id: "candidates-api", title: "Candidates API" },
      ],
    },
    {
      title: "Features",
      items: [
        { id: "job-management", title: "Job Management" },
        { id: "candidate-tracking", title: "Candidate Tracking" },
        { id: "analytics", title: "Analytics" },
      ],
    },
    {
      title: "Advanced",
      items: [
        { id: "webhooks", title: "Webhooks" },
        { id: "custom-fields", title: "Custom Fields" },
        { id: "integrations", title: "Integrations" },
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
                Welcome to TalentFlow Documentation. This platform provides a
                comprehensive solution for managing talent acquisition, from job
                posting to candidate tracking and beyond.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-impact font-bold uppercase text-blue-800 dark:text-blue-300 mb-2">
                WHAT IS TALENTFLOW?
              </h3>
              <p className="text-base font-inter text-blue-700 dark:text-blue-200">
                TalentFlow is a modern recruitment platform that streamlines the
                hiring process with intuitive job management, candidate
                tracking, and powerful analytics.
              </p>
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
                NPM INSTALLATION
              </h3>
              <CodeBlock
                code={`npm install talentflow-sdk
# or with yarn
yarn add talentflow-sdk`}
                language="bash"
                id="npm-install"
              />

              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white mt-8">
                ENVIRONMENT SETUP
              </h3>
              <CodeBlock
                code={`# Create .env file
TALENTFLOW_API_KEY=your_api_key_here
TALENTFLOW_BASE_URL=https://api.talentflow.com
NODE_ENV=development`}
                language="bash"
                id="env-setup"
              />
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

      case "authentication":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-4 transition-colors duration-200">
                AUTHENTICATION
              </h1>
              <p className="text-lg font-inter text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl transition-colors duration-200">
                TalentFlow uses API keys for authentication. Include your API
                key in the Authorization header.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-impact font-bold uppercase text-primary-500 dark:text-white">
                API KEY AUTHENTICATION
              </h3>
              <CodeBlock
                code={`curl -X GET "https://api.talentflow.com/v1/jobs" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json"`}
                language="bash"
                id="auth-curl"
              />

              <CodeBlock
                code={`// Using fetch in JavaScript
const response = await fetch('https://api.talentflow.com/v1/jobs', {
  headers: {
    'Authorization': 'Bearer your_api_key_here',
    'Content-Type': 'application/json'
  }
});

const jobs = await response.json();`}
                language="javascript"
                id="auth-js"
              />
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

                {sidebarSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-4">
                    <h3 className="text-xs font-impact font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">
                      {section.title}
                    </h3>
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
                ))}
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
                    Complete guide and API reference for TalentFlow platform
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
