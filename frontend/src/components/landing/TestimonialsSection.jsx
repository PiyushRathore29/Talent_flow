import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <section className="bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (Testimonials)
              </p>
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (01)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 text-display transition-colors duration-200">
              WHAT OUR<br />PARTNERS SAY
            </h2>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight max-w-2xl transition-colors duration-200">
              See how we've helped leading companies build their dream teams.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-0">
            <div className="lg:w-1/2 aspect-[4/3] lg:aspect-square relative">
              <img 
                src="/assets/testimonials.jpg"
                alt="Team members from Utosia in a meeting"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-6 lg:bottom-12 left-6 lg:left-12 right-6 lg:right-12 flex justify-between items-center">
                <button className="w-12 lg:w-15 h-12 lg:h-15 bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </button>
                <button className="w-12 lg:w-15 h-12 lg:h-15 bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-primary-50 dark:bg-gray-900 p-8 lg:p-24 flex flex-col justify-between aspect-[4/3] lg:aspect-square transition-colors duration-200">
              <div className="flex flex-col gap-8 lg:gap-12">
                <div className="w-16 lg:w-18 h-10 lg:h-12">
                  <svg viewBox="0 0 75 47" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M0 47C0 34.5 4.5 24 13.5 15.5C22.5 7 33.5 2.5 46.5 1.5L49 9C40 10.5 32.5 14 26.5 19.5C20.5 25 17.5 31.5 17.5 39C17.5 42 18.5 44.5 20.5 46.5C22.5 48.5 25 49.5 28 49.5C31 49.5 33.5 48.5 35.5 46.5C37.5 44.5 38.5 42 38.5 39C38.5 36 37.5 33.5 35.5 31.5C33.5 29.5 31 28.5 28 28.5C25 28.5 22.5 29.5 20.5 31.5C18.5 33.5 17.5 36 17.5 39V47H0Z" fill="currentColor" className="text-primary-500 dark:text-white"/>
                    <path d="M37.5 47C37.5 34.5 42 24 51 15.5C60 7 71 2.5 84 1.5L86.5 9C77.5 10.5 70 14 64 19.5C58 25 55 31.5 55 39C55 42 56 44.5 58 46.5C60 48.5 62.5 49.5 65.5 49.5C68.5 49.5 71 48.5 73 46.5C75 44.5 76 42 76 39C76 36 75 33.5 73 31.5C71 29.5 68.5 28.5 65.5 28.5C62.5 28.5 60 29.5 58 31.5C56 33.5 55 36 55 39V47H37.5Z" fill="currentColor" className="text-primary-500 dark:text-white"/>
                  </svg>
                </div>
                
                <div className="flex flex-col gap-6 lg:gap-8">
                  <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                    (Utosia, Head of HR)
                  </p>
                  <h3 className="text-heading-sm lg:text-subheading font-inter font-semibold text-primary-500 dark:text-white leading-tight tracking-tighter transition-colors duration-200">
                    The Best Platform for Finding Quality Talent.
                  </h3>
                  <p className="text-large font-inter text-primary-500/60 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                    Talent Flow's intelligent matching saved us countless hours. We filled critical roles faster than we ever thought possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
