'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBell } from './notification-bell';
import { ThemeToggle } from './theme-toggle';
import { CommandPalette } from './command-palette';
import { Logo } from './logo';
import { NAV } from './nav-config';
import { useAuth } from '@/hooks/use-auth';
import { useLiveNotifications } from '@/hooks/use-live-notifications';
import { useAuthStore } from '@/store/auth-store';
import { cn, humanize } from '@/lib/utils';
import type { User } from '@/types/api';

export function UserAvatar({ user, size = 36 }: { user: Pick<User, 'fullName' | 'avatarUrl'>; size?: number }) {
  const initials = user.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return user.avatarUrl ? (
    <Image src={user.avatarUrl} alt="" width={size} height={size} className="rounded-full object-cover ring-2 ring-white/20" style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden className="flex items-center justify-center rounded-full bg-gold font-bold text-gold-foreground ring-2 ring-white/20" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</span>
  );
}

export function DashboardShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const [open, setOpen] = useState(false);
  const live = useLiveNotifications();

  useEffect(() => setUser(user), [user, setUser]);
  useEffect(() => setOpen(false), [pathname]);

  // Role-based UI: the nav is chosen by the verified server-side user, never by anything client-editable.
  const items = NAV[user.role];
  const current = items.find((i) => (i.exact ? pathname === i.href : pathname.startsWith(i.href)));

  const sidebar = (
    <nav aria-label="Dashboard" className="flex h-full flex-col text-white">
      <div className="mb-8 px-2"><Logo light href="/" /></div>
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/45">{humanize(user.role)} workspace</p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn('group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', active ? 'bg-white/12 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white')}
              >
                {active && <span className="absolute -left-4 top-2 h-6 w-1 rounded-r-full bg-gold" aria-hidden />}
                <item.icon className={cn('h-[18px] w-[18px]', active ? 'text-gold' : 'text-white/55 group-hover:text-white')} aria-hidden /> {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/technicians" className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-white/8 hover:text-white">
        <ExternalLink className="h-[18px] w-[18px]" aria-hidden /> Browse technicians
      </Link>
      <div className="mt-auto rounded-2xl bg-white/8 p-3 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.fullName}</p><p className="truncate text-xs text-white/55">{user.email}</p></div>
        </div>
        <Button variant="ghost" size="sm" className="mt-3 w-full justify-start text-white/70 hover:bg-white/10 hover:text-white" onClick={logout}><LogOut className="h-4 w-4" /> Log out</Button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-sidebar p-5 pl-6 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-[#050b24]/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar p-5 pl-6 shadow-lift animate-in slide-in-from-left">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setOpen((o) => !o)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
            <p className="hidden text-sm font-semibold sm:block">{current?.label ?? 'Dashboard'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="mr-1 hidden items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground md:flex" title={live ? 'Live updates connected' : 'Live updates offline — refreshing every 30 seconds'}>
              <span className="relative flex h-2 w-2"><span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', live ? 'animate-ping bg-success' : 'bg-muted-foreground/40')} /><span className={cn('relative inline-flex h-2 w-2 rounded-full', live ? 'bg-success' : 'bg-muted-foreground/50')} /></span>{live ? 'Live' : 'Offline'}
            </span>
            <CommandPalette role={user.role} onLogout={logout} />
            <ThemeToggle className="hidden sm:flex" />
            <ThemeToggle compact className="sm:hidden" />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><div className="mx-auto w-full max-w-7xl">{children}</div></main>
      </div>
    </div>
  );
}
