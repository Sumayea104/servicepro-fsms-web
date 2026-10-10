'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api-client';

interface ActionConfig<TBody> {
  path: string;
  method?: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  success: string;
  onDone?: () => void;
  body?: TBody;
}

/**
 * One mutation shape for every job action (assign, cancel, status change, report, review…):
 * call the API, toast the outcome, then re-render the Server Component page with fresh data.
 */
export function useJobAction<TBody = unknown>({ path, method = 'POST', success, onDone }: ActionConfig<TBody>) {
  const router = useRouter();
  return useMutation({
    mutationFn: (body?: TBody) => api(path, { method, body: (body ?? {}) as unknown }),
    onSuccess: () => {
      toast.success(success);
      onDone?.();
      router.refresh();
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.'),
  });
}
