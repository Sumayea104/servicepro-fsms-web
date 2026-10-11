import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Calendar, CheckCircle2, ClipboardList, Clock, MapPin, Plus, UserRound, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Pagination } from '@/components/shared/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobTable } from '@/components/jobs/job-table';
import { JobStepper } from '@/components/jobs/job-stepper';
import { fetchJobs, type JobSearchParams } from '@/lib/job-query';
import { getCurrentUser } from '@/lib/server-session';
import { serverApi } from '@/lib/server-api';
import { formatDateTime } from '@/lib/utils';
import type { Job, Paginated } from '@/types/api';

export const metadata: Metadata = { title: 'My requests' };

export default async function CustomerDashboard({ searchParams }: { searchParams: Promise<JobSearchParams> }) {
  const sp = await searchParams;
  const [user, jobs, all] = await Promise.all([getCurrentUser(), fetchJobs(sp), serverApi<Paginated<Job>>('/jobs', { query: { limit: 100 } })]);

  const count = (s: string[]) => all.items.filter((j) => s.includes(j.status)).length;
  const active = all.items.find((j) => ['IN_PROGRESS', 'ACCEPTED', 'ASSIGNED'].includes(j.status)) ?? all.items.find((j) => j.status === 'PENDING');
  const awaitingPayment = all.items.filter((j) => j.status === 'COMPLETED').length;

  return (
    <>
      <PageHeader
        eyebrow="Customer workspace"
        title={`Welcome back, ${user.fullName.split(' ')[0]}`}
        description="Track every service request from submission to payment."
        actions={<Button asChild variant="gold"><Link href="/dashboard/jobs/new"><Plus className="h-4 w-4" /> New request</Link></Button>}
      />

      {active ? (
        <Card className="mb-8 overflow-hidden">
          <div className="h-1.5 bg-brand-gradient" />
          <CardContent className="p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Current request</p>
                <h2 className="mt-1 text-xl font-bold">{active.title}</h2>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden />{active.address}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden />{active.scheduledAt ? formatDateTime(active.scheduledAt) : 'Awaiting a visit slot'}</span>
                  {active.technician?.user && <span className="flex items-center gap-1.5"><UserRound className="h-4 w-4" aria-hidden />{active.technician.user.fullName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3"><StatusBadge status={active.status} /><Button asChild size="sm"><Link href={`/dashboard/jobs/${active.id}`}>View details <ArrowRight className="h-4 w-4" /></Link></Button></div>
            </div>
            <JobStepper status={active.status} />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 overflow-hidden bg-brand-gradient text-white">
          <CardContent className="grid items-center gap-6 p-0 sm:grid-cols-[1fr_16rem]">
            <div className="p-7"><h2 className="text-2xl font-extrabold">Something needs fixing?</h2><p className="mt-2 max-w-md text-white/70">Submit a request in three quick steps and a dispatcher will match a verified technician.</p><Button asChild variant="gold" className="mt-5"><Link href="/dashboard/jobs/new">Create a request <ArrowRight className="h-4 w-4" /></Link></Button></div>
            <Image src="/images/service-electrical.svg" alt="" width={480} height={320} className="hidden h-full w-full object-cover sm:block" />
          </CardContent>
        </Card>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total requests" value={all.total} icon={ClipboardList} />
        <StatCard label="Awaiting assignment" value={count(['PENDING'])} icon={Clock} tone="gold" hint="Dispatcher is reviewing" />
        <StatCard label="In progress" value={count(['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'])} icon={Wrench} tone="violet" />
        <StatCard label="Completed" value={count(['COMPLETED'])} icon={CheckCircle2} tone="success" hint={awaitingPayment ? 'Open to pay or review' : undefined} href="/dashboard?status=COMPLETED" />
      </div>

      <h2 className="mb-3 text-lg font-bold">All requests</h2>
      <JobFilters />
      <JobTable jobs={jobs.items} role="CUSTOMER" emptyAction={<Button asChild><Link href="/dashboard/jobs/new">Create your first request</Link></Button>} />
      <Pagination page={jobs.page} totalPages={jobs.totalPages} total={jobs.total} />
    </>
  );
}
