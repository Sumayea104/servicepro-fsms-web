import type { Metadata } from 'next';
import { PaymentResult } from '@/components/payments/payment-result';

export const metadata: Metadata = { title: 'Payment successful' };

export default async function PaymentSuccess({ searchParams }: { searchParams: Promise<{ paymentId?: string; redirect_status?: string }> }) {
  const sp = await searchParams;
  return <PaymentResult paymentId={sp.paymentId} redirectStatus={sp.redirect_status} />;
}
