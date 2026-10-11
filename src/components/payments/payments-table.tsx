import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import { DataTable, type Column } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { jobHref } from '@/lib/constants';
import { formatCurrency, formatDateTime, humanize } from '@/lib/utils';
import type { PaymentWithJob, Role } from '@/types/api';

export function PaymentsTable({ payments, role }: { payments: PaymentWithJob[]; role: Role }) {
  const columns: Column<PaymentWithJob>[] = [
    { header: 'Job', cell: (p) => (p.job ? <Link href={jobHref(role, p.job.id)} className="font-medium text-primary hover:underline">{p.job.title}</Link> : '—') },
    { header: 'Amount', cell: (p) => formatCurrency(p.amount, p.currency), className: 'whitespace-nowrap' },
    { header: 'Method', cell: (p) => humanize(p.method) },
    { header: 'Status', cell: (p) => <StatusBadge status={p.status} /> },
    { header: 'Paid on', cell: (p) => formatDateTime(p.paidAt), className: 'whitespace-nowrap' },
    ...(role === 'CUSTOMER' ? [{ header: 'Receipt', cell: (p: PaymentWithJob) => (p.status === 'PAID' ? <Link href={`/dashboard/payments/${p.id}`} className="font-medium text-primary hover:underline">View</Link> : <span className="text-muted-foreground">—</span>) }] : []),
  ];
  return <DataTable columns={columns} rows={payments} empty={<EmptyState icon={CreditCard} title="No payments yet" description="Payments appear here once a job is completed and paid for." />} />;
}
