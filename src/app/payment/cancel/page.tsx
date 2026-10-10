import Link from 'next/link';
import type { Metadata } from 'next';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Payment cancelled' };

export default async function PaymentCancel({ searchParams }: { searchParams: Promise<{ jobId?: string }> }) {
  const { jobId } = await searchParams;
  return (
    <Card className="w-full max-w-md"><CardContent className="flex flex-col items-center p-8 text-center">
      <XCircle className="mb-4 h-14 w-14 text-amber-500" aria-hidden />
      <h1 className="text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-sm text-muted-foreground">No payment was taken. Your job is still waiting for payment whenever you’re ready.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link href={jobId ? `/dashboard/jobs/${jobId}/pay` : '/dashboard/payments'}>Try again</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard">Back to dashboard</Link></Button>
      </div>
    </CardContent></Card>
  );
}
