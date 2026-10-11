import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/layout/logo';
import { StatusBadge } from '@/components/shared/status-badge';
import { PrintButton } from '@/components/payments/print-button';
import { ApiError } from '@/lib/api-client-shared';
import { getCurrentUser } from '@/lib/server-session';
import { serverApi } from '@/lib/server-api';
import { formatCurrency, formatDateTime, humanize } from '@/lib/utils';
import type { JobDetail, Payment } from '@/types/api';

export const metadata: Metadata = { title: 'Receipt' };

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let payment: Payment, job: JobDetail;
  try {
    payment = await serverApi<Payment>(`/payments/${id}`);
    job = await serverApi<JobDetail>(`/jobs/${payment.jobId}`);
  } catch (e) {
    if (e instanceof ApiError && [400, 403, 404].includes(e.status)) notFound();
    throw e;
  }
  const user = await getCurrentUser();
  const rows: [string, string][] = [
    ['Receipt no.', `SP-${payment.id.slice(0, 8).toUpperCase()}`],
    ['Date', formatDateTime(payment.paidAt ?? payment.createdAt)],
    ['Payment method', humanize(payment.method)],
    ['Transaction ID', payment.transactionId ?? payment.bkashTrxId ?? payment.stripePaymentId ?? '—'],
  ];

  return (
    <>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/payments" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Payment history</Link>
        <PrintButton />
      </div>
      <Card className="mx-auto max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-brand-gradient p-7 text-white"><Logo light href="/dashboard" /><div className="text-right"><p className="text-xs uppercase tracking-wider text-white/60">Receipt</p><p className="text-lg font-bold">SP-{payment.id.slice(0, 8).toUpperCase()}</p></div></div>
        <CardContent className="space-y-8 p-7">
          <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-5">
            <div><p className="text-sm text-muted-foreground">Amount {payment.status === 'PAID' ? 'paid' : 'due'}</p><p className="text-3xl font-extrabold">{formatCurrency(payment.amount, payment.currency)}</p></div>
            {payment.status === 'PAID' ? <span className="flex items-center gap-2 rounded-full bg-success/10 px-3.5 py-1.5 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" aria-hidden /> Paid</span> : <StatusBadge status={payment.status} />}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Billed to</p><p className="font-semibold">{user.fullName}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</p><p className="font-semibold">{job.title}</p><p className="text-sm text-muted-foreground">{humanize(job.category)}{job.technician?.user ? ` · ${job.technician.user.fullName}` : ''}</p></div>
          </div>
          <dl className="divide-y rounded-2xl border text-sm">
            {rows.map(([k, v]) => (<div key={k} className="flex items-center justify-between gap-4 px-4 py-3"><dt className="text-muted-foreground">{k}</dt><dd className="break-all text-right font-medium">{v}</dd></div>))}
            {job.finalCost != null && payment.currency !== 'BDT' && <div className="flex items-center justify-between gap-4 px-4 py-3"><dt className="text-muted-foreground">Job price</dt><dd className="font-medium">{formatCurrency(job.finalCost, 'BDT')}</dd></div>}
          </dl>
          <p className="text-center text-xs text-muted-foreground">Thank you for choosing ServicePro. This receipt was generated electronically and is valid without a signature.</p>
        </CardContent>
      </Card>
    </>
  );
}
