import { API_URL } from './constants';
import { buildQuery, ApiError, type RequestOptions } from './api-client-shared';
import type { ApiErrorBody, ApiSuccess } from '@/types/api';

/** Unauthenticated, cacheable fetch for public pages (technician directory, landing page). */
export async function publicApi<T>(path: string, query?: RequestOptions['query'], revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}${buildQuery(query)}`, { next: { revalidate } });
  let payload: ApiSuccess<T> | ApiErrorBody | null = null;
  try { payload = await res.json(); } catch { /* handled below */ }
  if (!res.ok || !payload || payload.success === false) {
    const err = payload && payload.success === false ? payload : null;
    throw new ApiError(err?.message || `Request failed (${res.status})`, res.status, err?.errors || []);
  }
  return payload.data;
}
