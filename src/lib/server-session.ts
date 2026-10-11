import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { serverApi } from './server-api';
import { ApiError } from './api-client-shared';
import type { MeResponse, Role } from '@/types/api';

/** The signed-in user. Wrapped in React `cache` so layout + page share one API call per request. */
export const getCurrentUser = cache(async (): Promise<MeResponse> => {
  try {
    return await serverApi<MeResponse>('/users/me');
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect('/login');
    throw e;
  }
});

/** Used by each role layout: loads the user and enforces the role a second time (middleware is the first). */
export async function requireRole(role: Role): Promise<MeResponse> {
  const user = await getCurrentUser();
  if (user.role !== role) redirect('/login');
  return user;
}
