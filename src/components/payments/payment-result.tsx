'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import type { Payment } from '@/types/api';

/** Success page body. If we know the payment id, poll the API until the webhook has settled it. */
export function PaymentResult({ paymentId, redirectStatus }: { paymentId?: string; redirectStatus?: string }) {
  const { data, isError } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => api<Payment>(`/payments/${paymentId}`),
    enabled: !!paymentId,
    refetchInterval: (q) => (q.state.data && ['PAID', 'FAILED'].includes(q.state.data.status) ? false : 2000),
  });

  const failed = redirectStatus === 'failed' || data?.status === 'FAILED';
  const paid = data?.status === 'PAID' || (!paymentId && redirectStatus !== 'failed');
  const pending = !!paymentId && !paid && !failed && !isError;

  return (
    <Card className="w-full max-w-md"><CardContent className="flex flex-col items-center p-8 text-center">
      {pending && (<><Loader2 className="mb-4 h-14 w-14 animate-spin text-primary" aria-hidden /><h1 className="text-2xl font-bold">Confirming your payment…</h1><p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds.</p></>)}
      {paid && (<><CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" aria-hidden /><h1 className="text-2xl font-bold">Payment successful</h1><p className="mt-2 text-sm text-muted-foreground">{data ? `We received ${formatCurrency(data.amount, data.currency)}. A receipt is in your payment history.` : 'Thank you — your payment was received.'}</p></>)}
      {failed && (<><XCircle className="mb-4 h-14 w-14 text-destructive" aria-hidden /><h1 className="text-2xl font-bold">Payment didn’t go through</h1><p className="mt-2 text-sm text-muted-foreground">You haven’t been charged. You can try again from the job page.</p></>)}
      {isError && !paid && !failed && (<><AlertTriangle className="mb-4 h-14 w-14 text-amber-500" aria-hidden /><h1 className="text-2xl font-bold">We couldn’t confirm the status</h1><p className="mt-2 text-sm text-muted-foreground">Check your payment history in a moment.</p></>)}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link href="/dashboard/payments">Payment history</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard">Dashboard</Link></Button>
      </div>
    </CardContent></Card>
  );
}
