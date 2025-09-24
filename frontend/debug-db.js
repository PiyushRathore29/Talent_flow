// Simple script to check database contents
import { db, dbHelpers } from './src/lib/database.js';
import { seedAssessments } from './src/lib/seedAssessments.js';

async function checkDatabase() {
  try {
    const candidates = await dbHelpers.getAllCandidates();
    
    if (candidates.length > 0) {
      candidates.slice(0, 5).forEach((candidate, index) => {
        console.log(`${index + 1}. ID: ${candidate.id}, Name: ${candidate.name}, Stage: ${candidate.stage}, Current Stage: ${candidate.currentStage}, Job ID: ${candidate.jobId}`);
      });
      
      // Look for candidates in tech stage
      const techCandidates = candidates.filter(c => 
        c.stage === 'tech' || 
        c.currentStage === 'tech' || 
        c.currentStage === 'Technical' ||
        c.stage === 'technical'
      );
      
      techCandidates.forEach((candidate, index) => {
        console.log(`${index + 1}. ID: ${candidate.id}, Name: ${candidate.name}, Stage: ${candidate.stage}, Current Stage: ${candidate.currentStage}, Job ID: ${candidate.jobId}`);
      });
    }
    
    const assessments = await db.assessments.toArray();
    if (assessments.length > 0) {
      assessments.forEach((assessment, index) => {
        console.log(`${index + 1}. ID: ${assessment.id}, Job ID: ${assessment.jobId}, Title: ${assessment.title}, Sections: ${assessment.sections?.length || 0}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Function to seed assessments manually
async function seedAssessmentsManually() {
  try {
    await seedAssessments();
  } catch (error) {
    console.error('❌ Error seeding assessments:', error);
  }
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.seedAssessments = seedAssessmentsManually;
  window.checkDatabase = checkDatabase;
}

checkDatabase();