import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, ClipboardList, Clock, Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Pagination } from '@/components/shared/pagination';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobTable } from '@/components/jobs/job-table';
import { fetchJobs, type JobSearchParams } from '@/lib/job-query';
import { serverApi } from '@/lib/server-api';
import type { Job, Paginated } from '@/types/api';

export const metadata: Metadata = { title: 'My requests' };

export default async function CustomerDashboard({ searchParams }: { searchParams: Promise<JobSearchParams> }) {
  const sp = await searchParams;
  const [jobs, all] = await Promise.all([fetchJobs(sp), serverApi<Paginated<Job>>('/jobs', { query: { limit: 100 } })]);

  const count = (s: string[]) => all.items.filter((j) => s.includes(j.status)).length;

  return (
    <>
      <PageHeader
        title="My requests"
        description="Track every service request from submission to payment."
        actions={<Button asChild><Link href="/dashboard/jobs/new"><Plus className="h-4 w-4" /> New request</Link></Button>}
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total requests" value={all.total} icon={ClipboardList} />
        <StatCard label="Awaiting assignment" value={count(['PENDING'])} icon={Clock} />
        <StatCard label="In progress" value={count(['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'])} icon={Wrench} />
        <StatCard label="Completed" value={count(['COMPLETED'])} icon={CheckCircle2} />
      </div>
      <JobFilters />
      <JobTable jobs={jobs.items} role="CUSTOMER" emptyAction={<Button asChild><Link href="/dashboard/jobs/new">Create your first request</Link></Button>} />
      <Pagination page={jobs.page} totalPages={jobs.totalPages} total={jobs.total} />
    </>
  );
}
