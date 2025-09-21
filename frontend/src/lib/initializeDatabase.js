import { db } from './database.js';
import { seedDatabase } from './seedDatabase.js';

// Auto-seed the database if it's empty
export const initializeDatabase = async () => {
  try {
    // Check if database has any data
    const jobCount = await db.jobs.count();
    const candidateCount = await db.candidates.count();
    
    if (jobCount === 0 && candidateCount === 0) {
      console.log('🌱 Database is empty, auto-seeding with sample data...');
      await seedDatabase();
      console.log('✅ Auto-seeding complete!');
    } else {
      console.log('📊 Database already contains data:', { jobs: jobCount, candidates: candidateCount });
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// Export the database and helper for use in the app
export { db } from './database.js';
export { seedDatabase } from './seedDatabase.js';