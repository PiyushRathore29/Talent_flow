/*
 * SIGN IN PAGE COMPONENT - SignInPage.jsx
 *
 * LOGIN FLOW EXPLANATION:
 * 1) User enters email and password in form
 * 2) User clicks "Sign In" button
 * 3) Component calls signIn function from AuthContext
 * 4) AuthContext validates credentials against database
 * 5) If valid → creates session → redirects to appropriate dashboard
 * 6) If invalid → shows error message
 *
 * DEMO FEATURES:
 * - Quick login buttons for HR and Candidate roles
 * - Pre-filled demo credentials for testing
 * - Role-based redirect after successful login
 *
 * REDIRECT LOGIC:
 * - HR users → /dashboard (main HR dashboard)
 * - Candidate users → /dashboard/candidate
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Building,
  Globe,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import Logo from "../../components/common/Logo";

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // FORM STATE MANAGEMENT:
  // formData: Stores email and password input values
  // showPassword: Toggles password visibility
  // loading: Shows loading state during sign in process
  // error: Displays error messages if login fails
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // DEMO AUTO-FILL FUNCTION:
  // Pre-fills form with demo credentials for testing
  const autofillDemo = (role = "hr") => {
    if (role === "hr") {
      setFormData({
        email: "sarah.wilson@techcorp.com",
        password: "password123",
      });
    } else {
      setFormData({
        email: "john.doe@example.com",
        password: "password123",
      });
    }
  };

  // FORM INPUT HANDLER:
  // Updates form data when user types and clears any existing errors
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  // FORM SUBMISSION FLOW:
  // Step 1: Prevent default form submission
  // Step 2: Set loading state and clear errors
  // Step 3: Call signIn function from AuthContext
  // Step 4: Handle success/error and redirect appropriately
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call authentication function
    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      // Redirect based on user role
      if (result.user.role === "hr") {
        navigate("/dashboard/employer");
      } else {
        navigate("/dashboard/candidate");
      }
    } else {
      // Show error message if login fails
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex transition-colors duration-200">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo and Header */}
          <div className="mb-8">
            <Logo />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Get Started
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Welcome to TalentFlow - Let's create your account
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                placeholder="hr@talentflow.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  to="#"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Forgot?
                </Link>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Autofill Demo Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => autofillDemo("hr")}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              >
                HR Login
              </button>
              <button
                type="button"
                onClick={() => autofillDemo("candidate")}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Candidate Login
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign up"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="#"
                className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              <strong>Demo Credentials:</strong>
              <br />
              <strong>HR:</strong> sarah.wilson@techcorp.com / password123
              <br />
              <strong>Candidate:</strong> john.doe@example.com / password123
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image with Overlay */}
      <div className="hidden lg:block relative flex-1 bg-gray-800">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/hiring.jpg"
          alt="Office workspace"
          onError={(e) => {
            console.log("Image failed to load:", e.target.src);
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-primary-600 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold italic mb-4">
              Enter
              <br />
              the Future
            </h2>
            <h3 className="text-3xl font-light mb-6">
              of Recruitment,
              <br />
              today
            </h3>

            {/* Analytics Card Mockup */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-sm text-white/80">View All</span>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold mb-1">12,347.23 $</div>
                <div className="text-sm text-white/80">Combined balance</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/90">Primary Card</span>
                  <span className="text-lg font-semibold">2,546.64$</span>
                </div>
                <div className="text-xs text-white/70">3495 •••• •••• 6917</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-white/20 rounded-sm"></div>
                  <span className="text-xs text-white/70">VISA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
