import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable, type Column } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { FilterSelect } from '@/components/shared/filter-select';
import { Pagination } from '@/components/shared/pagination';
import { StatusBadge } from '@/components/shared/status-badge';
import { UserActions } from '@/components/admin/user-actions';
import { serverApi } from '@/lib/server-api';
import { formatDate } from '@/lib/utils';
import type { AdminUser, Paginated } from '@/types/api';

export const metadata: Metadata = { title: 'Users' };

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ role?: string; page?: string }> }) {
  const sp = await searchParams;
  const data = await serverApi<Paginated<AdminUser>>('/admin/users', { query: { page: sp.page || 1, limit: 10, role: sp.role } });
  const columns: Column<AdminUser>[] = [
    { header: 'User', cell: (u) => <div><p className="font-medium">{u.fullName}</p><p className="text-xs text-muted-foreground">{u.email}</p></div> },
    { header: 'Status', cell: (u) => <StatusBadge status={u.isActive ? 'COMPLETED' : 'CANCELLED'} className="capitalize" /> },
    { header: 'Joined', cell: (u) => formatDate(u.createdAt), className: 'whitespace-nowrap' },
    { header: 'Last login', cell: (u) => formatDate(u.lastLoginAt), className: 'whitespace-nowrap' },
    { header: 'Role / actions', cell: (u) => <UserActions user={u} /> },
  ];
  return (
    <>
      <PageHeader title="Users" description="Change roles or deactivate accounts. Every change is written to the audit log." />
      <div className="mb-4"><FilterSelect param="role" label="Roles" options={['CUSTOMER', 'TECHNICIAN', 'ADMIN']} /></div>
      <DataTable columns={columns} rows={data.items} empty={<EmptyState icon={Users} title="No users found" />} />
      <Pagination page={data.page} totalPages={data.totalPages} total={data.total} />
    </>
  );
}
