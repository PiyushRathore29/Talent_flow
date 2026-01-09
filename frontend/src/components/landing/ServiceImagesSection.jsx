import React from 'react';

const ServiceImagesSection = () => {
  return (
    <section className="bg-white dark:bg-black pb-12 lg:pb-24 overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-6">
            <div className="flex-1 aspect-square lg:aspect-[1/1] relative">
              <img 
                src="/assets/service1.jpg"
                alt="Professionals in a modern office environment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 aspect-square lg:aspect-[1/1] relative">
              <img 
                src="/assets/service2.jpg"
                alt="A job seeker reviewing their profile on a laptop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceImagesSection;
