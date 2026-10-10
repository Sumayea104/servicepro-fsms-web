import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { PaymentPanel } from '@/components/payments/payment-panel';
import { ApiError } from '@/lib/api-client-shared';
import { serverApi } from '@/lib/server-api';
import type { JobDetail } from '@/types/api';

export const metadata: Metadata = { title: 'Pay' };

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let job: JobDetail;
  try {
    job = await serverApi<JobDetail>(`/jobs/${id}`);
  } catch (e) {
    if (e instanceof ApiError && [400, 403, 404].includes(e.status)) notFound();
    throw e;
  }
  if (job.status !== 'COMPLETED' || job.payment?.status === 'PAID') redirect(`/dashboard/jobs/${id}`);

  const amount = Number(job.finalCost ?? job.estimatedCost ?? 0);
  return <PaymentPanel jobId={job.id} amountBdt={amount} jobTitle={job.title} />;
}
