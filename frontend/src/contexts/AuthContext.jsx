/*
 * AUTHENTICATION CONTEXT - AuthContext.jsx
 *
 * AUTHENTICATION FLOW EXPLANATION:
 * 1) When app starts, AuthProvider initializes and checks for existing session
 * 2) User signs up → creates user account → creates session → stores token in localStorage
 * 3) User signs in → validates credentials → creates session → stores token in localStorage
 * 4) Protected routes check authentication status via useAuth hook
 * 5) User signs out → deletes session → removes token → clears user state
 *
 * DATA FLOW:
 * - User data stored in IndexedDB users table
 * - Sessions stored in IndexedDB sessions table with tokens
 * - Tokens stored in localStorage for persistence across browser sessions
 * - Company data linked to HR users for multi-tenancy
 *
 * ROLE-BASED ACCESS:
 * - HR users: Can access management features, create jobs, view candidates
 * - Candidate users: Can view jobs, take assessments, view their progress
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { dbHelpers } from "../lib/database";
import { initializeSampleData } from "../lib/database";

// Create authentication context for global state management
const AuthContext = createContext();

// Hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// PASSWORD SECURITY FUNCTIONS:
// Note: These are basic implementations for demo purposes
// In production, use proper bcrypt or similar secure hashing
const hashPassword = (password) => {
  return btoa(password + "salt_string"); // Basic encoding, not secure for production
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

// AUTHENTICATION PROVIDER COMPONENT:
// Manages global authentication state and provides auth methods to all components
export const AuthProvider = ({ children }) => {
  // AUTHENTICATION STATE:
  // user: Current logged-in user data (null if not authenticated)
  // company: Current user's company data (for HR users)
  // loading: Shows loading state during auth operations
  // initialized: Tracks if auth system has finished initializing
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // AUTHENTICATION INITIALIZATION FLOW:
  // Step 1: Initialize sample data for demo purposes
  // Step 2: Check for existing session token in localStorage
  // Step 3: Validate session and restore user state if valid
  // Step 4: Set initialized flag to allow app to render
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Step 1: Initialize sample data if needed
        // This creates demo users and companies for testing
        try {
          await initializeSampleData();
        } catch (sampleDataError) {
          console.warn(
            "Sample data initialization failed, continuing without sample data:",
            sampleDataError
          );
          // Continue with auth initialization even if sample data fails
        }

        // Step 2: Check for existing session token
        const token = localStorage.getItem("auth_token");
        if (token) {
          // Step 3: Validate session and restore user state
          const session = await dbHelpers.getValidSession(token);
          if (session) {
            const userData = await dbHelpers.getUserById(session.userId);
            if (userData) {
              setUser(userData);
              // Load company data for HR users
              if (userData.companyId) {
                const companyData = await dbHelpers.getCompanyById(
                  userData.companyId
                );
                setCompany(companyData);
              }
              await dbHelpers.updateUserLastLogin(userData.id);
            }
          } else {
            // Invalid session, remove token
            localStorage.removeItem("auth_token");
          }
        }

        // Step 4: Mark as initialized to allow app to render
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setInitialized(true); // Still mark as initialized so the app can continue
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // USER REGISTRATION FLOW:
  // Step 1: Validate email doesn't already exist
  // Step 2: Create company for HR users (if needed)
  // Step 3: Create user account with hashed password
  // Step 4: Create session and store token
  // Step 5: Set user state and return success
  const signUp = async (userData) => {
    try {
      const {
        email,
        password,
        role,
        companyName,
        companyDomain,
        ...otherData
      } = userData;

      // Step 1: Check if user already exists
      const existingUser = await dbHelpers.getUserByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      let companyId = null;

      // Step 2: Handle company creation for HR users
      if (role === "hr") {
        if (!companyName) {
          throw new Error("Company name is required for HR users");
        }

        // Check if company already exists
        let existingCompany = await dbHelpers.getCompanyByName(companyName);
        if (existingCompany) {
          companyId = existingCompany.id;
        } else {
          // Create new company for HR user
          companyId = await dbHelpers.createCompany({
            name: companyName,
            domain:
              companyDomain ||
              `${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
          });
        }
      }

      // Step 3: Create user account with hashed password
      const hashedPassword = hashPassword(password);
      const userId = await dbHelpers.createUser({
        ...otherData,
        email,
        password: hashedPassword,
        role,
        companyId,
      });

      const newUser = await dbHelpers.getUserById(userId);
      const companyData = companyId
        ? await dbHelpers.getCompanyById(companyId)
        : null;

      // Step 4: Create session and store token
      const token = btoa(`${userId}_${Date.now()}_${Math.random()}`);
      await dbHelpers.createSession(userId, token);
      localStorage.setItem("auth_token", token);

      // Step 5: Set user state and return success
      setUser(newUser);
      setCompany(companyData);

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: error.message };
    }
  };

  // USER LOGIN FLOW:
  // Step 1: Find user by email address
  // Step 2: Verify password matches stored hash
  // Step 3: Create session and store token
  // Step 4: Load company data (for HR users)
  // Step 5: Update last login time and set user state
  const signIn = async (email, password) => {
    try {
      // Step 1: Find user by email address
      const userData = await dbHelpers.getUserByEmail(email);
      if (!userData) {
        throw new Error("Invalid email or password");
      }

      // Step 2: Verify password matches stored hash
      if (!verifyPassword(password, userData.password)) {
        throw new Error("Invalid email or password");
      }

      // Step 3: Create session and store token
      const token = btoa(`${userData.id}_${Date.now()}_${Math.random()}`);
      await dbHelpers.createSession(userData.id, token);
      localStorage.setItem("auth_token", token);

      // Step 4: Load company data for HR users
      const companyData = userData.companyId
        ? await dbHelpers.getCompanyById(userData.companyId)
        : null;

      // Step 5: Update last login time and set user state
      setUser(userData);
      setCompany(companyData);
      await dbHelpers.updateUserLastLogin(userData.id);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: error.message };
    }
  };

  // USER LOGOUT FLOW:
  // Step 1: Get current session token
  // Step 2: Delete session from database
  // Step 3: Remove token from localStorage
  // Step 4: Clear user and company state
  const signOut = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await dbHelpers.deleteSession(token);
        localStorage.removeItem("auth_token");
      }

      setUser(null);
      setCompany(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // USER PROFILE UPDATE FLOW:
  // Step 1: Check if user is logged in
  // Step 2: Update user data in database
  // Step 3: Refresh user state with updated data
  const updateUser = async (updates) => {
    try {
      if (!user) return { success: false, error: "No user logged in" };

      await dbHelpers.updateUser(user.id, updates);
      const updatedUser = await dbHelpers.getUserById(user.id);
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update user error:", error);
      return { success: false, error: error.message };
    }
  };

  // AUTHENTICATION HELPER FUNCTIONS:
  // These functions check user status and role for conditional rendering and access control

  const isAuthenticated = () => {
    return !!user;
  };

  const isHR = () => {
    return user?.role === "hr";
  };

  const isCandidate = () => {
    return user?.role === "candidate";
  };

  const isSameCompany = (companyId) => {
    return user?.companyId === companyId;
  };

  // CONTEXT VALUE:
  // Provides all authentication state and methods to child components
  const value = {
    user,
    company,
    loading,
    initialized,
    signUp,
    signIn,
    signOut,
    updateUser,
    isAuthenticated,
    isHR,
    isCandidate,
    isSameCompany,
  };

  // PROVIDER COMPONENT:
  // Wraps the entire app to provide authentication context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
