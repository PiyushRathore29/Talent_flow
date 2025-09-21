import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initializeMSW } from './mocks/browser.js';
import { initializeDatabase } from './lib/initializeDatabase.js';

// Initialize MSW and database before rendering the app
const startApp = async () => {
  // Initialize MSW (only in development)
  await initializeMSW();
  
  // Initialize database (auto-seed if empty)
  await initializeDatabase();
  
  // Render the app
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

startApp();
