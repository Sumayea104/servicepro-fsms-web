import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading technicians">
      <div className="bg-brand-gradient py-14"><div className="container space-y-3"><Skeleton className="h-9 w-72 bg-white/15" /><Skeleton className="h-4 w-96 max-w-full bg-white/10" /></div></div>
      <div className="container grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}</div>
    </div>
  );
}
