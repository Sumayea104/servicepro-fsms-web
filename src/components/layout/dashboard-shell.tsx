'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, ClipboardList, CreditCard, LayoutDashboard, LogOut, Menu, PlusCircle, ShieldCheck, UserCog, Users, Wallet, Wrench, X, FileText, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBell } from './notification-bell';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { cn, humanize } from '@/lib/utils';
import type { Role, User } from '@/types/api';

interface NavItem { href: string; label: string; icon: LucideIcon; exact?: boolean }

const NAV: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { href: '/dashboard', label: 'My requests', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/jobs/new', label: 'New request', icon: PlusCircle },
    { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: UserCog },
  ],
  TECHNICIAN: [
    { href: '/provider', label: 'My jobs', icon: ClipboardList, exact: true },
    { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
    { href: '/provider/profile', label: 'Profile & availability', icon: UserCog },
  ],
  ADMIN: [
    { href: '/admin', label: 'Overview', icon: BarChart3, exact: true },
    { href: '/admin/jobs', label: 'Jobs', icon: ClipboardList },
    { href: '/admin/technicians', label: 'Technicians', icon: ShieldCheck },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/reports', label: 'Audit logs', icon: FileText },
  ],
};

export function DashboardShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const [open, setOpen] = useState(false);

  useEffect(() => setUser(user), [user, setUser]);
  useEffect(() => setOpen(false), [pathname]);

  // Role-based UI: the nav is chosen by the verified server-side user, never by anything client-editable.
  const items = NAV[user.role];

  const sidebar = (
    <nav aria-label="Dashboard" className="flex h-full flex-col">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2 font-bold">
        <span className="rounded-lg bg-primary p-1.5 text-primary-foreground"><Wrench className="h-5 w-5" aria-hidden /></span> ServicePro
      </Link>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}
              >
                <item.icon className="h-4 w-4" aria-hidden /> {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto border-t pt-4">
        <p className="truncate px-2 text-sm font-medium">{user.fullName}</p>
        <p className="truncate px-2 text-xs text-muted-foreground">{humanize(user.role)}</p>
        <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={logout}><LogOut className="h-4 w-4" /> Log out</Button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r bg-card p-4 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-card p-4 shadow-xl">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="hidden text-sm text-muted-foreground lg:block">Signed in as <span className="font-medium text-foreground">{user.email}</span></div>
          <NotificationBell />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
