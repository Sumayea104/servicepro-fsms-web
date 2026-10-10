'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUrlState } from '@/hooks/use-url-state';

export function Pagination({ page, totalPages, total }: { page: number; totalPages: number; total: number }) {
  const { set } = useUrlState();
  if (totalPages <= 1) return <p className="mt-4 text-sm text-muted-foreground">{total} result{total === 1 ? '' : 's'}</p>;
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {total} results</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => set({ page: page - 1 }, false)}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => set({ page: page + 1 }, false)}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
