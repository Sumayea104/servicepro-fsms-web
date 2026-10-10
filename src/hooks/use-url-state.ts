'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * URL-synchronised filter/sort/search/pagination state. Every change is written
 * to the query string so views are bookmarkable and shareable; Server Component
 * pages re-render with the new searchParams.
 */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback((key: string) => searchParams.get(key) ?? '', [searchParams]);

  const set = useCallback(
    (updates: Record<string, string | number | null | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') params.delete(k);
        else params.set(k, String(v));
      });
      if (resetPage && !('page' in updates)) params.delete('page');
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return { get, set, searchParams };
}
