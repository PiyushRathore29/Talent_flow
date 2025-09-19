import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const location = useLocation();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-24 pt-8 lg:pt-16">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Link to="/">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 lg:gap-12">
          <Link 
            to="/jobs" 
            className={`text-nav font-inter font-semibold transition-opacity ${
              location.pathname === '/jobs' ? 'text-primary-500' : 'text-primary-500 hover:opacity-70'
            }`}
          >
            Jobs
          </Link>
          <Link 
            to="/features" 
            className={`text-nav font-inter font-semibold transition-opacity ${
              location.pathname === '/features' ? 'text-primary-500' : 'text-primary-500 hover:opacity-70'
            }`}
          >
            Features
          </Link>
          <Link 
            to="/about" 
            className={`text-nav font-inter font-semibold transition-opacity ${
              location.pathname === '/about' || location.pathname === '/' ? 'text-primary-500' : 'text-primary-500 hover:opacity-70'
            }`}
          >
            About Us
          </Link>
          <a href="#journal" className="text-nav font-inter font-semibold text-primary-500 hover:opacity-70 transition-opacity">
            Journal
          </a>
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
