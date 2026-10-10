import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { DataTable, type Column } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { jobHref } from '@/lib/constants';
import { formatDate, formatDateTime, humanize } from '@/lib/utils';
import type { Job, Role } from '@/types/api';

export function JobTable({ jobs, role, showCustomer = false, emptyAction }: { jobs: Job[]; role: Role; showCustomer?: boolean; emptyAction?: React.ReactNode }) {
  const columns: Column<Job>[] = [
    { header: 'Job', cell: (j) => (<Link href={jobHref(role, j.id)} className="font-medium text-primary hover:underline">{j.title}</Link>) },
    ...(showCustomer ? [{ header: 'Customer', cell: (j: Job) => j.customer?.fullName ?? '—' }] : []),
    { header: 'Category', cell: (j) => humanize(j.category) },
    { header: 'Priority', cell: (j) => <StatusBadge status={j.priority} /> },
    { header: 'Status', cell: (j) => <StatusBadge status={j.status} /> },
    { header: 'Scheduled', cell: (j) => formatDateTime(j.scheduledAt), className: 'whitespace-nowrap' },
    { header: 'Created', cell: (j) => formatDate(j.createdAt), className: 'whitespace-nowrap' },
  ];

  return (
    <DataTable
      columns={columns}
      rows={jobs}
      empty={<EmptyState icon={ClipboardList} title="No jobs found" description="Nothing matches these filters yet." action={emptyAction} />}
    />
  );
}
