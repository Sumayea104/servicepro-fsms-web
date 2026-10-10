import { Skeleton } from '@/components/ui/skeleton';
import { StatsSkeleton, TableSkeleton } from '@/components/shared/table-skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2"><Skeleton className="h-9 w-56" /><Skeleton className="h-4 w-80" /></div>
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  );
}
