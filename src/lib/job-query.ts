import type { JobCategory, JobStatus, Paginated, Job, Priority } from '@/types/api';
import { serverApi } from './server-api';

export interface JobSearchParams {
  page?: string;
  status?: string;
  category?: string;
  priority?: string;
  sort?: string;
  q?: string;
}

const SORTS: Record<string, { sortBy: string; sortOrder: 'asc' | 'desc' }> = {
  oldest: { sortBy: 'createdAt', sortOrder: 'asc' },
  scheduled: { sortBy: 'scheduledAt', sortOrder: 'asc' },
};

/** Translates the page's URL search params into the API call. `q` uses the admin-only search endpoint. */
export async function fetchJobs(sp: JobSearchParams, opts: { allowSearch?: boolean; limit?: number } = {}) {
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);
  const limit = opts.limit ?? 10;
  const sort = SORTS[sp.sort || ''] ?? { sortBy: 'createdAt', sortOrder: 'desc' as const };

  if (opts.allowSearch && sp.q) {
    return serverApi<Paginated<Job>>('/jobs/search', { query: { q: sp.q, page, limit } });
  }
  return serverApi<Paginated<Job>>('/jobs', {
    query: {
      page, limit,
      status: sp.status as JobStatus | undefined,
      category: sp.category as JobCategory | undefined,
      priority: sp.priority as Priority | undefined,
      ...sort,
    },
  });
}
