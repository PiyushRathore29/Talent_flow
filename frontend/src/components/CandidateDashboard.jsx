import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle } from 'lucide-react';

const CandidateDashboard = () => {
  const applications = [
    { id: 1, title: 'Senior Frontend Developer', company: 'ACME CORP', status: 'Assessment Required', statusIcon: <FileText className="w-4 h-4 text-orange-400" />, link: '/assessment/1' },
    { id: 2, title: 'Product Manager', company: 'KANBA', status: 'Interview Scheduled', statusIcon: <Clock className="w-4 h-4 text-primary-400" /> },
    { id: 3, title: 'UX/UI Designer', company: 'UTOSIA', status: 'Application Submitted', statusIcon: <CheckCircle className="w-4 h-4 text-teal-500" /> },
  ];

  return (
    <section className="min-h-screen bg-primary-50 py-24">
      <div className="pt-16 pb-12 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <h1 className="text-heading font-impact font-black uppercase text-primary-500">My Applications</h1>
            <p className="mt-2 text-body text-primary-500/70">Track the status of your job applications.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="p-6 font-inter font-semibold text-primary-700">Job Title</th>
                    <th className="p-6 font-inter font-semibold text-primary-700">Company</th>
                    <th className="p-6 font-inter font-semibold text-primary-700">Status</th>
                    <th className="p-6 font-inter font-semibold text-primary-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={app.id} className={index < applications.length - 1 ? 'border-b' : ''}>
                      <td className="p-6 font-inter font-semibold text-primary-500">{app.title}</td>
                      <td className="p-6 font-inter text-primary-500/80">{app.company}</td>
                      <td className="p-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-600">
                          {app.statusIcon}
                          {app.status}
                        </span>
                      </td>
                      <td className="p-6">
                        {app.link ? (
                          <Link to={app.link} className="font-inter font-semibold text-primary-400 hover:underline">
                            Take Assessment
                          </Link>
                        ) : (
                          <span className="font-inter text-gray-400">No Action Required</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandidateDashboard;
