import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Pagination } from '@/components/shared/pagination';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobTable } from '@/components/jobs/job-table';
import { fetchJobs, type JobSearchParams } from '@/lib/job-query';

export const metadata: Metadata = { title: 'All jobs' };

export default async function AdminJobs({ searchParams }: { searchParams: Promise<JobSearchParams> }) {
  const sp = await searchParams;
  const jobs = await fetchJobs(sp, { allowSearch: true });
  return (
    <>
      <PageHeader title="Jobs" description="Review incoming requests, assign technicians and monitor progress. Search ignores the status/category filters." />
      <JobFilters search />
      <JobTable jobs={jobs.items} role="ADMIN" showCustomer />
      <Pagination page={jobs.page} totalPages={jobs.totalPages} total={jobs.total} />
    </>
  );
}
