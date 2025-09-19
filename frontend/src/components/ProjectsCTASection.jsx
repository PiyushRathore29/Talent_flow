import React from 'react';

const ProjectsCTASection = () => {
  return (
    <section className="bg-white py-12 lg:py-24 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60">
                (Take the Next Step)
              </p>
              <p className="text-medium font-times italic text-primary-500/60">
                (03)
              </p>
            </div>
          </div>
          
          <div className="bg-primary-500 rounded-lg p-8 lg:p-24 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-impact font-black uppercase text-white leading-none mb-6 lg:mb-12 text-display">
                READY TO FIND YOUR DREAM JOB?
              </h2>
              <p className="text-heading font-inter font-semibold text-white/80 leading-tight mb-8 lg:mb-16 max-w-2xl mx-auto">
                Create your profile and let our intelligent platform match you with top companies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 justify-center items-center">
                <a 
                  href="#signup" 
                  className="inline-flex flex-col items-center group bg-white text-primary-500 px-8 lg:px-12 py-4 lg:py-6 rounded-lg hover:bg-white/90 transition-all duration-300"
                >
                  <span className="text-nav font-inter font-semibold group-hover:scale-105 transition-transform duration-300">
                    Sign Up Now
                  </span>
                </a>
                
                <a 
                  href="/jobs" 
                  className="inline-flex flex-col items-center group"
                >
                  <span className="text-nav font-inter font-semibold text-white group-hover:opacity-70 transition-opacity">
                    Browse All Jobs
                  </span>
                  <div className="w-full h-0.5 bg-white group-hover:opacity-70 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCTASection;
