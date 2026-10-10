import { DashboardShell } from '@/components/layout/dashboard-shell';
import { requireRole } from '@/lib/server-session';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('ADMIN');
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
