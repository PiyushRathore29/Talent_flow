import { setupWorker } from 'msw/browser';
import { jobHandlers } from './jobHandlers';
import { candidateHandlers } from './candidateHandlers';
import { assessmentHandlers } from './assessmentHandlers';

// Combine all handlers
export const handlers = [
  ...jobHandlers,
  ...candidateHandlers,
  ...assessmentHandlers
];

// Setup the worker
export const worker = setupWorker(...handlers);

// Start function with error handling
export const startMSW = async () => {
  try {
    await worker.start({
      onUnhandledRequest: 'warn', // Warn about unhandled requests instead of erroring
      serviceWorker: {
        url: '/mockServiceWorker.js', // Default MSW service worker location
      },
    });
    
    console.log('🚀 MSW: Mock Service Worker started successfully');
    console.log('📊 MSW: Available endpoints:');
    console.log('   Jobs: GET|POST /api/jobs, PATCH /api/jobs/:id, PATCH /api/jobs/:id/reorder');
    console.log('   Candidates: GET|POST /api/candidates, PATCH /api/candidates/:id, GET /api/candidates/:id/timeline');
    console.log('   Assessments: GET /api/assessments/:jobId, PUT /api/assessments/:jobId, POST /api/assessments/:jobId/submit');
    
    return true;
  } catch (error) {
    console.error('❌ MSW: Failed to start Mock Service Worker:', error);
    
    // Check if it's a service worker registration issue
    if (error.message?.includes('mockServiceWorker.js')) {
      console.error('💡 MSW: Run `npx msw init public --save` to generate the service worker file');
    }
    
    return false;
  }
};

// Stop function
export const stopMSW = async () => {
  try {
    worker.stop();
    console.log('🛑 MSW: Mock Service Worker stopped');
  } catch (error) {
    console.error('❌ MSW: Error stopping Mock Service Worker:', error);
  }
};

// Reset all handlers (useful for testing)
export const resetMSW = () => {
  worker.resetHandlers();
  console.log('🔄 MSW: Handlers reset to initial state');
};

// Environment detection helper
export const isMSWEnabled = () => {
  // Enable MSW in development by default, but allow override via environment variable
  const enableMSW = import.meta.env.VITE_ENABLE_MSW ?? 'true';
  const isDevelopment = import.meta.env.DEV;
  
  return isDevelopment && enableMSW !== 'false';
};

// Initialize MSW based on environment
export const initializeMSW = async () => {
  if (isMSWEnabled()) {
    console.log('🎯 MSW: Initializing Mock Service Worker for development environment');
    const started = await startMSW();
    
    if (started) {
      // Add global helpers for debugging in development
      if (typeof window !== 'undefined') {
        window.__MSW_WORKER__ = worker;
        window.__MSW_RESET__ = resetMSW;
        window.__MSW_STOP__ = stopMSW;
        
        console.log('🛠️  MSW: Debug helpers available:');
        console.log('   window.__MSW_WORKER__ - Access to MSW worker');
        console.log('   window.__MSW_RESET__() - Reset all handlers');
        console.log('   window.__MSW_STOP__() - Stop MSW');
      }
    }
    
    return started;
  } else {
    console.log('🚫 MSW: Mock Service Worker disabled for this environment');
    return false;
  }
};

// Export individual reset functions for testing
// Note: Job handlers now use IndexedDB, no reset functions needed

// Note: Candidate handlers now use IndexedDB, no reset functions needed

// Note: Assessment handlers now use IndexedDB, no reset functions needed