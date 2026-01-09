import React from "react";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white dark:bg-black relative overflow-hidden transition-colors duration-200">
      <div className="pt-32 lg:pt-40 pb-12 lg:pb-24 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 lg:mb-24">
            <h1 className="text-hero font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 transition-colors duration-200">
              TALENT FLOW
            </h1>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight tracking-tight max-w-4xl transition-colors duration-200">
              Connecting top talent with leading companies. Your next career
              move starts here.
            </p>
          </div>

          <div className="w-full aspect-[4/3] lg:aspect-[16/10] relative">
            <img
              src="/assets/talent-flow-hero.jpg"
              alt="Team collaborating in a modern office"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
