import React from 'react';

const CompaniesHeroSection = () => {
  return (
    <section className="min-h-screen bg-white dark:bg-black relative overflow-hidden transition-colors duration-200">
      <div className="pt-32 lg:pt-40 pb-12 lg:pb-24 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 lg:mb-24">
            <h1 className="text-hero font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 tracking-tight transition-colors duration-200">
              COMPANIES
            </h1>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight tracking-tight max-w-4xl transition-colors duration-200">
              Discover amazing companies that are hiring top talent through our platform.
            </p>
          </div>
          
          <div className="w-full aspect-[4/3] lg:aspect-[16/10] relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&crop=center"
              alt="Modern office buildings showcasing company headquarters"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesHeroSection;