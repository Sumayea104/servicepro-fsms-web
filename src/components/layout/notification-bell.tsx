'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { cn, timeAgo } from '@/lib/utils';
import { jobHref } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import type { Notification, Paginated } from '@/types/api';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const role = useAuthStore((s) => s.user?.role);

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api<Paginated<Notification>>('/notifications', { query: { limit: 8 } }),
    refetchInterval: 30_000,
  });

  // Optimistic: mark read instantly, roll back if the API call fails.
  const markRead = useMutation({
    mutationFn: (id: string) => api(`/notifications/${id}/read`, { method: 'PATCH', body: {} }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['notifications'] });
      const previous = qc.getQueryData<Paginated<Notification>>(['notifications']);
      qc.setQueryData<Paginated<Notification>>(['notifications'], (old) => old && { ...old, items: old.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)) });
      return { previous };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['notifications'], ctx.previous);
      toast.error('Could not update notification');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = data?.items.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{unread}</span>}
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border bg-background shadow-lg">
          <div className="border-b px-4 py-3 text-sm font-semibold">Notifications</div>
          <ul className="max-h-80 divide-y overflow-y-auto">
            {!data?.items.length && <li className="px-4 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</li>}
            {data?.items.map((n) => (
              <li key={n.id} className={cn('px-4 py-3 text-sm', !n.isRead && 'bg-primary/5')}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <button className="shrink-0 text-xs text-primary hover:underline" onClick={() => markRead.mutate(n.id)}>Mark read</button>}
                </div>
                {n.link && <Link href={n.link.replace(/^\/jobs\/(.+)$/, (_m, id: string) => jobHref(role, id))} className="mt-1 inline-block text-xs text-primary hover:underline" onClick={() => setOpen(false)}>View</Link>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
