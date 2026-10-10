import 'server-only';
import { cookies } from 'next/headers';
import { API_URL, ACCESS_COOKIE } from './constants';
import { buildQuery, ApiError, type RequestOptions } from './api-client-shared';
import type { ApiErrorBody, ApiSuccess } from '@/types/api';

/**
 * Server Component data fetching. Reads the access token from the request
 * cookies (middleware has already refreshed it if it was expired) and calls
 * the backend directly — no browser round trip, no client bundle cost.
 */
export async function serverApi<T>(path: string, options: Pick<RequestOptions, 'query' | 'method' | 'body'> = {}): Promise<T> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const res = await fetch(`${API_URL}${path}${buildQuery(options.query)}`, {
    method: options.method || 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  let payload: ApiSuccess<T> | ApiErrorBody | null = null;
  try {
    payload = await res.json();
  } catch {
    // handled below
  }

  if (!res.ok || !payload || payload.success === false) {
    const err = payload && payload.success === false ? payload : null;
    throw new ApiError(err?.message || `Request failed (${res.status})`, res.status, err?.errors || []);
  }
  return payload.data;
}
