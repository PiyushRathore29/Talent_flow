import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Assessment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit assessment
    alert('Assessment submitted successfully!');
    navigate('/dashboard/candidate');
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-heading font-impact font-black uppercase text-primary-500">
            Skills Assessment
          </h2>
          <p className="mt-2 text-center text-body text-primary-500/70">
            For Senior Frontend Developer at ACME CORP
          </p>
        </div>
        <form className="mt-8 space-y-8 bg-primary-50 p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block font-inter font-semibold text-primary-600">
              1. Describe your experience with React Hooks.
            </label>
            <textarea
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400"
              placeholder="Your answer here..."
              required
            ></textarea>
          </div>
          <div className="space-y-4">
            <p className="block font-inter font-semibold text-primary-600">
              2. Which of the following is NOT a core principle of responsive design?
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="q2-a" name="q2" type="radio" className="h-4 w-4 text-primary-400 border-gray-300 focus:ring-primary-400" required />
                <label htmlFor="q2-a" className="ml-3 block text-sm font-medium text-gray-700">Fluid Grids</label>
              </div>
              <div className="flex items-center">
                <input id="q2-b" name="q2" type="radio" className="h-4 w-4 text-primary-400 border-gray-300 focus:ring-primary-400" />
                <label htmlFor="q2-b" className="ml-3 block text-sm font-medium text-gray-700">Flexible Images</label>
              </div>
              <div className="flex items-center">
                <input id="q2-c" name="q2" type="radio" className="h-4 w-4 text-primary-400 border-gray-300 focus:ring-primary-400" />
                <label htmlFor="q2-c" className="ml-3 block text-sm font-medium text-gray-700">Fixed-width Containers</label>
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-400/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-inter font-semibold">
              Submit Assessment
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Assessment;
