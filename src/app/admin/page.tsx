import Link from 'next/link';
import type { Metadata } from 'next';
import { format, startOfDay, subDays } from 'date-fns';
import { ArrowRight, Banknote, ClipboardList, Clock, ShieldCheck, Star, Users, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { StarRating } from '@/components/shared/star-rating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart, JobsByStatusChart, JobsTrendChart } from '@/components/charts/admin-charts';
import { TechnicianAvatar } from '@/components/technicians/technician-card';
import { getCurrentUser } from '@/lib/server-session';
import { serverApi } from '@/lib/server-api';
import { formatCurrency, humanize, timeAgo } from '@/lib/utils';
import type { AuditLogEntry, DashboardStats, Job, Paginated, PaymentWithJob, TechnicianProfile } from '@/types/api';

export const metadata: Metadata = { title: 'Admin overview' };

export default async function AdminOverview() {
  const [user, s, jobs, paid, logs, techs] = await Promise.all([
    getCurrentUser(),
    serverApi<DashboardStats>('/admin/dashboard-stats'),
    serverApi<Paginated<Job>>('/jobs', { query: { limit: 100 } }),
    serverApi<Paginated<PaymentWithJob>>('/payments', { query: { status: 'PAID', limit: 100 } }),
    serverApi<Paginated<AuditLogEntry>>('/admin/audit-logs', { query: { limit: 6 } }),
    serverApi<Paginated<TechnicianProfile>>('/technicians', { query: { verified: 'true', limit: 4 } }),
  ]);

  const statusData = Object.entries(s.jobsByStatus).map(([name, value]) => ({ name: humanize(name), value }));
  const totalJobs = statusData.reduce((n, j) => n + j.value, 0);
  const pendingJobs = s.jobsByStatus.PENDING ?? 0;
  const pendingTechs = s.totalTechnicians - s.verifiedTechnicians;

  // Revenue is totalled per currency (bKash = BDT, Stripe = USD) — never added across currencies.
  const revenue = { BDT: 0, USD: 0 } as Record<string, number>;
  const byMethod: Record<string, number> = {};
  for (const p of paid.items) {
    const cur = p.currency === 'USD' ? 'USD' : 'BDT';
    revenue[cur] = (revenue[cur] ?? 0) + Number(p.amount);
    byMethod[p.method] = (byMethod[p.method] ?? 0) + 1;
  }

  // New requests per day for the last 14 days (from the 100 most recent jobs).
  const days = Array.from({ length: 14 }, (_, i) => startOfDay(subDays(new Date(), 13 - i)));
  const trend = days.map((d) => ({ day: format(d, 'd MMM'), jobs: jobs.items.filter((j) => startOfDay(new Date(j.createdAt)).getTime() === d.getTime()).length }));

  return (
    <>
      <PageHeader eyebrow="Admin workspace" title={`Good to see you, ${user.fullName.split(' ')[0]}`} description="Live platform numbers — statistics refresh at most once a minute."
        actions={<><Button asChild variant="outline"><Link href="/admin/technicians">Verify technicians</Link></Button><Button asChild variant="gold"><Link href="/admin/jobs?status=PENDING">Dispatch requests</Link></Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting dispatch" value={pendingJobs} icon={Clock} tone="gold" hint="Pending requests" href="/admin/jobs?status=PENDING" />
        <StatCard label="Pending verification" value={pendingTechs} icon={ShieldCheck} tone="rose" hint="Technicians to review" href="/admin/technicians?tab=pending" />
        <StatCard label="Total jobs" value={totalJobs} icon={ClipboardList} hint={`${s.jobsByStatus.COMPLETED ?? 0} completed`} href="/admin/jobs" />
        <StatCard label="Users" value={s.totalUsers} icon={Users} tone="violet" hint={`${s.totalCustomers} customers`} href="/admin/users" />
        <StatCard label="Revenue (bKash)" value={formatCurrency(revenue.BDT, 'BDT')} icon={Banknote} tone="success" />
        <StatCard label="Revenue (Stripe)" value={formatCurrency(revenue.USD, 'USD')} icon={Banknote} tone="success" />
        <StatCard label="Technicians" value={s.totalTechnicians} icon={Wrench} hint={`${s.verifiedTechnicians} verified`} />
        <StatCard label="Avg. rating" value={s.averageTechnicianRating.toFixed(2)} icon={Star} tone="gold" hint="Across all technicians" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-lg">New requests · last 14 days</CardTitle></CardHeader><CardContent><JobsTrendChart data={trend} /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Jobs by status</CardTitle></CardHeader><CardContent>{statusData.length ? <JobsByStatusChart data={statusData} /> : <EmptyState title="No jobs yet" />}</CardContent></Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-lg">Recent activity</CardTitle><Button asChild variant="ghost" size="sm"><Link href="/admin/reports">View all <ArrowRight className="h-4 w-4" /></Link></Button></CardHeader>
          <CardContent>
            {logs.items.length === 0 ? <EmptyState title="No activity yet" /> : (
              <ul className="divide-y">
                {logs.items.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{(l.user?.fullName ?? 'S')[0]}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm"><span className="font-semibold">{l.user?.fullName ?? 'System'}</span> <span className="text-muted-foreground">· {humanize(l.action)}</span></p><p className="text-xs text-muted-foreground">{l.entity} · {timeAgo(l.createdAt)}</p></div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Payments by method</CardTitle></CardHeader>
            <CardContent>{Object.keys(byMethod).length ? <DonutChart label="Paid payments by method" data={Object.entries(byMethod).map(([name, value]) => ({ name: humanize(name), value }))} /> : <EmptyState title="No payments yet" />}</CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-lg">Top-rated technicians</CardTitle><Button asChild variant="ghost" size="sm"><Link href="/admin/technicians?tab=all">Manage <ArrowRight className="h-4 w-4" /></Link></Button></CardHeader>
        <CardContent>
          {techs.items.length === 0 ? <EmptyState title="No verified technicians yet" description="Verify technicians so they can receive jobs." /> : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techs.items.map((t) => (
                <li key={t.id}><Link href={`/technicians/${t.id}`} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent/50"><TechnicianAvatar name={t.user?.fullName ?? 'T'} url={t.user?.avatarUrl} size={44} /><div className="min-w-0"><p className="truncate text-sm font-semibold">{t.user?.fullName}</p><StarRating value={t.rating} /></div></Link></li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
