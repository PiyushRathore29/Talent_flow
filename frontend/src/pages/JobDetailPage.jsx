import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { jobsData } from '../data/jobsData';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const job = jobsData.find(j => j.id.toString() === jobId);

  if (!job) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-500">Job Not Found</h1>
            <p className="mt-4 text-primary-500/70">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs" className="mt-6 inline-block bg-primary-400 text-white px-6 py-3 rounded-lg font-semibold">
              Back to Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-32 lg:pt-48 pb-24 bg-white">
        <div className="px-4 sm:px-8 lg:px-24">
          <div className="max-w-screen-lg mx-auto">
            <div className="mb-12">
              <p className="text-medium font-times italic text-primary-500/60 mb-4">({job.category})</p>
              <h1 className="text-heading font-impact font-black uppercase text-primary-500 leading-none tracking-tight">{job.title}</h1>
              <p className="text-subheading font-inter font-semibold text-primary-500/80 mt-2">{job.company}</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-primary-500/80 mb-12">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold">{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Posted {job.posted}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none font-inter text-primary-500/90 leading-relaxed">
              <h2 className="font-impact text-display-sm uppercase text-primary-500">Job Description</h2>
              <p>{job.description}</p>

              <h2 className="font-impact text-display-sm uppercase text-primary-500 mt-12">Responsibilities</h2>
              <ul>
                {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
              </ul>

              <h2 className="font-impact text-display-sm uppercase text-primary-500 mt-12">Qualifications</h2>
              <ul>
                {job.qualifications.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div className="mt-16 text-center">
              <Link
                to="/signup/candidate"
                className="inline-block bg-primary-400 text-white px-12 py-4 rounded-lg text-lg font-inter font-semibold hover:bg-primary-400/90 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JobDetailPage;
