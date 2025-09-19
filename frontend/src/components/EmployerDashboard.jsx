import React, { useState } from 'react';
import { Plus, Edit, Archive, Users } from 'lucide-react';
import JobModal from './JobModal';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior Frontend Developer', status: 'Active', applicants: 42, description: 'Looking for a skilled React developer.' },
    { id: 2, title: 'Product Manager', status: 'Active', applicants: 78, description: 'Lead our next generation of products.' },
    { id: 3, title: 'UX/UI Designer', status: 'Archived', applicants: 120, description: 'Create beautiful and intuitive user experiences.' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const handleOpenModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      setJobs(jobs.map(job => job.id === editingJob.id ? { ...job, ...jobData } : job));
    } else {
      setJobs([...jobs, { ...jobData, id: Date.now(), applicants: 0, status: 'Active' }]);
    }
    handleCloseModal();
  };
  
  const handleArchiveJob = (jobId) => {
      setJobs(jobs.map(job => job.id === jobId ? {...job, status: job.status === 'Active' ? 'Archived' : 'Active'} : job));
  };


  return (
    <section className="min-h-screen bg-primary-50 py-24">
      <div className="pt-16 pb-12 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-heading font-impact font-black uppercase text-primary-500">Job Listings</h1>
              <p className="mt-2 text-body text-primary-500/70">Manage your company's open positions.</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-lg text-nav font-inter font-semibold hover:bg-primary-400/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Job
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="p-6 font-inter font-semibold text-primary-700">Job Title</th>
                    <th className="p-6 font-inter font-semibold text-primary-700">Status</th>
                    <th className="p-6 font-inter font-semibold text-primary-700">Applicants</th>
                    <th className="p-6 font-inter font-semibold text-primary-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <tr key={job.id} className={index < jobs.length - 1 ? 'border-b' : ''}>
                      <td className="p-6 font-inter font-semibold text-primary-500">{job.title}</td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${job.status === 'Active' ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-600'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-primary-500/80">
                            <Users className="w-4 h-4" />
                            <span>{job.applicants}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end items-center gap-4">
                            <button onClick={() => handleOpenModal(job)} className="text-primary-400 hover:text-primary-500"><Edit className="w-5 h-5" /></button>
                            <button onClick={() => handleArchiveJob(job.id)} className="text-orange-400 hover:text-orange-500"><Archive className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <JobModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveJob} job={editingJob} />
    </section>
  );
};

export default EmployerDashboard;
