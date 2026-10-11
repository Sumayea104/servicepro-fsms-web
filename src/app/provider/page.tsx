import Link from 'next/link';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, Clock, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobTable } from '@/components/jobs/job-table';
import { fetchJobs, type JobSearchParams } from '@/lib/job-query';
import { getCurrentUser } from '@/lib/server-session';
import { serverApi } from '@/lib/server-api';
import type { Job, Paginated } from '@/types/api';

export const metadata: Metadata = { title: 'My jobs' };

export default async function ProviderDashboard({ searchParams }: { searchParams: Promise<JobSearchParams> }) {
  const sp = await searchParams;
  const [user, jobs, all] = await Promise.all([getCurrentUser(), fetchJobs(sp), serverApi<Paginated<Job>>('/jobs', { query: { limit: 100 } })]);
  const count = (s: string[]) => all.items.filter((j) => s.includes(j.status)).length;

  // Upcoming agenda: scheduled, still-open jobs in date order.
  const upcoming = all.items
    .filter((j) => j.scheduledAt && ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(j.status))
    .sort((a, b) => +new Date(a.scheduledAt!) - +new Date(b.scheduledAt!))
    .slice(0, 5);

  return (
    <>
      <PageHeader eyebrow="Technician workspace" title={`Hello, ${user.fullName.split(' ')[0]}`} description="Jobs a dispatcher has assigned to you, and what’s next on your calendar." />

      {user.technician && !user.technician.isVerified && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm" role="status">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
          <div><p className="font-semibold">Your profile is awaiting verification</p><p className="text-muted-foreground">An admin must approve it before you can receive jobs. Meanwhile, <Link href="/provider/profile" className="font-medium text-primary hover:underline">complete your skills and schedule</Link>.</p></div>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned to me" value={all.total} icon={ClipboardList} />
        <StatCard label="Awaiting my response" value={count(['ASSIGNED'])} icon={Clock} tone="gold" href="/provider?status=ASSIGNED" />
        <StatCard label="Active" value={count(['ACCEPTED', 'IN_PROGRESS'])} icon={Wrench} tone="violet" />
        <StatCard label="Completed" value={count(['COMPLETED'])} icon={CheckCircle2} tone="success" />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CalendarDays className="h-5 w-5 text-primary" aria-hidden /> Upcoming schedule</CardTitle></CardHeader>
          <CardContent>
            {upcoming.length === 0 ? <EmptyState title="Nothing scheduled" description="Accepted and assigned visits will be listed here by date." /> : (
              <ol className="space-y-3">
                {upcoming.map((j) => {
                  const d = new Date(j.scheduledAt!);
                  return (
                    <li key={j.id}>
                      <Link href={`/provider/jobs/${j.id}`} className="group flex items-center gap-4 rounded-xl border bg-background p-3 transition-colors hover:border-primary/40 hover:bg-accent/50">
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-gradient text-white"><span className="text-[10px] font-semibold uppercase text-gold">{format(d, 'MMM')}</span><span className="text-xl font-extrabold leading-none">{format(d, 'd')}</span></div>
                        <div className="min-w-0 flex-1"><p className="truncate font-semibold group-hover:text-primary">{j.title}</p><p className="truncate text-xs text-muted-foreground">{format(d, 'EEE, h:mm a')} · {j.address}</p></div>
                        <StatusBadge status={j.status} />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
        <Card className="bg-brand-gradient text-white">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div><h2 className="text-lg font-bold">Keep your profile sharp</h2><p className="mt-2 text-sm text-white/70">Accurate skills, service areas and weekly hours help dispatchers match you to the right jobs.</p></div>
            <Link href="/provider/profile" className="mt-6 inline-flex items-center justify-center rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground transition hover:brightness-105">Update availability</Link>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 text-lg font-bold">All jobs</h2>
      <JobFilters />
      <JobTable jobs={jobs.items} role="TECHNICIAN" showCustomer />
      <Pagination page={jobs.page} totalPages={jobs.totalPages} total={jobs.total} />
    </>
  );
}
