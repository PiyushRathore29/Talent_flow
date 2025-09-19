import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { jobsData } from '../data/jobsData';

const ProjectCard = ({ id, title, category, image, isLarge = false }) => {
  return (
    <Link to={`/jobs/${id}`} className={`block w-full ${isLarge ? 'aspect-[16/10]' : 'aspect-[16/12]'} bg-primary-500 relative overflow-hidden group cursor-pointer rounded-lg`}>
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
    </Link>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-16">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="px-4 py-2 bg-primary-100 text-primary-600 rounded-md disabled:opacity-50 font-semibold"
      >
        Prev
      </button>
      <span className="text-primary-500 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-primary-100 text-primary-600 rounded-md disabled:opacity-50 font-semibold"
      >
        Next
      </button>
    </div>
  );
};

const ProjectsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  const filteredJobs = useMemo(() => {
    return jobsData.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <section className="bg-white pb-12 lg:pb-24 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or category..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-primary-100 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              />
            </div>
          </div>

          {paginatedJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {paginatedJobs.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  category={project.category}
                  image={project.image}
                  isLarge={project.isLarge}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-primary-500">No jobs found</h3>
              <p className="text-primary-500/70 mt-2">Try adjusting your search terms.</p>
            </div>
          )}
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
