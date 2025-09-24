// Utility functions for MSW handlers

/**
 * Adds artificial latency and error simulation to write endpoints
 * @param {Function} handler - The original handler function
 * @param {Object} options - Configuration options
 * @param {number} options.minLatency - Minimum latency in ms (default: 200)
 * @param {number} options.maxLatency - Maximum latency in ms (default: 1200)
 * @param {number} options.errorRate - Error rate as decimal (default: 0.07 = 7%)
 * @param {number} options.statusCodes - Array of error status codes to randomly return (default: [500, 502, 503])
 * @returns {Function} - Wrapped handler with latency and error simulation
 */
export const withLatencyAndErrors = (handler, options = {}) => {
  const {
    minLatency = 200,
    maxLatency = 1200,
    errorRate = 0.07, // 7% error rate (5-10% range)
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
      
      console.log(`🚨 [MSW] Simulated error: ${randomStatusCode} ${errorMessages[randomStatusCode]}`);
      
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

/**
 * Adds only artificial latency (no errors) to read endpoints
 * @param {Function} handler - The original handler function
 * @param {Object} options - Configuration options
 * @param {number} options.minLatency - Minimum latency in ms (default: 100)
 * @param {number} options.maxLatency - Maximum latency in ms (default: 500)
 * @returns {Function} - Wrapped handler with latency simulation
 */
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
};

/**
 * Configuration for different endpoint types
 */
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

