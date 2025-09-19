import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const JobModal = ({ isOpen, onClose, onSave, job }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold font-inter text-primary-500 mb-6">{job ? 'Edit Job' : 'Create New Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 font-inter">Job Title</label>
              <input
                type="text"
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 font-inter">Job Description</label>
              <textarea
                id="job-description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
