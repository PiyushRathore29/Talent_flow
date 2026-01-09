import React from 'react';

const ProcessStep = ({ stepNumber, category, title, description1, description2, image, imageOnLeft = true }) => {
  const imageSection = (
    <div className="flex-1 aspect-[4/3] lg:aspect-[16/12] relative bg-primary-50 dark:bg-gray-800 transition-colors duration-200">
      <img 
        src={image}
        alt={`${title} process step`}
        className="w-full h-full object-cover"
      />
    </div>
  );

  const contentSection = (
    <div className="flex-1 bg-primary-50 dark:bg-gray-900 p-8 lg:p-24 flex flex-col justify-between aspect-[4/3] lg:aspect-[16/12] transition-colors duration-200">
      <div className="flex flex-col gap-6 lg:gap-12">
        <h3 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-none text-display-sm lg:text-heading tracking-tight transition-colors duration-200">
          {stepNumber}
        </h3>
        
        <div className="flex flex-col gap-6 lg:gap-8">
          <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
            ({category})
          </p>
          <h4 className="text-subheading lg:text-heading-sm font-inter font-semibold text-primary-500 dark:text-white leading-tight tracking-tighter transition-colors duration-200">
            {title}
          </h4>
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <p className="text-body font-inter text-primary-500/60 dark:text-gray-300 leading-relaxed flex-1 transition-colors duration-200">
              {description1}
            </p>
            <p className="text-body font-inter text-primary-500/60 dark:text-gray-300 leading-relaxed flex-1 transition-colors duration-200">
              {description2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessSection = () => {
  const processSteps = [
    {
      stepNumber: "01",
      category: "Sign Up",
      title: "Create Your Profile.",
      description1: "For job seekers, build a standout profile that showcases your skills and experience. For employers, create a compelling company page to attract top talent.",
      description2: "Our intuitive onboarding makes it easy to get started in minutes, setting the stage for successful connections.",
      image: "/assets/Process1.jpg",
      imageOnLeft: true
    },
    {
      stepNumber: "02",
      category: "Discover",
      title: "Find Your Perfect Match.",
      description1: "Our AI-powered platform intelligently matches candidates with relevant job openings. Job seekers can browse curated lists, while employers receive a shortlist of qualified applicants.",
      description2: "This data-driven approach eliminates the noise, allowing both sides to focus on opportunities with the highest potential for success.",
      image: "/assets/Process2.jpg",
      imageOnLeft: false
    },
    {
      stepNumber: "03",
      category: "Connect",
      title: "Interview & Collaborate.",
      description1: "Once a match is made, our platform facilitates seamless communication. Schedule interviews, exchange messages, and manage the entire hiring process through our integrated tools.",
      description2: "We provide the infrastructure for meaningful conversations, helping you move from initial contact to a formal offer efficiently.",
      image: "/assets/Process3.jpg",
      imageOnLeft: true
    },
    {
      stepNumber: "04",
      category: "Succeed",
      title: "Get Hired & Grow.",
      description1: "Congratulations! Whether you've landed your dream job or hired a key team member, the journey doesn't end here. We provide resources for onboarding and professional development.",
      description2: "We are committed to your long-term success, offering guidance and support to help you thrive in your new role or build a world-class team.",
      image: "/assets/Process4.jpg",
      imageOnLeft: false
    }
  ];

  return (
    <section className="bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (How it works)
              </p>
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (02)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 text-hero tracking-tight transition-colors duration-200">
              PROCESS
            </h2>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight max-w-4xl transition-colors duration-200">
              Our streamlined process makes hiring simple, fast, and effective.
            </p>
          </div>
          
          <div className="flex flex-col gap-0">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                stepNumber={step.stepNumber}
                category={step.category}
                title={step.title}
                description1={step.description1}
                description2={step.description2}
                image={step.image}
                imageOnLeft={step.imageOnLeft}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
