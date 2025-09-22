import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectsPage = () => {
  const projects = [
    {
      id: 1,
      name: "ACME",
      description: "Revolutionary recruitment platform for tech startups",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Tech Platform"
    },
    {
      id: 2,
      name: "KANBA",
      description: "Global talent acquisition system for remote teams",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Remote Work"
    },
    {
      id: 3,
      name: "UTOPIA",
      description: "AI-powered candidate matching for creative industries",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Creative Tech"
    },
    {
      id: 4,
      name: "GOLDLINE",
      description: "Enterprise-grade recruitment analytics dashboard",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Analytics"
    },
    {
      id: 5,
      name: "KAJO©",
      description: "Innovative mobile recruitment app for Gen Z professionals",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      category: "Mobile App"
    }
  ];

  return (
    <section className="bg-white dark:bg-black overflow-hidden transition-colors duration-200 relative">
      <Header />
      
      <div className="pt-32 lg:pt-40 pb-12 lg:pb-24 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          
          {/* Header Section - Same spacing as HeroSection */}
          <div className="mb-12 lg:mb-24">
            <h1 className="text-hero font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 transition-colors duration-200">
              PROJECTS
            </h1>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight tracking-tight max-w-4xl transition-colors duration-200">
              View our work, reflecting unique solutions for diverse client needs.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]"
              >
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity duration-300 group-hover:bg-black/50 dark:group-hover:bg-black/70" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
                    {/* Top Badge */}
                    <div className="flex justify-between items-start">
                      <span className="bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-small font-medium">
                        {project.category}
                      </span>
                      <span className="text-white/60 text-small font-mono">
                        0{index + 1}
                      </span>
                    </div>
                    
                    {/* Bottom Content */}
                    <div>
                      <h2 className="text-hero font-impact font-black uppercase text-white leading-none mb-4 lg:mb-8 transition-colors duration-200 tracking-tight">
                        {project.name}
                      </h2>
                      <p className="text-white/90 text-body max-w-lg mb-6">
                        {project.description}
                      </p>
                      
                      {/* Action Button */}
                      <button className="inline-flex items-center gap-2 bg-primary-400 dark:bg-primary-600 text-white px-6 py-3 rounded-lg text-large font-semibold hover:bg-primary-500 dark:hover:bg-primary-700 transition-colors">
                        View Case Study
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-12 lg:p-16">
              <h2 className="text-hero font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 transition-colors duration-200">
                Ready to Start Your Project?
              </h2>
              <p className="text-body text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's collaborate and create something extraordinary together. Our team is ready to bring your vision to life.
              </p>
              <button className="bg-primary-400 dark:bg-primary-600 text-white px-8 py-4 rounded-lg text-large font-semibold hover:bg-primary-500 dark:hover:bg-primary-700 transition-colors">
                Start a Project
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </section>
  );
};

export default ProjectsPage;
