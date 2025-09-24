import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dbHelpers } from './database.js';

// Enhanced store for assessment functionality with IndexedDB integration
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Assessment data
      assessments: [],
      currentAssessment: null,
      assessmentBuilder: {
        currentAssessment: null,
        selectedSection: null,
        selectedQuestion: null,
        previewMode: false
      },
      
      // Loading states
      loading: {},
      errors: {},
      
      // Actions
      setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
      
      setAssessmentBuilder: (updates) => set((state) => ({
        assessmentBuilder: { ...state.assessmentBuilder, ...updates }
      })),
      
      createAssessment: async (assessment) => {
        try {
          // Store in IndexedDB
          const assessmentId = await dbHelpers.createAssessment(assessment);
          const assessmentWithId = { ...assessment, id: assessmentId };
          
          set((state) => ({
            assessments: [...state.assessments, assessmentWithId]
          }));
          return assessmentWithId;
        } catch (error) {
          console.error('Failed to create assessment:', error);
          throw error;
        }
      },
      
      updateAssessment: async (id, updates) => {
        try {
          // Update in IndexedDB
          await dbHelpers.updateAssessment(id, updates);
          
          set((state) => ({
            assessments: state.assessments.map(assessment =>
              assessment.id === id ? { ...assessment, ...updates } : assessment
            )
          }));
          return updates;
        } catch (error) {
          console.error('Failed to update assessment:', error);
          throw error;
        }
      },

      // Assessment response handling
      saveAssessmentResponse: async (assessmentId, candidateId, responses) => {
        try {
          const responseData = {
            assessmentId,
            candidateId,
            questionResponses: responses,
            isCompleted: true,
            submittedAt: new Date(),
            timeTaken: 0 // Could be calculated
          };
          
          const responseId = await dbHelpers.createAssessmentResponse(responseData);
          return responseId;
        } catch (error) {
          console.error('Failed to save assessment response:', error);
          throw error;
        }
      },

      getAssessmentResponse: async (assessmentId, candidateId) => {
        try {
          return await dbHelpers.getCandidateAssessmentResponse(assessmentId, candidateId);
        } catch (error) {
          console.error('Failed to get assessment response:', error);
          throw error;
        }
      },

      getAssessmentResponses: async (assessmentId, candidateId) => {
        try {
          const response = await dbHelpers.getCandidateAssessmentResponse(assessmentId, candidateId);
          return response?.questionResponses || {};
        } catch (error) {
          console.error('Failed to get assessment responses:', error);
          return {};
        }
      },

      // Load assessments from IndexedDB
      loadAssessments: async () => {
        try {
          // For now, we'll load all assessments. In production, you might want to filter by company/user
          const assessments = await dbHelpers.getAssessmentsByJob(null); // This would need to be adapted
          set({ assessments });
          return assessments;
        } catch (error) {
          console.error('Failed to load assessments:', error);
          throw error;
        }
      },
      
      setLoading: (key, value) => set((state) => ({
        loading: { ...state.loading, [key]: value }
      })),
      
      setError: (key, value) => set((state) => ({
        errors: { ...state.errors, [key]: value }
      })),
      
      // Additional methods for assessments list page
      jobs: [],
      syncWithAPI: async () => {
        // Mock sync with API
        console.log('Syncing with API...');
        return Promise.resolve();
      }
    }),
    {
      name: 'assessment-store',
      partialize: (state) => ({
        assessments: state.assessments,
        currentAssessment: state.currentAssessment
      })
    }
  )
);
