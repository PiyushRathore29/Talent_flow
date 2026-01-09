import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../common/Logo";
import ThemeToggle from "./ThemeToggle";
import {
  User,
  LogOut,
  ChevronDown,
  Briefcase,
  Users,
  BarChart,
} from "lucide-react";

const AuthenticatedHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const getLinkClass = (path) => {
    let baseClass =
      "text-nav font-inter font-semibold transition-opacity text-primary-500 dark:text-white hover:opacity-70";
    if (location.pathname === path || location.pathname.startsWith(path)) {
      return baseClass;
    }
    return `${baseClass} text-primary-500/80 dark:text-white/80`;
  };

  const getNavigationLinks = () => {
    if (user?.role === "hr") {
      return [
        {
          path: "/dashboard/employer",
          label: "Dashboard",
          icon: <BarChart className="w-4 h-4" />,
        },
        {
          path: "/candidates",
          label: "Candidates",
          icon: <Users className="w-4 h-4" />,
        },
      ];
    } else {
      return [
        {
          path: "/dashboard/candidate",
          label: "Dashboard",
          icon: <BarChart className="w-4 h-4" />,
        },
        {
          path: "/jobs",
          label: "Browse Jobs",
          icon: <Briefcase className="w-4 h-4" />,
        },
      ];
    }
  };

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 sm:px-8 lg:px-24 py-4 sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <Link
          to={
            user?.role === "hr" ? "/dashboard/employer" : "/dashboard/candidate"
          }
        >
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {getNavigationLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${getLinkClass(link.path)} flex items-center gap-2`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600 dark:text-gray-300" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 capitalize">
                  {user?.role} {user?.companyName && `• ${user.companyName}`}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 dark:text-gray-300 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  {user?.companyName && (
                    <div className="text-xs text-gray-500 mt-1">
                      {user.companyName}
                    </div>
                  )}
                </div>

                {/* Mobile Navigation Links */}
                <div className="md:hidden border-b border-gray-100 py-2">
                  {getNavigationLinks().map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default AuthenticatedHeader;
