import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building } from 'lucide-react';

const EmployerSignUpForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/employer');
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-heading font-impact font-black uppercase text-primary-500">
            Create Your Employer Account
          </h2>
          <p className="mt-2 text-center text-body text-primary-500/70">
            Find the best talent for your team.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="company-name" className="sr-only">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input id="company-name" name="company" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-4 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Company Name" />
              </div>
            </div>
             <div>
              <label htmlFor="full-name" className="sr-only">Your Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input id="full-name" name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-4 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Your Name" />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Work Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-4 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Work Email address" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-4 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Password" />
              </div>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 font-inter font-semibold">
              Sign Up & Post a Job
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EmployerSignUpForm;
