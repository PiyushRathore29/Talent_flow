import React, { useState } from 'react';
import { seedDatabase } from '../lib/seedDatabase';

const DatabaseSeederPage = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [error, setError] = useState(null);

  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true);
      setError(null);
      setSeedingComplete(false);
      
      await seedDatabase();
      
      setSeedingComplete(true);
      setIsSeeding(false);
    } catch (err) {
      setError(err.message);
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border dark:border-gray-800">
          <h1 className="text-display font-impact font-black uppercase text-primary-500 leading-none mb-4 tracking-tight text-center">
            DATABASE SEEDER
          </h1>
          
          <p className="text-large font-impact font-black uppercase text-primary-700 dark:text-primary-400 leading-none tracking-tight text-center mb-8">
            SEED YOUR INDEXEDDB WITH SAMPLE DATA
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-heading-sm font-impact font-black uppercase text-primary-500 leading-none tracking-tight mb-4">
                WHAT WILL BE CREATED:
              </h2>
              <ul className="space-y-2">
                <li className="text-medium font-impact font-black uppercase text-primary-700 dark:text-primary-400 leading-none tracking-tight">
                  • 3 COMPANIES
                </li>
                <li className="text-medium font-impact font-black uppercase text-primary-700 dark:text-primary-400 leading-none tracking-tight">
                  • 55 USERS (5 EMPLOYERS + 50 CANDIDATES)
                </li>
                <li className="text-medium font-impact font-black uppercase text-primary-700 dark:text-primary-400 leading-none tracking-tight">
                  • 25 JOBS (MIXED ACTIVE/ARCHIVED)
                </li>
                <li className="text-medium font-impact font-black uppercase text-primary-700 leading-none tracking-tight">
                  • 100 CANDIDATES (RANDOMLY ASSIGNED)
                </li>
                <li className="text-medium font-impact font-black uppercase text-primary-700 leading-none tracking-tight">
                  • 15+ ASSESSMENTS WITH 10+ QUESTIONS EACH
                </li>
                <li className="text-medium font-impact font-black uppercase text-primary-700 leading-none tracking-tight">
                  • REALISTIC CANDIDATE HISTORIES & RESPONSES
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-medium font-impact font-black uppercase text-red-800 leading-none tracking-tight mb-2">
                  ERROR:
                </h3>
                <p className="text-small font-impact font-black uppercase text-red-700 leading-none tracking-tight">
                  {error}
                </p>
              </div>
            )}

            {seedingComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-medium font-impact font-black uppercase text-green-800 leading-none tracking-tight mb-2">
                  SUCCESS!
                </h3>
                <p className="text-small font-impact font-black uppercase text-green-700 leading-none tracking-tight">
                  DATABASE HAS BEEN SEEDED SUCCESSFULLY! YOU CAN NOW USE ALL THE FEATURES.
                </p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className={`px-8 py-4 rounded-lg font-impact font-black uppercase leading-none tracking-tight transition-all duration-200 ${
                  isSeeding
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:transform hover:scale-105'
                } shadow-lg`}
              >
                {isSeeding ? 'SEEDING DATABASE...' : 'SEED DATABASE NOW'}
              </button>
            </div>

            {isSeeding && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-small font-impact font-black uppercase text-primary-700 leading-none tracking-tight mt-2">
                  CREATING SAMPLE DATA...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSeederPage;