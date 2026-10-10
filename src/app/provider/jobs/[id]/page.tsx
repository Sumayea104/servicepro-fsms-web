import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { JobDetailView } from '@/components/jobs/job-detail';
import { TechnicianJobActions } from '@/components/jobs/technician-job-actions';
import { ApiError } from '@/lib/api-client-shared';
import { serverApi } from '@/lib/server-api';
import type { JobDetail } from '@/types/api';

export const metadata: Metadata = { title: 'Job details' };

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let job: JobDetail;
  try {
    job = await serverApi<JobDetail>(`/jobs/${id}`);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403 || e.status === 400)) notFound();
    throw e;
  }

  return (
    <>
      <Link href="/provider" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to jobs</Link>
      <div className="mb-6"><TechnicianJobActions job={job} /></div>
      <JobDetailView job={job} showCustomer={true} />
    </>
  );
}
