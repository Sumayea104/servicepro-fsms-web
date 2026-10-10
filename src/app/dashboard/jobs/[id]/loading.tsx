import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="grid gap-6 lg:grid-cols-3" aria-busy="true" aria-label="Loading job">
      <div className="space-y-6 lg:col-span-2"><Skeleton className="h-72 w-full rounded-xl" /><Skeleton className="h-40 w-full rounded-xl" /></div>
      <div className="space-y-6"><Skeleton className="h-32 w-full rounded-xl" /><Skeleton className="h-56 w-full rounded-xl" /></div>
    </div>
  );
}
