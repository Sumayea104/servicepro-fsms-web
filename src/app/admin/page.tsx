import type { Metadata } from 'next';
import { Banknote, ClipboardList, ShieldCheck, Star, Users, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobsByStatusChart, UsersByRoleChart } from '@/components/charts/admin-charts';
import { serverApi } from '@/lib/server-api';
import { formatCurrency, humanize } from '@/lib/utils';
import type { DashboardStats } from '@/types/api';

export const metadata: Metadata = { title: 'Admin overview' };

export default async function AdminOverview() {
  const s = await serverApi<DashboardStats>('/admin/dashboard-stats');
  const jobs = Object.entries(s.jobsByStatus).map(([name, value]) => ({ name: humanize(name), value }));
  const totalJobs = jobs.reduce((n, j) => n + j.value, 0);

  return (
    <>
      <PageHeader title="Overview" description="Live platform numbers (cached for up to a minute)." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total users" value={s.totalUsers} icon={Users} hint={`${s.totalCustomers} customers`} />
        <StatCard label="Technicians" value={s.totalTechnicians} icon={Wrench} hint={`${s.verifiedTechnicians} verified`} />
        <StatCard label="Jobs" value={totalJobs} icon={ClipboardList} />
        <StatCard label="Revenue collected" value={formatCurrency(s.totalRevenue)} icon={Banknote} hint="All paid invoices, as recorded" />
        <StatCard label="Avg. technician rating" value={s.averageTechnicianRating.toFixed(2)} icon={Star} />
        <StatCard label="Pending verification" value={s.totalTechnicians - s.verifiedTechnicians} icon={ShieldCheck} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-lg">Jobs by status</CardTitle></CardHeader><CardContent>{jobs.length ? <JobsByStatusChart data={jobs} /> : <EmptyState title="No jobs yet" description="Charts appear once customers submit requests." />}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Users by role</CardTitle></CardHeader><CardContent><UsersByRoleChart data={[{ role: 'Customers', users: s.totalCustomers }, { role: 'Technicians', users: s.totalTechnicians }, { role: 'Admins', users: Math.max(0, s.totalUsers - s.totalCustomers - s.totalTechnicians) }]} /></CardContent></Card>
      </div>
    </>
  );
}
