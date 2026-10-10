import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="hidden h-10 w-40 sm:block" />
      </div>
      <div className="space-y-2 rounded-xl border p-4">
        {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
    </div>
  );
}
