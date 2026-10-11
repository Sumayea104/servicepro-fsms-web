import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, Star } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable, type Column } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { StatusBadge } from '@/components/shared/status-badge';
import { TechnicianVerifyActions } from '@/components/admin/technician-actions';
import { cn } from '@/lib/utils';
import { serverApi } from '@/lib/server-api';
import type { Paginated, TechnicianProfile } from '@/types/api';

export const metadata: Metadata = { title: 'Technicians' };

export default async function AdminTechnicians({ searchParams }: { searchParams: Promise<{ tab?: string; page?: string }> }) {
  const sp = await searchParams;
  const tab = sp.tab === 'all' ? 'all' : 'pending';
  const data = await serverApi<Paginated<TechnicianProfile>>(tab === 'pending' ? '/admin/technicians/pending' : '/technicians', { query: { page: sp.page || 1, limit: 10 } });

  const columns: Column<TechnicianProfile>[] = [
    { header: 'Technician', cell: (t) => <div><p className="font-medium">{t.user?.fullName}</p>{t.user?.email && <p className="text-xs text-muted-foreground">{t.user.email}</p>}</div> },
    { header: 'Skills', cell: (t) => (t.skills.length ? t.skills.join(', ') : <span className="text-muted-foreground">None added</span>) },
    { header: 'Rating', cell: (t) => <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />{t.rating.toFixed(1)}</span> },
    { header: 'Jobs', cell: (t) => t.totalJobs },
    { header: 'Status', cell: (t) => <StatusBadge status={t.isVerified ? 'COMPLETED' : 'PENDING'} className="capitalize" /> },
    ...(tab === 'pending' ? [{ header: 'Action', cell: (t: TechnicianProfile) => <TechnicianVerifyActions id={t.id} /> }] : []),
  ];

  const tabs = [{ id: 'pending', label: 'Pending verification' }, { id: 'all', label: 'All technicians' }];
  return (
    <>
      <PageHeader title="Technicians" description="Only verified technicians appear in dispatch suggestions." />
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Technician views">
        {tabs.map((t) => (
          <Link key={t.id} href={`/admin/technicians?tab=${t.id}`} role="tab" aria-selected={tab === t.id} className={cn('rounded-md px-3 py-2 text-sm font-medium', tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')}>{t.label}</Link>
        ))}
      </div>
      <DataTable columns={columns} rows={data.items} empty={<EmptyState icon={ShieldCheck} title={tab === 'pending' ? 'No one is waiting' : 'No technicians yet'} description={tab === 'pending' ? 'Every registered technician has been reviewed.' : 'Technicians appear here after they register.'} />} />
      <Pagination page={data.page} totalPages={data.totalPages} total={data.total} />
    </>
  );
}
