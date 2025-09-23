import { db } from './database.js';
import { seedDatabase } from './seedDatabase.js';

// Auto-seed the database if it's empty
export const initializeDatabase = async () => {
  try {
    // Check if database has any data
    const jobCount = await db.jobs.count();
    const candidateCount = await db.candidates.count();
    
    console.log('🔍 Database check:', { jobs: jobCount, candidates: candidateCount });
    
    if (jobCount === 0 && candidateCount === 0) {
      console.log('🌱 Database is empty, auto-seeding with sample data...');
      await seedDatabase();
      console.log('✅ Auto-seeding complete!');
      
      // Verify seeding worked
      const newJobCount = await db.jobs.count();
      const newCandidateCount = await db.candidates.count();
      console.log('📊 After seeding:', { jobs: newJobCount, candidates: newCandidateCount });
    } else {
      console.log('📊 Database already contains data:', { jobs: jobCount, candidates: candidateCount });
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// Force re-seed the database (clears existing data)
export const forceReSeedDatabase = async () => {
  try {
    console.log('🧹 Force re-seeding: clearing existing data...');
    await seedDatabase(); // seedDatabase() already clears data first
    console.log('✅ Force re-seeding complete!');
    
    // Verify seeding worked
    const jobCount = await db.jobs.count();
    const candidateCount = await db.candidates.count();
    console.log('📊 After force re-seeding:', { jobs: jobCount, candidates: candidateCount });
  } catch (error) {
    console.error('❌ Error force re-seeding database:', error);
  }
};

// Export the database and helper for use in the app
export { db } from './database.js';
export { seedDatabase } from './seedDatabase.js';