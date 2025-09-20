import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbHelpers } from '../lib/database';
import { initializeSampleData } from '../lib/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password) => {
  return btoa(password + 'salt_string'); // Basic encoding, not secure for production
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize database and check for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize sample data if needed
        try {
          await initializeSampleData();
        } catch (sampleDataError) {
          console.warn('Sample data initialization failed, continuing without sample data:', sampleDataError);
          // Continue with auth initialization even if sample data fails
        }
        
        // Check for existing session
        const token = localStorage.getItem('auth_token');
        if (token) {
          const session = await dbHelpers.getValidSession(token);
          if (session) {
            const userData = await dbHelpers.getUserById(session.userId);
            if (userData) {
              setUser(userData);
              if (userData.companyId) {
                const companyData = await dbHelpers.getCompanyById(userData.companyId);
                setCompany(companyData);
              }
              await dbHelpers.updateUserLastLogin(userData.id);
            }
          } else {
            // Invalid session, remove token
            localStorage.removeItem('auth_token');
          }
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setInitialized(true); // Still mark as initialized so the app can continue
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (userData) => {
    try {
      const { email, password, role, companyName, companyDomain, ...otherData } = userData;
      
      // Check if user already exists
      const existingUser = await dbHelpers.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      let companyId = null;
      
      // Handle company creation for HR users
      if (role === 'hr') {
        if (!companyName) {
          throw new Error('Company name is required for HR users');
        }
        
        // Check if company already exists
        let existingCompany = await dbHelpers.getCompanyByName(companyName);
        if (existingCompany) {
          companyId = existingCompany.id;
        } else {
          companyId = await dbHelpers.createCompany({
            name: companyName,
            domain: companyDomain || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`
          });
        }
      }
      
      // Create user
      const hashedPassword = hashPassword(password);
      const userId = await dbHelpers.createUser({
        ...otherData,
        email,
        password: hashedPassword,
        role,
        companyId
      });
      
      const newUser = await dbHelpers.getUserById(userId);
      const companyData = companyId ? await dbHelpers.getCompanyById(companyId) : null;
      
      // Create session
      const token = btoa(`${userId}_${Date.now()}_${Math.random()}`);
      await dbHelpers.createSession(userId, token);
      localStorage.setItem('auth_token', token);
      
      setUser(newUser);
      setCompany(companyData);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const userData = await dbHelpers.getUserByEmail(email);
      if (!userData) {
        throw new Error('Invalid email or password');
      }
      
      if (!verifyPassword(password, userData.password)) {
        throw new Error('Invalid email or password');
      }
      
      // Create session
      const token = btoa(`${userData.id}_${Date.now()}_${Math.random()}`);
      await dbHelpers.createSession(userData.id, token);
      localStorage.setItem('auth_token', token);
      
      const companyData = userData.companyId ? await dbHelpers.getCompanyById(userData.companyId) : null;
      
      setUser(userData);
      setCompany(companyData);
      await dbHelpers.updateUserLastLogin(userData.id);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await dbHelpers.deleteSession(token);
        localStorage.removeItem('auth_token');
      }
      
      setUser(null);
      setCompany(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUser = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };
      
      await dbHelpers.updateUser(user.id, updates);
      const updatedUser = await dbHelpers.getUserById(user.id);
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isHR = () => {
    return user?.role === 'hr';
  };

  const isCandidate = () => {
    return user?.role === 'candidate';
  };

  const isSameCompany = (companyId) => {
    return user?.companyId === companyId;
  };

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
    isSameCompany
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;