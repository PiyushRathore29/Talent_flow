import { http, HttpResponse } from 'msw';
import { db } from '../lib/database.js';
import { withLatencyAndErrors, withLatency, LATENCY_CONFIG } from './utils.js';

// Helper function to get jobs with pagination
const getJobsFromDB = async (params = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      status = '',
      sort = 'order'
    } = params;

    let jobs = await db.jobs.toArray();

    // Apply filters
    if (search) {
      jobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.description?.toLowerCase().includes(search.toLowerCase()) ||
        job.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (status && status !== 'all') {
      jobs = jobs.filter(job => job.status === status);
    }

    // Apply sorting
    jobs.sort((a, b) => {
      switch (sort) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'order':
        default:
          return a.order - b.order;
      }
    });

    // Apply pagination
    const totalCount = jobs.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    return {
      data: paginatedJobs,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('Error getting jobs from DB:', error);
    throw error;
  }
};

export const jobHandlers = [
  // GET /jobs?search=&status=&page=&pageSize=&sort=
  http.get('/api/jobs', withLatency(async ({ request }) => {
    try {
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      
      const params = {
        page: parseInt(searchParams.get('page')) || 1,
        pageSize: parseInt(searchParams.get('pageSize')) || 10,
        search: searchParams.get('search') || '',
        status: searchParams.get('status') || '',
        sort: searchParams.get('sort') || 'order'
      };

      const result = await getJobsFromDB(params);
      
      console.log('💼 [MSW] Jobs fetched from IndexedDB:', {
        total: result.pagination.total,
        page: result.pagination.page,
        returned: result.data.length
      });

      return HttpResponse.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('❌ [MSW] Error fetching jobs:', error);
      return new HttpResponse('Failed to fetch jobs', { status: 500 });
    }
  }, LATENCY_CONFIG.READ)),

  // POST /jobs
  http.post('/api/jobs', withLatencyAndErrors(async ({ request }) => {
    try {
      const body = await request.json();
      
      // Validate required fields
      if (!body.title) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Title is required',
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }

      // Get the next order value
      const existingJobs = await db.jobs.toArray();
      const maxOrder = existingJobs.reduce((max, job) => Math.max(max, job.order || 0), 0);
      
      const newJob = {
        ...body,
        order: body.order || (maxOrder + 1),
        status: body.status || 'active',
        tags: body.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        description: body.description || '',
        location: body.location || '',
        department: body.department || '',
        employmentType: body.employmentType || 'Full-time',
        salaryRange: body.salaryRange || { min: 0, max: 0 }
      };
      
      const jobId = await db.jobs.add(newJob);
      const createdJob = await db.jobs.get(jobId);
      
      console.log('✅ [MSW] Job created in IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: createdJob
      }, { status: 201 });
    } catch (error) {
      console.error('❌ [MSW] Error creating job:', error);
      return new HttpResponse('Failed to create job', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE)),

  // PATCH /jobs/:id
  http.patch('/api/jobs/:id', withLatencyAndErrors(async ({ params, request }) => {
    try {
      const jobId = parseInt(params.id);
      const body = await request.json();
      
      const existingJob = await db.jobs.get(jobId);
      if (!existingJob) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Job not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }

      const updatedData = {
        ...body,
        updatedAt: new Date()
      };

      await db.jobs.update(jobId, updatedData);
      const updatedJob = await db.jobs.get(jobId);
      
      console.log('🔄 [MSW] Job updated in IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: updatedJob
      });
    } catch (error) {
      console.error('❌ [MSW] Error updating job:', error);
      return new HttpResponse('Failed to update job', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE)),

  // PATCH /jobs/:id/reorder
  http.patch('/api/jobs/:id/reorder', withLatencyAndErrors(async ({ params, request }) => {
    try {
      const jobId = parseInt(params.id);
      const { fromOrder, toOrder } = await request.json();
      
      const job = await db.jobs.get(jobId);
      if (!job) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Job not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      // Validate order values
      if (typeof fromOrder !== 'number' || typeof toOrder !== 'number') {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'fromOrder and toOrder must be numbers',
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
      
      // Get jobs that need reordering
      const allJobs = await db.jobs.toArray();
      const jobsToUpdate = allJobs.filter(job => {
        if (fromOrder < toOrder) {
          return job.order >= fromOrder && job.order <= toOrder;
        } else {
          return job.order >= toOrder && job.order <= fromOrder;
        }
      });
      
      // Update orders in a transaction
      await db.transaction('rw', db.jobs, async () => {
        for (const job of jobsToUpdate) {
          if (job.id === jobId) {
            await db.jobs.update(job.id, { 
              order: toOrder, 
              updatedAt: new Date() 
            });
          } else if (fromOrder < toOrder) {
            await db.jobs.update(job.id, { 
              order: job.order - 1, 
              updatedAt: new Date() 
            });
          } else {
            await db.jobs.update(job.id, { 
              order: job.order + 1, 
              updatedAt: new Date() 
            });
          }
        }
      });
      
      console.log('🔄 [MSW] Job reordered in IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: {
          jobId,
          fromOrder,
          toOrder,
          affectedJobs: jobsToUpdate.length
        }
      });
    } catch (error) {
      console.error('❌ [MSW] Error reordering job:', error);
      return new HttpResponse('Failed to reorder job', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE)),

  // GET /jobs/:id
  http.get('/api/jobs/:id', withLatency(async ({ params }) => {
    try {
      const jobId = parseInt(params.id);
      const job = await db.jobs.get(jobId);
      
      if (!job) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Job not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }

      console.log('💼 [MSW] Job fetched from IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('❌ [MSW] Error fetching job:', error);
      return new HttpResponse('Failed to fetch job', { status: 500 });
    }
  }, LATENCY_CONFIG.READ)),

  // DELETE /jobs/:id
  http.delete('/api/jobs/:id', withLatencyAndErrors(async ({ params }) => {
    try {
      const jobId = parseInt(params.id);
      
      const job = await db.jobs.get(jobId);
      if (!job) {
        return HttpResponse.json(
          { 
            success: false, 
            error: 'Job not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }

      await db.jobs.delete(jobId);
      
      console.log('🗑️ [MSW] Job deleted from IndexedDB:', jobId);
      return HttpResponse.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('❌ [MSW] Error deleting job:', error);
      return new HttpResponse('Failed to delete job', { status: 500 });
    }
  }, LATENCY_CONFIG.WRITE))
];
