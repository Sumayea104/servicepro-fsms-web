'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, BarChart3, ClipboardList, Wrench, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RoleTab { id: string; label: string; icon: LucideIcon; headline: string; points: string[]; cta: string; href: string }

const ROLES: RoleTab[] = [
  { id: 'customer', label: 'Customers', icon: ClipboardList, headline: 'Know exactly where your repair stands', points: ['Track every request on a live timeline', 'Upload photos of the problem', 'Pay online and print receipts', 'Rate technicians after the job'], cta: 'Request a service', href: '/register' },
  { id: 'technician', label: 'Technicians', icon: Wrench, headline: 'Focus on the work, not the paperwork', points: ['See only the jobs assigned to you', 'File service reports with parts and hours', 'Set your skills and weekly schedule', 'Follow your earnings month by month'], cta: 'Join as a technician', href: '/register' },
  { id: 'admin', label: 'Admins', icon: BarChart3, headline: 'Dispatch with confidence and a full audit trail', points: ['Assign from ranked suggestions', 'Verify technicians before they get work', 'Live analytics and revenue charts', 'Every change recorded in the audit log'], cta: 'Try the admin demo', href: '/login' },
];

export function RolesTabs() {
  const [active, setActive] = useState(0);
  const role = ROLES[active]!;
  return (
    <div>
      <div role="tablist" aria-label="Choose a role" className="mx-auto flex w-fit gap-1 rounded-2xl border bg-card p-1.5 shadow-soft">
        {ROLES.map((r, i) => (
          <button key={r.id} role="tab" aria-selected={i === active} aria-controls={`role-${r.id}`} onClick={() => setActive(i)} className={cn('relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors', i === active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
            {i === active && <motion.span layoutId="role-pill" className="absolute inset-0 rounded-xl bg-primary" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <r.icon className="relative h-4 w-4" aria-hidden /><span className="relative">{r.label}</span>
          </button>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={role.id} id={`role-${role.id}`} role="tabpanel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="rounded-3xl border bg-card p-8 shadow-soft sm:p-10">
            <h3 className="text-2xl font-extrabold sm:text-3xl">{role.headline}</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {role.points.map((p, i) => (
                <motion.li key={p} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }} className="flex gap-2.5 text-muted-foreground"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />{p}</motion.li>
              ))}
            </ul>
            <Button asChild variant="gold" size="lg" className="mt-8"><Link href={role.href}>{role.cta}</Link></Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
