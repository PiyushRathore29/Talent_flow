/*
 * APPLICATION ENTRY POINT - main.jsx
 *
 * FLOW EXPLANATION:
 * 1) When the application starts, this file is the first to execute
 * 2) It imports all necessary dependencies and the main App component
 * 3) It initializes the database (IndexedDB) before rendering anything
 * 4) In development mode, it exposes debugging functions to window object
 * 5) Finally, it renders the App component to the DOM
 *
 * DATA FLOW:
 * - Database initialization happens first (from lib/initializeDatabase.js)
 * - This ensures all data is ready before any components try to access it
 * - The App component then handles routing and authentication
 */

// REACT CORE IMPORTS:
// StrictMode: Enables additional checks and warnings for development
// createRoot: Modern React 18 way to create a root for rendering
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// APPLICATION IMPORTS:
// App: Main application component that handles routing and layout
// CSS: Global styles and Tailwind CSS imports
import App from "./App.jsx";
import "./styles/index.css";

// DATABASE INITIALIZATION IMPORTS:
// initializeDatabase: Sets up IndexedDB schema and seeds initial data
// forceReSeedDatabase: Development utility to reset and re-seed database
// forceReSeedAssessments: Development utility to reset assessment data
import {
  initializeDatabase,
  forceReSeedDatabase,
  forceReSeedAssessments,
} from "./lib/initializeDatabase.js";

// APPLICATION STARTUP FLOW:
// Step 1: Initialize database before rendering the app
// This ensures all data (jobs, candidates, assessments) is available
const startApp = async () => {
  // Step 2: Initialize database (auto-seed if empty)
  // This creates IndexedDB tables and populates with sample data
  await initializeDatabase();

  // Step 3: Expose debugging functions to window in development
  // Allows developers to reset/seed database from browser console
  if (import.meta.env.DEV) {
    window.forceReSeedDatabase = forceReSeedDatabase;
    window.forceReSeedAssessments = forceReSeedAssessments;
  }

  // Step 4: Render the app to DOM
  // App component handles routing, authentication, and main UI
  // StrictMode wrapper enables additional React development checks
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Execute the startup sequence
startApp();
