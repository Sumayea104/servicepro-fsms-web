import 'server-only';
import { redirect } from 'next/navigation';
import { serverApi } from './server-api';
import { ApiError } from './api-client-shared';
import type { Role, User } from '@/types/api';

/** Used by each role layout: loads the user and enforces the role a second time (middleware is the first). */
export async function requireRole(role: Role): Promise<User> {
  let user: User;
  try {
    user = await serverApi<User>('/users/me');
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect('/login');
    throw e;
  }
  if (user.role !== role) redirect('/login');
  return user;
}
