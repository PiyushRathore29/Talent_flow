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

startApp();
