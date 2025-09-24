import { db } from './database.js';
import { seedDatabase } from './seedDatabase.js';
import { seedAssessments } from './seedAssessments.js';

// Auto-seed the database if it's empty
export const initializeDatabase = async () => {
  try {
    // Check if database has any data
    const jobCount = await db.jobs.count();
    const candidateCount = await db.candidates.count();
    
    if (jobCount === 0 && candidateCount === 0) {
      await seedDatabase();
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// Force re-seed the database (clears existing data)
export const forceReSeedDatabase = async () => {
  try {
    await seedDatabase(); // seedDatabase() already clears data first
  } catch (error) {
    console.error('❌ Error force re-seeding database:', error);
  }
};

// Force re-seed only assessments
export const forceReSeedAssessments = async () => {
  try {
    await seedAssessments();
  } catch (error) {
    console.error('❌ Error force re-seeding assessments:', error);
  }
};

// Export the database and helper for use in the app
export { db } from './database.js';
export { seedDatabase } from './seedDatabase.js';
export { seedAssessments } from './seedAssessments.js';