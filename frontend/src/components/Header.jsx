import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    let baseClass =
      "text-large font-inter font-semibold transition-opacity text-primary-500 dark:text-white hover:opacity-70";
    if (location.pathname === path) {
      return baseClass;
    }
    if (path === "/docs" && location.pathname === "/") {
      return baseClass;
    }
    return `${baseClass} text-primary-500/80 dark:text-white/80`;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-24 pt-8 lg:pt-16">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-12">
          <Link to="/projects" className={getLinkClass("/projects")}>
            Projects
          </Link>
          <Link to="/companies" className={getLinkClass("/companies")}>
            Companies
          </Link>
          <Link to="/features" className={getLinkClass("/features")}>
            Features
          </Link>
          <Link to="/docs" className={getLinkClass("/docs")}>
            Docs
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/signup"
            className="bg-primary-400 dark:bg-primary-600 text-white px-6 py-3 rounded-lg text-large font-inter font-semibold hover:bg-primary-400/90 dark:hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
