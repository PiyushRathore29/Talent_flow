import React from 'react';

const ServiceDetail = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-subheading font-inter font-semibold text-primary-500 leading-tight tracking-tighter">
        {title}
      </h4>
      <p className="text-body font-inter text-primary-500/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const BrandStrategySection = () => {
  const services = [
    {
      title: "Intelligent Candidate Matching",
      description: "Our AI-powered algorithm analyzes job requirements and candidate profiles to provide highly accurate matches, saving you time and effort. We go beyond keywords to match skills, experience, and cultural fit, ensuring you find the best candidates for your team."
    },
    {
      title: "Seamless Applicant Tracking", 
      description: "Manage your entire hiring pipeline from a single, intuitive dashboard. Track applicants, schedule interviews, and collaborate with your team to make faster, more informed hiring decisions. Our system simplifies complexity, letting you focus on finding the right person."
    },
    {
      title: "Company Branding Pages",
      description: "Showcase your company culture and attract top talent with beautiful, customizable branding pages. Highlight your mission, values, and perks to give candidates a compelling reason to join your team. A strong employer brand is your competitive advantage."
    },
    {
      title: "Data-Driven Insights",
      description: "Gain valuable insights into your hiring process with our advanced analytics. Track key metrics like time-to-hire, cost-per-hire, and candidate source effectiveness to optimize your recruitment strategy and improve your ROI."
    }
  ];

  return (
    <section className="bg-white py-12 lg:py-24 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="lg:w-2/5">
              <h2 className="font-impact font-black uppercase text-primary-500 leading-none text-display lg:text-display-sm tracking-tight">
                FOR<br />EMPLOYERS
              </h2>
            </div>
            
            <div className="lg:w-3/5 flex flex-col gap-12 lg:gap-20">
              <div className="flex flex-col gap-8">
                <p className="text-large font-inter font-semibold text-primary-500 leading-tight tracking-tighter">
                  We provide powerful tools to help you find, attract, and hire the best talent, streamlining your recruitment process from start to finish.
                </p>
              </div>
              
              <div className="flex flex-col gap-12">
                {services.map((service, index) => (
                  <div key={index}>
                    <ServiceDetail
                      title={service.title}
                      description={service.description}
                    />
                    {index < services.length - 1 && (
                      <div className="w-full h-px bg-primary-200 mt-12" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStrategySection;
