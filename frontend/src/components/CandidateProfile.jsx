import React from 'react';
import { User, Mail, Briefcase, Phone, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileTimeline from './ProfileTimeline';
import NotesSection from './NotesSection';

const getStageColor = (stage) => {
  switch (stage) {
    case 'APPLIED': return 'bg-blue-100 text-blue-800';
    case 'SCREENING': return 'bg-yellow-100 text-yellow-800';
    case 'INTERVIEW': return 'bg-purple-100 text-purple-800';
    case 'OFFER': return 'bg-green-100 text-green-800';
    case 'HIRED': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CandidateProfile = ({ candidate }) => {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link 
        to="/candidates" 
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidates Board
      </Link>

      {/* Header */}
      <header className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Applied for {candidate.jobTitle}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(candidate.currentStage)}`}>
                  {candidate.currentStage}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${candidate.email}`} className="hover:text-primary-600 transition-colors">
                  {candidate.email}
                </a>
              </div>
              
              {candidate.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${candidate.phone}`} className="hover:text-primary-600 transition-colors">
                    {candidate.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Applied on {new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Resume Link */}
        {candidate.resumeUrl && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a 
              href={candidate.resumeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View Resume
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <NotesSection candidate={candidate} />
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <ProfileTimeline history={candidate.history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
