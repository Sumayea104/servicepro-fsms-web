import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONES = {
  primary: 'bg-primary/10 text-primary',
  gold: 'bg-gold/15 text-gold',
  success: 'bg-success/10 text-success',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
} as const;

interface StatCardProps { label: string; value: string | number; icon: LucideIcon; hint?: string; tone?: keyof typeof TONES; href?: string }

export function StatCard({ label, value, icon: Icon, hint, tone = 'primary', href }: StatCardProps) {
  const body = (
    <div className={cn('group relative h-full overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition-all duration-300', href && 'hover:-translate-y-0.5 hover:shadow-lift')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-[28px] font-extrabold leading-none tracking-tight">{value}</p>
          {hint && <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', TONES[tone])} aria-hidden><Icon className="h-5 w-5" /></span>
      </div>
    </div>
  );
  return href ? <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">{body}</Link> : body;
}
