import React from 'react';

const ProjectCard = ({ title, category, image, isLarge = false }) => {
  return (
    <div className={`w-full ${isLarge ? 'aspect-[16/10]' : 'aspect-[16/12]'} bg-primary-500 relative overflow-hidden group cursor-pointer rounded-lg`}>
      {image && (
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/90 via-primary-500/20 to-transparent group-hover:from-primary-500/70 transition-all duration-500" />
      
      <div className="absolute bottom-6 lg:bottom-12 left-6 lg:left-12 right-6 lg:right-12 z-10">
        <div className="flex flex-col gap-2 lg:gap-4">
          <p className="text-medium font-times italic text-white/80">
            ({category})
          </p>
          <h3 className="font-impact font-black uppercase text-white leading-none text-display-sm lg:text-heading tracking-tight">
            {title}
          </h3>
        </div>
      </div>
      
      <div className="absolute top-6 lg:top-12 right-6 lg:right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 15L15 1M15 1H1M15 1V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const projects = [
    {
      title: 'ACME CORP',
      category: 'Senior Frontend Developer',
      image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
      isLarge: true
    },
    {
      title: 'KANBA',
      category: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80'
    },
    {
      title: 'UTOSIA',
      category: 'UX/UI Designer',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80'
    },
    {
      title: 'GOLDLINE',
      category: 'Data Scientist',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
      isLarge: true
    },
    {
      title: 'NEXUS',
      category: 'DevOps Engineer',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80'
    },
    {
      title: 'VERTEX',
      category: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80'
    }
  ];

  return (
    <section className="bg-white pb-12 lg:pb-24 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                category={project.category}
                image={project.image}
                isLarge={project.isLarge}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
