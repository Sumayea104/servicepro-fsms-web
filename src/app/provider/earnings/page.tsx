import type { Metadata } from 'next';
import { format } from 'date-fns';
import { Banknote, CheckCircle2, Receipt } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Pagination } from '@/components/shared/pagination';
import { PaymentsTable } from '@/components/payments/payments-table';
import { EarningsChart, type MonthlyEarning } from '@/components/charts/earnings-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { serverApi } from '@/lib/server-api';
import { formatCurrency } from '@/lib/utils';
import type { Paginated, PaymentWithJob } from '@/types/api';

export const metadata: Metadata = { title: 'Earnings' };

export default async function Earnings({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const [page, paid] = await Promise.all([
    serverApi<Paginated<PaymentWithJob>>('/payments', { query: { page: sp.page || 1, limit: 10 } }),
    serverApi<Paginated<PaymentWithJob>>('/payments', { query: { status: 'PAID', limit: 100 } }),
  ]);

  // Totals are kept per currency: bKash settles in BDT and card payments in USD, so they can't be added together.
  const totals = { BDT: 0, USD: 0 } as Record<string, number>;
  const byMonth = new Map<string, MonthlyEarning>();
  for (const p of paid.items) {
    const cur = p.currency === 'USD' ? 'USD' : 'BDT';
    totals[cur] = (totals[cur] ?? 0) + Number(p.amount);
    const key = format(new Date(p.paidAt ?? p.createdAt), 'yyyy-MM');
    const row = byMonth.get(key) ?? { month: format(new Date(`${key}-01`), 'MMM yy'), BDT: 0, USD: 0 };
    row[cur] += Number(p.amount);
    byMonth.set(key, row);
  }
  const chart = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);

  return (
    <>
      <PageHeader title="Earnings" description="Payments received for jobs you completed." />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Earned (BDT)" value={formatCurrency(totals.BDT, 'BDT')} icon={Banknote} />
        <StatCard label="Earned (USD)" value={formatCurrency(totals.USD, 'USD')} icon={Banknote} />
        <StatCard label="Paid jobs" value={paid.total} icon={CheckCircle2} />
      </div>
      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Receipt className="h-5 w-5" aria-hidden /> Monthly earnings</CardTitle></CardHeader>
        <CardContent>{chart.length ? <EarningsChart data={chart} /> : <EmptyState title="No earnings yet" description="Completed and paid jobs will show up here." />}</CardContent>
      </Card>
      <PaymentsTable payments={page.items} role="TECHNICIAN" />
      <Pagination page={page.page} totalPages={page.totalPages} total={page.total} />
    </>
  );
}
