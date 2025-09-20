import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';

const JobModal = ({ isOpen, onClose, onSave, job }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'Full-time',
    responsibilities: '',
    qualifications: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        salary: job.salary || '',
        type: job.type || 'Full-time',
        responsibilities: job.responsibilities || '',
        qualifications: job.qualifications || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: '',
        type: 'Full-time',
        responsibilities: '',
        qualifications: ''
      });
    }
  }, [job, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold font-inter text-primary-500 mb-6">{job ? 'Edit Job' : 'Create New Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 font-inter">Job Title *</label>
              <input
                type="text"
                id="job-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="job-location" className="block text-sm font-medium text-gray-700 font-inter">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  id="job-location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote, New York, NY"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="job-salary" className="block text-sm font-medium text-gray-700 font-inter">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Salary
                </label>
                <input
                  type="text"
                  id="job-salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., $80,000 - $120,000"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="job-type" className="block text-sm font-medium text-gray-700 font-inter">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Type
              </label>
              <select
                id="job-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 font-inter">Job Description *</label>
              <textarea
                id="job-description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief overview of the role and company..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="job-responsibilities" className="block text-sm font-medium text-gray-700 font-inter">Responsibilities</label>
              <textarea
                id="job-responsibilities"
                name="responsibilities"
                rows="4"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="• Develop and implement user-facing features&#10;• Ensure technical feasibility of UI/UX designs&#10;• Optimize applications for maximum speed"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <label htmlFor="job-qualifications" className="block text-sm font-medium text-gray-700 font-inter">Qualifications</label>
              <textarea
                id="job-qualifications"
                name="qualifications"
                rows="4"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="• 5+ years of experience in frontend development&#10;• Proficient in React, JavaScript (ES6+), HTML5, and CSS3&#10;• Experience with state management libraries"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
              ></textarea>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-400 hover:bg-primary-400/90">
              {job ? 'Save Changes' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
