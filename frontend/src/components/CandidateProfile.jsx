import React from 'react';
import { User, Mail, Briefcase } from 'lucide-react';
import ProfileTimeline from './ProfileTimeline';
import NotesSection from './NotesSection';

const CandidateProfile = ({ candidate }) => {
  return (
    <div className="space-y-16">
      <header>
        <div className="flex items-center gap-6 mb-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h1 className="text-heading font-impact font-black uppercase text-primary-500">{candidate.name}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${candidate.email}`} className="hover:underline">{candidate.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Applied for: {candidate.jobTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <NotesSection candidate={candidate} />
        </div>
        <div>
          <ProfileTimeline history={candidate.history} />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
