import React from 'react';
import { MapPin, Users, Briefcase, ExternalLink } from 'lucide-react';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 overflow-hidden transition-colors duration-200 hover:shadow-lg">
      <div className="aspect-[16/9] relative">
        <img 
          src={company.image}
          alt={`${company.name} office`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            company.hiring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {company.hiring ? 'Actively Hiring' : 'Not Hiring'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-subheading font-impact font-black uppercase text-primary-500 dark:text-white leading-tight tracking-tight transition-colors duration-200">
              {company.name}
            </h3>
            <p className="text-body font-inter text-primary-500/60 dark:text-gray-400 mt-1 transition-colors duration-200">
              {company.industry}
            </p>
          </div>
          <button className="p-2 text-primary-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-small font-inter text-primary-500/60 dark:text-gray-300 leading-relaxed mb-6 transition-colors duration-200">
          {company.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-500/60 dark:text-gray-400" />
            <span className="text-small font-inter text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
              {company.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500/60 dark:text-gray-400" />
            <span className="text-small font-inter text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
              {company.employees}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary-500/60 dark:text-gray-400" />
            <span className="text-small font-inter text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
              {company.openRoles} open roles
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {company.benefits.map((benefit, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs font-medium bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-gray-300 rounded transition-colors duration-200"
            >
              {benefit}
            </span>
          ))}
        </div>
        
        <button className="w-full px-4 py-3 bg-primary-500 text-white text-small font-inter font-semibold rounded-lg hover:bg-primary-600 transition-colors">
          View Company Profile
        </button>
      </div>
    </div>
  );
};

const CompaniesSection = () => {
  const companies = [
    {
      name: "TechNova Inc.",
      industry: "Software Development",
      description: "Leading software development company specializing in AI-powered solutions for enterprise clients. We're building the future of technology with cutting-edge innovations.",
      location: "San Francisco, CA",
      employees: "500-1000",
      openRoles: 24,
      hiring: true,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=center",
      benefits: ["Remote Work", "Health Insurance", "Stock Options", "Learning Budget"]
    },
    {
      name: "GreenEnergy Corp",
      industry: "Renewable Energy",
      description: "Pioneering sustainable energy solutions for a cleaner tomorrow. We develop innovative renewable energy technologies and infrastructure projects worldwide.",
      location: "Austin, TX",
      employees: "1000-5000",
      openRoles: 18,
      hiring: true,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&crop=center",
      benefits: ["Flexible Hours", "401k Match", "Green Commute", "Wellness Program"]
    },
    {
      name: "FinanceFlow",
      industry: "Financial Technology",
      description: "Revolutionary fintech company transforming how businesses manage their finances. Our platform serves over 50,000 companies globally with advanced financial tools.",
      location: "New York, NY",
      employees: "200-500",
      openRoles: 12,
      hiring: true,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&crop=center",
      benefits: ["Competitive Salary", "Bonus Program", "Professional Development", "Team Events"]
    },
    {
      name: "HealthTech Solutions",
      industry: "Healthcare Technology",
      description: "Innovative healthcare technology company focused on improving patient outcomes through digital health solutions and telemedicine platforms.",
      location: "Boston, MA",
      employees: "100-500",
      openRoles: 8,
      hiring: false,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
      benefits: ["Health Coverage", "Research Time", "Conference Attendance", "Work-Life Balance"]
    },
    {
      name: "EduLearn Platform",
      industry: "Education Technology",
      description: "Leading educational technology platform serving millions of students worldwide. We're democratizing access to quality education through innovative learning tools.",
      location: "Seattle, WA",
      employees: "300-1000",
      openRoles: 15,
      hiring: true,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&crop=center",
      benefits: ["Learning Stipend", "Flexible PTO", "Mentorship Program", "Impact Focus"]
    },
    {
      name: "CloudSync Technologies",
      industry: "Cloud Infrastructure",
      description: "Next-generation cloud infrastructure provider helping businesses scale their operations. We offer secure, reliable, and high-performance cloud solutions.",
      location: "Denver, CO",
      employees: "500-1000",
      openRoles: 22,
      hiring: true,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=center",
      benefits: ["Remote First", "Unlimited PTO", "Equipment Budget", "Career Growth"]
    },
    {
      name: "RetailRevolution",
      industry: "E-commerce & Retail",
      description: "Transforming the retail experience through innovative e-commerce solutions and omnichannel strategies. We help brands connect with customers everywhere.",
      location: "Los Angeles, CA",
      employees: "200-500",
      openRoles: 9,
      hiring: true,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center",
      benefits: ["Employee Discounts", "Creative Freedom", "Team Retreats", "Innovation Days"]
    }
  ];

  return (
    <section className="bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (Our Partners)
              </p>
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 transition-colors duration-200">
                (01)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-none mb-4 lg:mb-8 text-display transition-colors duration-200">
              LEADING COMPANIES
            </h2>
            <p className="text-heading font-inter font-semibold text-primary-500 dark:text-gray-300 leading-tight max-w-2xl transition-colors duration-200">
              Discover innovative companies that are actively building their teams through our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <CompanyCard key={index} company={company} />
            ))}
          </div>
          
          <div className="text-center mt-16 lg:mt-24">
            <button className="px-8 py-4 bg-primary-500 text-white text-large font-inter font-semibold rounded-lg hover:bg-primary-600 transition-colors">
              View All Companies
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;