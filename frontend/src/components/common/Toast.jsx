/*
 * TOAST NOTIFICATION COMPONENT - Toast.jsx
 *
 * TOAST SYSTEM EXPLANATION:
 * This component provides a comprehensive toast notification system for user feedback.
 *
 * FEATURES:
 * - Multiple toast types: success, error, warning, info
 * - Smooth entrance and exit animations
 * - Auto-dismiss with customizable duration
 * - Manual dismiss with close button
 * - Stacked toasts with proper z-indexing
 * - Dark mode support
 *
 * USAGE:
 * - Import useToast hook in components
 * - Call showSuccess, showError, etc. to display toasts
 * - Include ToastContainer in your layout
 *
 * ANIMATION FLOW:
 * 1) Toast appears with slide-up and fade-in animation
 * 2) Displays for specified duration
 * 3) Starts exit animation before removal
 * 4) Slides down and fades out
 */

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

// INDIVIDUAL TOAST COMPONENT:
// Displays a single toast notification with animations and controls
const Toast = ({ message, type = "success", duration = 4000, onClose }) => {
  // ANIMATION STATE:
  // isVisible: Controls entrance animation
  // isLeaving: Controls exit animation
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // LIFECYCLE EFFECT:
  // Manages toast appearance, display duration, and removal
  useEffect(() => {
    // STEP 1: Trigger entrance animation immediately
    setIsVisible(true);

    // STEP 2: Start exit animation before removal (300ms before end)
    // This ensures smooth transition out
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    // STEP 3: Remove toast completely after duration
    const removeTimer = setTimeout(() => {
      onClose();
    }, duration);

    // CLEANUP: Clear timers if component unmounts early
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  // ICON HELPER FUNCTION:
  // Returns appropriate icon based on toast type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  // STYLING HELPER FUNCTION:
  // Returns appropriate background colors based on toast type
  // Supports both light and dark modes
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "translate-y-0 opacity-100 scale-100"
            : isLeaving
            ? "translate-y-2 opacity-0 scale-95"
            : "translate-y-full opacity-0 scale-95"
        }
      `}
    >
      <div
        className={`
        ${getBackgroundColor()}
        border rounded-lg shadow-lg backdrop-blur-sm
        p-4 flex items-start space-x-3
        transition-colors duration-200
      `}
      >
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
        </div>

        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{ zIndex: 50 + index }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// TOAST MANAGEMENT HOOK:
// Provides easy-to-use functions for displaying toast notifications
export const useToast = () => {
  // TOAST STATE: Array of active toast notifications
  const [toasts, setToasts] = useState([]);

  // ADD TOAST: Creates new toast with unique ID and adds to state
  const addToast = (message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    // Add to existing toasts array
    setToasts((prev) => [...prev, newToast]);

    return id; // Return ID for potential manual removal
  };

  // REMOVE TOAST: Removes toast by ID from state
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // CONVENIENCE FUNCTIONS: Type-specific toast creators
  const showSuccess = (message, duration) =>
    addToast(message, "success", duration);
  const showError = (message, duration) => addToast(message, "error", duration);
  const showWarning = (message, duration) =>
    addToast(message, "warning", duration);
  const showInfo = (message, duration) => addToast(message, "info", duration);

  // RETURN HOOK INTERFACE: All functions and components needed for toast management
  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    ),
  };
};

export default Toast;
