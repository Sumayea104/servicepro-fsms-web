import type { Metadata } from 'next';
import { CheckCircle2, ClipboardList, Clock, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Pagination } from '@/components/shared/pagination';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobTable } from '@/components/jobs/job-table';
import { fetchJobs, type JobSearchParams } from '@/lib/job-query';
import { serverApi } from '@/lib/server-api';
import type { Job, Paginated } from '@/types/api';

export const metadata: Metadata = { title: 'My jobs' };

export default async function ProviderDashboard({ searchParams }: { searchParams: Promise<JobSearchParams> }) {
  const sp = await searchParams;
  const [jobs, all] = await Promise.all([fetchJobs(sp), serverApi<Paginated<Job>>('/jobs', { query: { limit: 100 } })]);
  const count = (s: string[]) => all.items.filter((j) => s.includes(j.status)).length;

  return (
    <>
      <PageHeader title="My jobs" description="Jobs a dispatcher has assigned to you." />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned to me" value={all.total} icon={ClipboardList} />
        <StatCard label="Awaiting my response" value={count(['ASSIGNED'])} icon={Clock} />
        <StatCard label="Active" value={count(['ACCEPTED', 'IN_PROGRESS'])} icon={Wrench} />
        <StatCard label="Completed" value={count(['COMPLETED'])} icon={CheckCircle2} />
      </div>
      <JobFilters />
      <JobTable jobs={jobs.items} role="TECHNICIAN" showCustomer />
      <Pagination page={jobs.page} totalPages={jobs.totalPages} total={jobs.total} />
    </>
  );
}
