import React from 'react';

const AwardCard = ({ backgroundColor, accentColor, title, subtitle, description }) => {
  return (
    <div 
      className="w-full aspect-[3/4] p-6 lg:p-9 flex flex-col justify-between rounded-lg"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col gap-4 lg:gap-7">
        <div className="w-16 lg:w-[4.625rem] h-8 lg:h-[2.21rem]">
          <svg viewBox="0 0 75 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g>
              <path d="M56.72 0.5h16.95v35H56.72z" fill="white"/>
              <path d="M37.54 0.81h16.8v34.69H37.54z" fill="white"/>
              <path d="M17.97 0.81h18.24v34.38H17.97z" fill="white"/>
              <path d="M0 0.81h17.71v34.38H0z" fill="white"/>
            </g>
          </svg>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 lg:gap-4">
            <h3 className="font-helvetica font-bold leading-none whitespace-pre-line text-subheading" style={{ color: accentColor }}>
              {title}
            </h3>
            <p className="font-helvetica font-bold leading-tight text-white text-body">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 lg:gap-7">
        <div className="flex flex-col gap-1 lg:gap-2">
          <div className="flex flex-col">
            <p className="font-helvetica text-white leading-tight text-caption">
              Milestone
            </p>
          </div>
          <p className="font-helvetica leading-relaxed text-tiny" style={{ color: accentColor }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const AwardsSection = () => {
  const awards = [
    {
      backgroundColor: '#4A61E2',
      accentColor: '#ACB5F7',
      title: '10,000+\nPlacements',
      subtitle: 'Talent Flow.',
      description: 'We have successfully connected over 10,000 talented professionals with their dream jobs at leading companies worldwide.'
    },
    {
      backgroundColor: '#3C7C71',
      accentColor: '#6BB5A8',
      title: 'Top HR Tech\n2024',
      subtitle: 'Talent Flow.',
      description: 'Recognized as a leading innovator in the HR technology space for our intelligent matching algorithms and user-centric design.'
    },
    {
      backgroundColor: '#9CD3D6',
      accentColor: '#37999D',
      title: 'Fastest Growing Platform',
      subtitle: 'Talent Flow.',
      description: 'Our rapid growth is a testament to the trust placed in us by both job seekers and employers to facilitate meaningful career connections.'
    },
    {
      backgroundColor: '#DE7C41',
      accentColor: '#A44F1C',
      title: '500+ Partner Companies',
      subtitle: 'Talent Flow.',
      description: 'From innovative startups to Fortune 500 giants, we partner with a diverse range of companies to bring you the best opportunities.'
    },
    {
      backgroundColor: '#F55733',
      accentColor: '#CB2C13',
      title: '98% User Satisfaction',
      subtitle: 'Talent Flow.',
      description: 'Our commitment to a seamless and effective experience has earned us a high satisfaction rating from our community of users.'
    },
    {
      backgroundColor: '#E53E48',
      accentColor: '#9E151D',
      title: 'Global Reach',
      subtitle: 'Talent Flow.',
      description: 'Connecting talent across continents, our platform supports hiring in over 50 countries, fostering a global workforce.'
    },
    {
      backgroundColor: '#5C4782',
      accentColor: '#9B83B0',
      title: 'AI-Powered Matching',
      subtitle: 'Talent Flow.',
      description: 'Our advanced AI helps filter through the noise, matching the right candidates with the right roles faster than ever before.'
    },
    {
      backgroundColor: '#070707',
      accentColor: '#868686',
      title: 'Diversity & Inclusion',
      subtitle: 'Talent Flow.',
      description: 'We are committed to building diverse teams and promoting inclusive hiring practices across our entire platform.'
    },
    {
      backgroundColor: '#9CD3D6',
      accentColor: '#37999D',
      title: 'Community Choice Award',
      subtitle: 'Talent Flow.',
      description: 'Voted by our users as the most trusted platform for career development and talent acquisition.'
    }
  ];

  const companyAchievements = [
    { name: 'Forbes 30 Under 30', year: '(2024)' },
    { name: 'Inc. 5000 Fastest-Growing', year: '(2024)' },
    { name: 'Best Place to Work', year: '(2023)' },
    { name: 'TechCrunch Disrupt Winner', year: '(2023)' },
    { name: 'Webby Award for Employment', year: '(2022)' },
    { name: 'HR Tech Innovator of the Year', year: '(2021)' }
  ];

  const platformRecognition = [
    { name: 'Awwwards Site of the Day', year: '(2023)' },
    { name: 'CSS Design Awards', year: '(2023)' },
    { name: 'FWA Site of the Day', year: '(2023)' },
    { name: 'UX Design Award Winner', year: '(2023)' },
    { name: 'Best Mobile Experience', year: '(2023)' },
    { name: 'G2 High Performer', year: '(2023)' }
  ];

  return (
    <section className="bg-white dark:bg-black py-12 lg:py-24 overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (What we achieved)
              </p>
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (02)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 text-hero transition-colors duration-200">
              OUR IMPACT
            </h2>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight max-w-2xl transition-colors duration-200">
              We're proud of the connections we've built and the careers we've shaped.
            </p>
          </div>
          
          <div className="flex justify-center mb-16 lg:mb-32">
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {awards.map((award, index) => (
                  <AwardCard
                    key={index}
                    backgroundColor={award.backgroundColor}
                    accentColor={award.accentColor}
                    title={award.title}
                    subtitle={award.subtitle}
                    description={award.description}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto bg-primary-50 dark:bg-gray-900 p-8 lg:p-24 flex flex-col lg:flex-row gap-16 lg:gap-32 transition-colors duration-200">
            <div className="flex-1">
              <h3 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-6 lg:mb-8 text-display-sm transition-colors duration-200">
                COMPANY<br />ACHIEVEMENTS
              </h3>
              
              <div className="space-y-0">
                {companyAchievements.map((award, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 lg:py-6 gap-2">
                      <span className="text-large font-inter font-semibold text-primary-500 dark:text-white tracking-tighter transition-colors duration-200">
                        {award.name}
                      </span>
                      <span className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                        {award.year}
                      </span>
                    </div>
                    {index < companyAchievements.length - 1 && (
                      <div className="w-full h-px bg-primary-200 dark:bg-gray-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-tight mb-6 lg:mb-8 text-display-sm transition-colors duration-200">
                PLATFORM<br />RECOGNITION
              </h3>
              
              <div className="space-y-0">
                {platformRecognition.map((award, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 lg:py-6 gap-2">
                      <span className="text-large font-inter font-semibold text-primary-500 dark:text-white tracking-tighter transition-colors duration-200">
                        {award.name}
                      </span>
                      <span className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                        {award.year}
                      </span>
                    </div>
                    {index < platformRecognition.length - 1 && (
                      <div className="w-full h-px bg-primary-200 dark:bg-gray-700" />
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

export default AwardsSection;
