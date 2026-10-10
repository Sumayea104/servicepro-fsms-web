import Link from 'next/link';
import type { Metadata } from 'next';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Payment failed' };

// The API redirects here when a bKash payment is not completed.
export default function PaymentFailed() {
  return (
    <Card className="w-full max-w-md"><CardContent className="flex flex-col items-center p-8 text-center">
      <XCircle className="mb-4 h-14 w-14 text-destructive" aria-hidden />
      <h1 className="text-2xl font-bold">Payment failed</h1>
      <p className="mt-2 text-sm text-muted-foreground">The gateway reported a problem and you haven’t been charged. You can try again or use a different method.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link href="/dashboard/payments">Payment history</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard">Back to dashboard</Link></Button>
      </div>
    </CardContent></Card>
  );
}
