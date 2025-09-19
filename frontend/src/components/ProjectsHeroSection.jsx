import React from 'react';

const ProjectsHeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="pt-32 lg:pt-40 pb-12 lg:pb-24 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60">
                (Our Jobs)
              </p>
              <p className="text-medium font-times italic text-primary-500/60">
                (01)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h1 className="text-hero font-impact font-black uppercase text-primary-500 leading-none mb-4 lg:mb-8 tracking-tight">
              OPPORTUNITIES
            </h1>
            <p className="text-heading font-inter font-semibold text-primary-500 leading-tight tracking-tight max-w-4xl">
              Explore curated job openings from the world's most innovative companies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsHeroSection;
