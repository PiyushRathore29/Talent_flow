import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    let baseClass = 'text-nav font-inter font-semibold transition-opacity text-primary-500 hover:opacity-70';
    if (location.pathname === path) {
      return baseClass;
    }
    if (path === '/about' && location.pathname === '/') {
        return baseClass;
    }
    return `${baseClass} text-primary-500/80`;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-24 pt-8 lg:pt-16">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Link to="/">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 lg:gap-12">
          <Link to="/jobs" className={getLinkClass('/jobs')}>
            Jobs
          </Link>
          <Link to="/candidates" className={getLinkClass('/candidates')}>
            Candidates
          </Link>
          <Link to="/features" className={getLinkClass('/features')}>
            Features
          </Link>
          <Link to="/about" className={getLinkClass('/about')}>
            About Us
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link 
            to="/signup" 
            className="bg-primary-400 text-white px-6 py-3 rounded-lg text-nav font-inter font-semibold hover:bg-primary-400/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
