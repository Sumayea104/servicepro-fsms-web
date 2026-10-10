import type { Metadata } from 'next';
import { ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable, type Column } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { FilterSelect } from '@/components/shared/filter-select';
import { Pagination } from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { serverApi } from '@/lib/server-api';
import { formatDateTime, humanize } from '@/lib/utils';
import type { AuditLogEntry, Paginated } from '@/types/api';

export const metadata: Metadata = { title: 'Audit logs' };

export default async function AuditLogs({ searchParams }: { searchParams: Promise<{ entity?: string; page?: string }> }) {
  const sp = await searchParams;
  const data = await serverApi<Paginated<AuditLogEntry>>('/admin/audit-logs', { query: { page: sp.page || 1, limit: 15, entity: sp.entity } });
  const columns: Column<AuditLogEntry>[] = [
    { header: 'When', cell: (l) => formatDateTime(l.createdAt), className: 'whitespace-nowrap' },
    { header: 'Who', cell: (l) => <div><p className="font-medium">{l.user?.fullName ?? 'System'}</p><p className="text-xs text-muted-foreground">{l.user ? humanize(l.user.role) : ''}</p></div> },
    { header: 'Action', cell: (l) => <Badge className="bg-secondary text-secondary-foreground">{humanize(l.action)}</Badge> },
    { header: 'Entity', cell: (l) => <span>{l.entity} <span className="font-mono text-xs text-muted-foreground">{l.entityId.slice(0, 8)}</span></span> },
    { header: 'Details', cell: (l) => (l.details ? <code className="text-xs text-muted-foreground">{JSON.stringify(l.details)}</code> : '—'), className: 'max-w-xs truncate' },
  ];
  return (
    <>
      <PageHeader title="Audit logs" description="Who changed what, and when." />
      <div className="mb-4"><FilterSelect param="entity" label="Entities" options={['Job', 'Payment', 'User', 'TechnicianProfile']} /></div>
      <DataTable columns={columns} rows={data.items} empty={<EmptyState icon={ScrollText} title="No activity recorded" />} />
      <Pagination page={data.page} totalPages={data.totalPages} total={data.total} />
    </>
  );
}
