import React from 'react';
import { User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUpOptions = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="pt-32 lg:pt-40 pb-12 lg:pb-24 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60">
                (Join Us)
              </p>
              <p className="text-medium font-times italic text-primary-500/60">
                (Start Today)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24 text-center">
            <h1 className="text-hero font-impact font-black uppercase text-primary-500 leading-none mb-4 lg:mb-8 tracking-tight">
              CHOOSE YOUR PATH
            </h1>
            <p className="text-heading font-inter font-semibold text-primary-500 leading-tight tracking-tight max-w-4xl mx-auto">
              Whether you're looking for your next role or your next great hire, your journey starts here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Link to="/signup/candidate" className="block border-2 border-primary-100 rounded-lg p-8 lg:p-12 text-center flex flex-col items-center hover:border-primary-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary-400 text-white rounded-full p-4 mb-8">
                <User className="w-10 h-10" />
              </div>
              <h2 className="font-impact font-black uppercase text-primary-500 leading-none text-display-sm mb-4">
                FOR JOB SEEKERS
              </h2>
              <p className="text-body font-inter text-primary-500/70 leading-relaxed mb-10 flex-grow">
                Create a standout profile, browse curated job openings, and connect with top companies. Your dream job is just a few clicks away.
              </p>
              <div className="bg-primary-500 text-white px-10 py-4 rounded-lg text-nav font-inter font-semibold hover:bg-primary-600 transition-colors w-full">
                Sign Up as a Candidate
              </div>
            </Link>

            <Link to="/signup/employer" className="block border-2 border-primary-100 rounded-lg p-8 lg:p-12 text-center flex flex-col items-center hover:border-teal-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-teal-500 text-white rounded-full p-4 mb-8">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="font-impact font-black uppercase text-primary-500 leading-none text-display-sm mb-4">
                FOR EMPLOYERS
              </h2>
              <p className="text-body font-inter text-primary-500/70 leading-relaxed mb-10 flex-grow">
                Post job openings, access a diverse talent pool, and use our powerful tools to find the perfect fit for your team.
              </p>
              <div className="bg-teal-500 text-white px-10 py-4 rounded-lg text-nav font-inter font-semibold hover:bg-teal-600 transition-colors w-full">
                Sign Up as an Employer
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpOptions;
