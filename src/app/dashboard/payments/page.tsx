import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { FilterSelect } from '@/components/shared/filter-select';
import { Pagination } from '@/components/shared/pagination';
import { PaymentsTable } from '@/components/payments/payments-table';
import { PAYMENT_STATUSES } from '@/lib/constants';
import { serverApi } from '@/lib/server-api';
import type { Paginated, PaymentWithJob } from '@/types/api';

export const metadata: Metadata = { title: 'Payments' };

export default async function CustomerPayments({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const sp = await searchParams;
  const data = await serverApi<Paginated<PaymentWithJob>>('/payments', { query: { page: sp.page || 1, limit: 10, status: sp.status } });
  return (
    <>
      <PageHeader title="Payment history" description="Every payment you’ve made, with its status." />
      <div className="mb-4"><FilterSelect param="status" label="Statuses" options={PAYMENT_STATUSES} /></div>
      <PaymentsTable payments={data.items} role="CUSTOMER" />
      <Pagination page={data.page} totalPages={data.totalPages} total={data.total} />
    </>
  );
}
