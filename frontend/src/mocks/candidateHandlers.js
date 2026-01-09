import { http, HttpResponse } from 'msw';
import { db } from '../lib/database.js';
import { withLatencyAndErrors, withLatency, LATENCY_CONFIG } from './utils.js';

// Helper function to get candidates with pagination + filtering
const getCandidatesFromDB = async (params = {}) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      search = '',
      stage = '',
      jobId = '',
      sort = 'desc',
      sortBy = 'createdAt',
    } = params;

    let candidates = await db.candidates.toArray();

    // === FILTERS ===
    // 1) Stage: exact match (if provided)
    if (stage) {
      candidates = candidates.filter(
        candidate => candidate.stage?.toLowerCase() === stage.toLowerCase()
      );
    }

    // 2) jobId: preserve existing logic (if provided)
    if (jobId) {
      candidates = candidates.filter(candidate => candidate.jobId?.toString() === jobId.toString());
    }

    // 3) Search: ONLY match by candidate name (firstName + lastName), case-insensitive
    if (search) {
      const s = search.toLowerCase();
      candidates = candidates.filter(candidate =>
        `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase().includes(s)
      );
    }

    // === SORTING (preserve existing logic) ===
    candidates.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      // If sorting by a date-like field, compare as dates
      if (aVal && bVal && (sortBy.toLowerCase().includes('date') || sortBy.toLowerCase().includes('at'))) {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        if (isNaN(aTime) || isNaN(bTime)) return 0;
        return sort === 'asc' ? aTime - bTime : bTime - aTime;
      }

      // Fallback to string compare
      if (aVal == null || bVal == null) return 0;
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sort === 'asc' ? -1 : 1;
      if (aStr > bStr) return sort === 'asc' ? 1 : -1;
      return 0;
    });

    // === PAGINATION (preserve existing logic) ===
    const totalCount = candidates.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCandidates = candidates.slice(startIndex, endIndex);

    return {
      data: paginatedCandidates,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error getting candidates from DB:', error);
    throw error;
  }
};

export const candidateHandlers = [
  // GET /api/candidates?search=&stage=&page=&jobId=&sort=&sortBy=
  http.get('/api/candidates', withLatency(async ({ request }) => {
    try {
      const url = new URL(request.url);
      const searchParams = url.searchParams;

      const params = {
        page: parseInt(searchParams.get('page')) || 1,
        pageSize: parseInt(searchParams.get('pageSize')) || 20,
        search: searchParams.get('search') || '',
        stage: searchParams.get('stage') || '',
        jobId: searchParams.get('jobId') || '',
        sort: searchParams.get('sort') || 'desc',
        sortBy: searchParams.get('sortBy') || 'createdAt'
      };

      const result = await getCandidatesFromDB(params);

      console.log('📊 [MSW] Candidates fetched from IndexedDB:', {
        total: result.pagination.totalCount,
        page: result.pagination.currentPage,
        returned: result.data.length,
        search: params.search,
        stage: params.stage
      });

      return HttpResponse.json(result);
    } catch (error) {
      console.error('❌ [MSW] Error fetching candidates:', error);
      return new HttpResponse('Failed to fetch candidates', { status: 500 });
    }
  }, LATENCY_CONFIG.READ)),

  // GET /api/candidates/:id
  http.get('/api/candidates/:id', withLatency(async ({ params }) => {
    try {
      const candidateId = parseInt(params.id);
      const candidate = await db.candidates.get(candidateId);

      if (!candidate) {
        return new HttpResponse('Candidate not found', { status: 404 });
      }

      // Get candidate's job information
      const job = await db.jobs.get(candidate.jobId);

      // Get candidate history
      const history = await db.candidateHistory
        .where('candidateId')
        .equals(candidateId)
        .toArray();

      const enrichedCandidate = {
        ...candidate,
        job: job || null,
        history: history.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
      };

      console.log('👤 [MSW] Candidate fetched from IndexedDB:', candidateId);
      return HttpResponse.json(enrichedCandidate);
    } catch (error) {
      console.error('❌ [MSW] Error fetching candidate:', error);
      return new HttpResponse('Failed to fetch candidate', { status: 500 });
    }
  }, LATENCY_CONFIG.READ)),

  // GET /api/candidates/:id/timeline
  http.get('/api/candidates/:id/timeline', withLatency(async ({ params }) => {
    try {
      const candidateId = parseInt(params.id);

      const candidate = await db.candidates.get(candidateId);
      if (!candidate) {
        return new HttpResponse('Candidate not found', { status: 404 });
      }

      // Get candidate history, notes, assessment responses
      const history = await db.candidateHistory
        .where('candidateId')
        .equals(candidateId)
        .toArray();

      const notes = await db.candidateNotes
        .where('candidateId')
        .equals(candidateId)
        .toArray();

      const assessmentResponses = await db.assessmentResponses
        .where('candidateId')
        .equals(candidateId)
        .toArray();

      // Combine timeline events and sort newest first
      const timelineEvents = [
        ...history.map(h => ({
          id: `history-${h.id}`,
          type: 'stage_change',
          title: h.note || 'Stage Changed',
          description: h.note,
          timestamp: h.changedAt,
          metadata: { fromStage: h.fromStageId, toStage: h.toStageId }
        })),
        ...notes.map(n => ({
          id: `note-${n.id}`,
          type: 'note',
          title: 'Note Added',
          description: n.text,
          timestamp: n.createdAt,
          metadata: { authorId: n.authorId }
        })),
        ...assessmentResponses.map(r => ({
          id: `assessment-${r.id}`,
          type: 'assessment',
          title: 'Assessment Completed',
          description: `Score: ${r.score}%`,
          timestamp: r.submittedAt,
          metadata: { score: r.score, timeTaken: r.timeTaken }
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      console.log('📅 [MSW] Timeline fetched from IndexedDB:', candidateId);
      return HttpResponse.json({ timeline: timelineEvents });
    } catch (error) {
      console.error('❌ [MSW] Error fetching candidate timeline:', error);
      return new HttpResponse('Failed to fetch timeline', { status: 500 });
    }
  }, LATENCY_CONFIG.READ)),

  // POST /api/candidates
  http.post('/api/candidates', withLatencyAndErrors(async ({ request }) => {
    try {
      const newCandidate = await request.json();

      const candidateToCreate = {
        ...newCandidate,
        stage: newCandidate.stage || 'applied',
        appliedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const candidateId = await db.candidates.add(candidateToCreate);

      // Create initial history entry (preserve original logic)
      await db.candidateHistory.add({
        candidateId,
        fromStageId: null,
        toStageId: getStageId(candidateToCreate.stage),
        changedBy: 1, // Default user
        changedAt: new Date(),
        note: 'Initial application submitted'
      });

      const createdCandidate = await db.candidates.get(candidateId);

      console.log('✅ [MSW] Candidate created in IndexedDB:', candidateId);
      return HttpResponse.json(createdCandidate, { status: 201 });
    } catch (error) {
      console.error('❌ [MSW] Error creating candidate:', error);
      return new HttpResponse('Failed to create candidate', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE)),

  // PUT /api/candidates/:id
  http.put('/api/candidates/:id', withLatencyAndErrors(async ({ params, request }) => {
    try {
      const candidateId = parseInt(params.id);
      const updates = await request.json();

      const existingCandidate = await db.candidates.get(candidateId);
      if (!existingCandidate) {
        return new HttpResponse('Candidate not found', { status: 404 });
      }

      // If stage is being updated, create history entry
      if (updates.stage && updates.stage !== existingCandidate.stage) {
        await db.candidateHistory.add({
          candidateId,
          fromStageId: existingCandidate.currentStageId || null,
          toStageId: getStageId(updates.stage),
          changedBy: 1, // Default user
          changedAt: new Date(),
          note: `Stage changed from ${existingCandidate.stage} to ${updates.stage}`
        });
      }

      const updatedData = {
        ...updates,
        updatedAt: new Date()
      };

      await db.candidates.update(candidateId, updatedData);
      const updatedCandidate = await db.candidates.get(candidateId);

      console.log('🔄 [MSW] Candidate updated in IndexedDB (PUT):', candidateId);
      return HttpResponse.json(updatedCandidate);
    } catch (error) {
      console.error('❌ [MSW] Error updating candidate (PUT):', error);
      return new HttpResponse('Failed to update candidate', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE)),

  // PATCH /api/candidates/:id
  http.patch('/api/candidates/:id', withLatencyAndErrors(async ({ params, request }) => {
    try {
      const candidateId = parseInt(params.id);
      const updates = await request.json();

      const existingCandidate = await db.candidates.get(candidateId);
      if (!existingCandidate) {
        return new HttpResponse('Candidate not found', { status: 404 });
      }

      // If stage is being updated, create history entry
      if (updates.stage && updates.stage !== existingCandidate.stage) {
        await db.candidateHistory.add({
          candidateId,
          fromStageId: existingCandidate.currentStageId || null,
          toStageId: getStageId(updates.stage),
          changedBy: 1, // Default user
          changedAt: new Date(),
          note: `Stage changed from ${existingCandidate.stage} to ${updates.stage}`
        });
      }

      const updatedData = {
        ...updates,
        updatedAt: new Date()
      };

      await db.candidates.update(candidateId, updatedData);
      const updatedCandidate = await db.candidates.get(candidateId);

      console.log('🔄 [MSW] Candidate updated in IndexedDB (PATCH):', candidateId);
      return HttpResponse.json(updatedCandidate);
    } catch (error) {
      console.error('❌ [MSW] Error updating candidate (PATCH):', error);
      return new HttpResponse('Failed to update candidate', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE)),

  // DELETE /api/candidates/:id
  http.delete('/api/candidates/:id', withLatencyAndErrors(async ({ params }) => {
    try {
      const candidateId = parseInt(params.id);

      const candidate = await db.candidates.get(candidateId);
      if (!candidate) {
        return new HttpResponse('Candidate not found', { status: 404 });
      }

      // Delete candidate and related data (preserve existing logic)
      await Promise.all([
        db.candidates.delete(candidateId),
        db.candidateHistory.where('candidateId').equals(candidateId).delete(),
        db.candidateNotes.where('candidateId').equals(candidateId).delete(),
        db.assessmentResponses.where('candidateId').equals(candidateId).delete()
      ]);

      console.log('🗑️ [MSW] Candidate deleted from IndexedDB:', candidateId);
      return new HttpResponse(null, { status: 204 });
    } catch (error) {
      console.error('❌ [MSW] Error deleting candidate:', error);
      return new HttpResponse('Failed to delete candidate', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE))
];

// Helper function to get stage ID from stage name (preserve original mapping)
const getStageId = (stageName) => {
  const stageMap = {
    'applied': 1,
    'screen': 2,
    'tech': 3,
    'offer': 4,
    'hired': 5,
    'rejected': 6
  };
  return stageMap[stageName] || 1;
};
