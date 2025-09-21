import { http, HttpResponse } from 'msw';
import { db } from '../lib/database.js';

// Helper function to calculate score for submitted assessment
const calculateScore = (assessment, responses) => {
  let totalPoints = 0;
  let earnedPoints = 0;
  
  assessment.questions.forEach(question => {
    const questionPoints = question.points || 1;
    totalPoints += questionPoints;
    
    const response = responses[question.id];
    if (!response) return;
    
    let isCorrect = false;
    
    switch (question.type) {
      case 'multiple_choice':
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = response === correctOption?.id;
        break;
        
      case 'boolean':
        isCorrect = response === question.correctAnswer;
        break;
        
      case 'rating':
        // For rating questions, give full points if answered
        isCorrect = true;
        break;
        
      case 'text':
        // For text questions, give full points if answered (in real app, would need manual grading)
        isCorrect = response && response.trim().length >= (question.minLength || 0);
        break;
    }
    
    if (isCorrect) {
      earnedPoints += questionPoints;
    }
  });
  
  return Math.round((earnedPoints / totalPoints) * 100);
};

export const assessmentHandlers = [
  // GET /assessments - Get all assessments
  http.get('/api/assessments', async ({ request }) => {
    try {
      const url = new URL(request.url);
      const companyId = url.searchParams.get('companyId');
      
      let assessments = await db.assessments.toArray();
      
      // Filter by company if specified
      if (companyId) {
        assessments = assessments.filter(a => a.companyId === parseInt(companyId));
      }
      
      // Add status based on responses
      const assessmentsWithStatus = await Promise.all(
        assessments.map(async (assessment) => {
          const responses = await db.assessmentResponses
            .where('assessmentId')
            .equals(assessment.id)
            .toArray();
          
          const completedCount = responses.filter(r => r.isCompleted).length;
          const inProgressCount = responses.filter(r => !r.isCompleted).length;
          const totalCount = responses.length;
          
          let status = 'not-started';
          if (completedCount > 0) {
            status = 'completed';
          } else if (inProgressCount > 0) {
            status = 'in-progress';
          }
          
          return {
            ...assessment,
            status,
            responseStats: {
              completed: completedCount,
              inProgress: inProgressCount,
              total: totalCount
            }
          };
        })
      );
      
      return HttpResponse.json({
        success: true,
        data: assessmentsWithStatus
      });
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return HttpResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch assessments',
          details: error.message 
        },
        { status: 500 }
      );
    }
  }),

  // GET /assessments/:jobId
  http.get('/api/assessments/:jobId', async ({ params }) => {
    try {
      const jobId = parseInt(params.jobId);
      const assessment = await db.assessments.get(jobId);
      
      if (!assessment) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment not found for this job',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      // Don't include correct answers in the response for candidates
      const sanitizedAssessment = {
        ...assessment,
        questions: assessment.questions.map(q => {
          const { correctAnswer, ...sanitizedQuestion } = q;
          if (q.type === 'multiple_choice') {
            return {
              ...sanitizedQuestion,
              options: q.options.map(opt => ({ id: opt.id, text: opt.text }))
            };
          }
          return sanitizedQuestion;
        })
      };
      
      console.log('📝 [MSW] Assessment fetched from IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: sanitizedAssessment
      });
    } catch (error) {
      console.error('❌ [MSW] Error fetching assessment:', error);
      return new HttpResponse('Failed to fetch assessment', { status: 500 });
    }
  }),

  // PUT /assessments/:jobId
  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    try {
      const jobId = parseInt(params.jobId);
      const body = await request.json();
      
      // Validate required fields
      if (!body.title) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment title is required',
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
      
      if (!body.questions || !Array.isArray(body.questions) || body.questions.length === 0) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment must have at least one question',
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
      
      // Validate questions
      for (const question of body.questions) {
        if (!question.title || !question.type) {
          return HttpResponse.json(
            { 
              success: false, 
              error: 'Each question must have a title and type',
              code: 'VALIDATION_ERROR'
            },
            { status: 400 }
          );
        }
        
        if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
          return HttpResponse.json(
            { 
              success: false, 
              error: 'Multiple choice questions must have at least 2 options',
              code: 'VALIDATION_ERROR'
            },
            { status: 400 }
          );
        }
      }
      
      const existingAssessment = await db.assessments.get(jobId);
      const now = new Date();
      
      // Create or update assessment
      const assessment = {
        id: jobId,
        jobId,
        title: body.title,
        description: body.description || '',
        instructions: body.instructions || '',
        timeLimit: body.timeLimit || 60,
        passingScore: body.passingScore || 70,
        status: body.status || 'draft',
        questions: body.questions.map((q, index) => ({
          id: q.id || crypto.randomUUID(),
          ...q,
          order: index + 1
        })),
        settings: {
          allowRetakes: true,
          shuffleQuestions: false,
          shuffleAnswers: false,
          showResults: true,
          showCorrectAnswers: false,
          enableProctoring: false,
          ...body.settings
        },
        createdAt: existingAssessment?.createdAt || now,
        updatedAt: now
      };
      
      // Calculate metadata
      assessment.metadata = {
        totalQuestions: assessment.questions.length,
        totalPoints: assessment.questions.reduce((sum, q) => sum + (q.points || 1), 0),
        estimatedDuration: assessment.questions.length * 2,
        difficulty: body.difficulty || 'medium',
        categories: body.categories || ['general']
      };
      
      await db.assessments.put(assessment);
      
      console.log('✅ [MSW] Assessment saved to IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: assessment
      });
    } catch (error) {
      console.error('❌ [MSW] Error saving assessment:', error);
      return new HttpResponse('Failed to save assessment', { status: 500 });
    }
  }),

  // POST /assessments/:jobId/submit
  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    try {
      const jobId = parseInt(params.jobId);
      const body = await request.json();
      
      const assessment = await db.assessments.get(jobId);
      
      if (!assessment) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      // Validate required fields
      if (!body.candidateId) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Candidate ID is required',
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
      
      if (!body.responses || typeof body.responses !== 'object') {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Responses are required',
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
      
      // Check if candidate already submitted (if retakes not allowed)
      const existingResponse = await db.assessmentResponses
        .where('assessmentId')
        .equals(jobId)
        .and(response => response.candidateId === body.candidateId)
        .first();
      
      if (existingResponse && !assessment.settings.allowRetakes) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment already completed. Retakes are not allowed.',
            code: 'ALREADY_SUBMITTED'
          },
          { status: 409 }
        );
      }
      
      // Calculate score
      const score = calculateScore(assessment, body.responses);
      const passed = score >= assessment.passingScore;
      
      const submissionData = {
        assessmentId: jobId,
        candidateId: body.candidateId,
        responses: body.responses,
        score,
        passed,
        submittedAt: new Date(),
        startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
        timeTaken: body.timeTaken || 0, // in seconds
        attempt: existingResponse ? existingResponse.attempt + 1 : 1,
        questionsAnswered: Object.keys(body.responses).length,
        totalQuestions: assessment.questions.length
      };
      
      // Store response (replace existing if retakes allowed)
      if (existingResponse) {
        await db.assessmentResponses.update(existingResponse.id, submissionData);
      } else {
        await db.assessmentResponses.add(submissionData);
      }
      
      // Simulate potential for random errors (5% chance)
      if (Math.random() < 0.05) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Submission processing failed. Please try again.',
            code: 'SUBMISSION_ERROR'
          },
          { status: 500 }
        );
      }
      
      console.log('✅ [MSW] Assessment response saved to IndexedDB:', jobId, body.candidateId);
      return HttpResponse.json({
        success: true,
        data: {
          submissionId: existingResponse?.id || 'new',
          score: submissionData.score,
          passed: submissionData.passed,
          submittedAt: submissionData.submittedAt,
          feedback: {
            message: passed 
              ? 'Congratulations! You passed the assessment.' 
              : 'Thank you for completing the assessment. We will review your responses.',
            showScore: assessment.settings.showResults,
            showCorrectAnswers: assessment.settings.showCorrectAnswers && passed
          }
        }
      }, { status: 201 });
    } catch (error) {
      console.error('❌ [MSW] Error submitting assessment:', error);
      return new HttpResponse('Failed to submit assessment', { status: 500 });
    }
  }),

  // GET /assessments/:jobId/responses
  http.get('/api/assessments/:jobId/responses', async ({ params, request }) => {
    try {
      const jobId = parseInt(params.jobId);
      const url = new URL(request.url);
      const candidateId = url.searchParams.get('candidateId');
      
      const assessment = await db.assessments.get(jobId);
      
      if (!assessment) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      let responsesQuery = db.assessmentResponses.where('assessmentId').equals(jobId);
      
      // Filter by candidate if specified
      if (candidateId) {
        responsesQuery = responsesQuery.and(r => r.candidateId === parseInt(candidateId));
      }
      
      const responses = await responsesQuery.toArray();
      
      // Add statistics
      const stats = {
        totalSubmissions: responses.length,
        averageScore: responses.length > 0 
          ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length 
          : 0,
        passRate: responses.length > 0 
          ? (responses.filter(r => r.passed).length / responses.length) * 100 
          : 0,
        averageTime: responses.length > 0 
          ? responses.reduce((sum, r) => sum + r.timeTaken, 0) / responses.length 
          : 0
      };
      
      console.log('📊 [MSW] Assessment responses fetched from IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: responses,
        assessment: {
          id: assessment.id,
          title: assessment.title,
          totalQuestions: assessment.metadata.totalQuestions,
          passingScore: assessment.passingScore
        },
        statistics: stats
      });
    } catch (error) {
      console.error('❌ [MSW] Error fetching assessment responses:', error);
      return new HttpResponse('Failed to fetch assessment responses', { status: 500 });
    }
  }),

  // DELETE /assessments/:jobId
  http.delete('/api/assessments/:jobId', async ({ params }) => {
    try {
      const jobId = parseInt(params.jobId);
      
      const assessment = await db.assessments.get(jobId);
      
      if (!assessment) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Assessment not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      // Get related responses before deletion
      const relatedResponses = await db.assessmentResponses
        .where('assessmentId')
        .equals(jobId)
        .toArray();
      
      // Delete assessment and related responses
      await Promise.all([
        db.assessments.delete(jobId),
        db.assessmentResponses.where('assessmentId').equals(jobId).delete()
      ]);
      
      console.log('🗑️ [MSW] Assessment deleted from IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: assessment,
        metadata: {
          removedResponses: relatedResponses.length
        }
      });
    } catch (error) {
      console.error('❌ [MSW] Error deleting assessment:', error);
      return new HttpResponse('Failed to delete assessment', { status: 500 });
    }
  })
];