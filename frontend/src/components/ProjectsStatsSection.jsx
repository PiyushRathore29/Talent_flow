import React from 'react';

const StatCard = ({ number, label, description }) => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-impact font-black uppercase text-primary-500 leading-none text-display-sm lg:text-heading">
          {number}
        </h3>
        <p className="text-large font-inter font-semibold text-primary-500 tracking-tighter">
          {label}
        </p>
      </div>
      <p className="text-small font-inter text-primary-500/60 leading-relaxed max-w-sm">
        {description}
      </p>
    </div>
  );
};

const ProjectsStatsSection = () => {
  const stats = [
    {
      number: '10k+',
      label: 'Active Jobs',
      description: 'Access a vast and growing database of job openings from top companies across various industries and locations.'
    },
    {
      number: '500+',
      label: 'Partner Companies',
      description: 'We build long-term partnerships with companies who trust our platform to find the best talent for their teams.'
    },
    {
      number: '24h',
      label: 'Average Response Time',
      description: 'Our platform facilitates quick communication, ensuring you hear back from employers faster than ever.'
    }
  ];

  return (
    <section className="bg-white py-12 lg:py-24 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60">
                (By the Numbers)
              </p>
              <p className="text-medium font-times italic text-primary-500/60">
                (02)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 leading-none text-display">
              SUCCESS THAT COUNTS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                label={stat.label}
                description={stat.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsStatsSection;
