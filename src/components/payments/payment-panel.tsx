'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api, ApiError } from '@/lib/api-client';
import { cn, formatCurrency } from '@/lib/utils';
import type { PaymentInitiation, PaymentMethod } from '@/types/api';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : null;

function StripeCheckout({ paymentId, jobId }: { paymentId: string; jobId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    // Stripe redirects to return_url after confirmation (adding redirect_status); the success page
    // then confirms the final state with our API, which is updated by the signed Stripe webhook.
    const { error } = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${window.location.origin}/payment/success?paymentId=${paymentId}` } });
    if (error) toast.error(error.message || 'Payment could not be completed');
    setBusy(false);
  }

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={busy} disabled={!stripe}>Pay securely</Button>
        <Button asChild type="button" variant="outline"><Link href={`/payment/cancel?jobId=${jobId}`}>Cancel</Link></Button>
      </div>
    </form>
  );
}

export function PaymentPanel({ jobId, amountBdt, jobTitle }: { jobId: string; amountBdt: number; jobTitle: string }) {
  const [method, setMethod] = useState<PaymentMethod>('STRIPE');
  const [session, setSession] = useState<PaymentInitiation | null>(null);

  const initiate = useMutation({
    mutationFn: () => api<PaymentInitiation>('/payments/initiate', { method: 'POST', body: { jobId, method } }),
    onSuccess: (data) => {
      if (data.provider === 'BKASH' && data.bkashURL) {
        window.location.href = data.bkashURL; // bKash hosted checkout; the API finalises on callback and redirects back
        return;
      }
      setSession(data);
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not start the payment'),
  });

  const options = useMemo(() => (session?.clientSecret ? { clientSecret: session.clientSecret } : null), [session]);

  const methods: { id: PaymentMethod; label: string; hint: string; icon: typeof CreditCard }[] = [
    { id: 'STRIPE', label: 'Card (Stripe)', hint: 'Visa, Mastercard, Amex', icon: CreditCard },
    { id: 'BKASH', label: 'bKash', hint: 'Pay in BDT from your wallet', icon: Smartphone },
  ];

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Pay for your job</CardTitle>
        <CardDescription>{jobTitle} · <span className="font-semibold text-foreground">{formatCurrency(amountBdt, 'BDT')}</span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!session ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
              {methods.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={method === m.id} onClick={() => setMethod(m.id)}
                  className={cn('flex items-start gap-3 rounded-lg border p-4 text-left transition-colors', method === m.id ? 'border-primary bg-primary/5' : 'hover:bg-accent')}>
                  <m.icon className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                  <span><span className="block text-sm font-medium">{m.label}</span><span className="text-xs text-muted-foreground">{m.hint}</span></span>
                </button>
              ))}
            </div>
            {method === 'STRIPE' && <p className="text-xs text-muted-foreground">Card payments settle in USD, so the BDT price is converted at the platform rate (about BDT 120 = US$1). You’ll see the exact card amount on the next step. Use a Stripe test card in test mode.</p>}
            <div className="flex flex-wrap gap-3">
              <Button loading={initiate.isPending} onClick={() => initiate.mutate()}>{method === 'BKASH' ? 'Continue to bKash' : 'Continue'}</Button>
              <Button asChild variant="outline"><Link href={`/payment/cancel?jobId=${jobId}`}>Cancel</Link></Button>
            </div>
          </>
        ) : options && stripePromise ? (
          <Elements stripe={stripePromise} options={options}><p className="mb-4 rounded-md bg-muted p-3 text-sm">You’ll be charged <span className="font-semibold">{formatCurrency(session.payment.amount, session.payment.currency)}</span> (job price {formatCurrency(amountBdt, 'BDT')}).</p><StripeCheckout paymentId={session.payment.id} jobId={jobId} /></Elements>
        ) : (
          <p className="text-sm text-destructive">Stripe isn’t configured (missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).</p>
        )}
      </CardContent>
    </Card>
  );
}
