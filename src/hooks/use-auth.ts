'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { clearSession, getRefreshToken, setSession } from '@/lib/auth-cookies';
import { ROLE_HOME } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types/api';

interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  async function finishLogin(payload: AuthPayload, next?: string | null) {
    setSession(payload.accessToken, payload.refreshToken);
    setUser(payload.user);
    toast.success(`Welcome, ${payload.user.fullName.split(' ')[0]}`);
    // Only honour ?next= when it points into this user's own area (prevents open redirects too).
    const home = ROLE_HOME[payload.user.role];
    const safeNext = next && next.startsWith(home) ? next : home;
    router.replace(safeNext);
    router.refresh();
  }

  async function login(email: string, password: string, next?: string | null) {
    const data = await api<AuthPayload>('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    await finishLogin(data, next);
  }

  async function register(input: { fullName: string; email: string; password: string; phone?: string; role: 'CUSTOMER' | 'TECHNICIAN' }) {
    const data = await api<AuthPayload>('/auth/register', { method: 'POST', body: input, auth: false });
    await finishLogin(data);
  }

  async function logout() {
    const refreshToken = getRefreshToken();
    try {
      await api('/auth/logout', { method: 'POST', body: { refreshToken }, auth: false });
    } catch {
      // Even if the server call fails, the local session must end.
    }
    clearSession();
    setUser(null);
    queryClient.clear();
    router.replace('/login');
    router.refresh();
  }

  return { user, login, register, logout };
}
