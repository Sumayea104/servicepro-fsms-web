'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, CalendarCheck, CheckCircle2, ClipboardCheck, CreditCard, Star, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { icon: ClipboardCheck, title: 'Submit a request', body: 'Describe the problem, add your address and priority in a quick 3-step form.' },
  { icon: UserCheck, title: 'We match a technician', body: 'A dispatcher picks a verified technician by skill, distance, workload and rating.' },
  { icon: CalendarCheck, title: 'Visit is scheduled', body: 'You get a confirmed slot. Overlapping bookings are rejected automatically.' },
  { icon: CreditCard, title: 'Pay when it’s done', body: 'Review the service report, pay by card or bKash, then rate the work.' },
];

function Panel({ step }: { step: number }) {
  if (step === 0) return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New request</p>
      {['AC not cooling', 'Dhanmondi, Dhaka'].map((t, i) => <motion.div key={t} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }} className="rounded-xl border bg-background px-4 py-3 text-sm">{t}</motion.div>)}
      <div className="flex gap-2">{['AC repair', 'High priority'].map((t, i) => <motion.span key={t} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t}</motion.span>)}</div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-xl bg-gold py-2.5 text-center text-sm font-bold text-gold-foreground">Submit request</motion.div>
    </div>
  );
  if (step === 1) return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested technicians</p>
      {[['Rahim U.', '4.9', 92], ['Karim H.', '4.7', 81], ['Sadia A.', '4.8', 74]].map(([n, r, sc], i) => (
        <motion.div key={n as string} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }} className={cn('flex items-center gap-3 rounded-xl border p-3', i === 0 && 'border-primary bg-primary/5')}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-gold">{(n as string).slice(0, 2).toUpperCase()}</span>
          <div className="flex-1"><p className="text-sm font-semibold">{n}</p><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${sc}%` }} transition={{ delay: 0.3 + i * 0.12, duration: 0.8 }} /></div></div>
          <span className="flex items-center gap-1 text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-gold text-gold" />{r}</span>
        </motion.div>
      ))}
    </div>
  );
  if (step === 2) return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">This week</p>
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
          <motion.div key={d} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={cn('rounded-xl border py-3', i === 2 ? 'border-gold bg-gold/15 font-bold' : i === 1 ? 'bg-muted/70 text-muted-foreground line-through' : 'bg-background')}>
            <p className="text-muted-foreground">{d}</p><p className="mt-1 text-base font-bold">{10 + i}</p>{i === 2 && <p className="mt-1 text-[10px] text-gold">3 PM</p>}
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-xs font-medium text-success"><BadgeCheck className="h-4 w-4" /> No conflicts — slot confirmed</motion.p>
    </div>
  );
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</p>
      <div className="grid grid-cols-2 gap-2">{['Card · Stripe', 'bKash'].map((m, i) => <motion.div key={m} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className={cn('rounded-xl border p-3 text-center text-sm font-semibold', i === 0 && 'border-primary bg-primary/5')}>{m}</motion.div>)}</div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 rounded-xl bg-success/10 p-3"><CheckCircle2 className="h-6 w-6 text-success" /><div><p className="text-sm font-bold">Payment received</p><p className="text-xs text-muted-foreground">Receipt ready · rate your technician</p></div></motion.div>
    </div>
  );
}

/** Auto-advancing, click-to-jump walkthrough. Pauses while hovered or focused. */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 4500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <ol className="space-y-3">
        {STEPS.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.title}>
              <button type="button" onClick={() => setActive(i)} aria-current={on ? 'step' : undefined} className={cn('relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300', on ? 'bg-card shadow-lift' : 'bg-card/50 hover:bg-card')}>
                <div className="flex items-start gap-4">
                  <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors', on ? 'bg-brand-gradient text-gold' : 'bg-secondary text-muted-foreground')}><s.icon className="h-5 w-5" aria-hidden /></span>
                  <div><p className="font-semibold"><span className="mr-2 text-muted-foreground">0{i + 1}</span>{s.title}</p><p className={cn('mt-1 text-sm leading-relaxed text-muted-foreground transition-all', on ? 'max-h-24 opacity-100' : 'max-h-0 overflow-hidden opacity-0 md:max-h-24 md:opacity-70')}>{s.body}</p></div>
                </div>
                {on && !paused && <motion.span key={`bar-${active}`} className="absolute bottom-0 left-0 h-0.5 bg-gold" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4.5, ease: 'linear' }} />}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="relative rounded-3xl border bg-card p-6 shadow-lift sm:p-8">
        <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-gold/30 via-transparent to-primary/30 blur-xl" aria-hidden />
        <AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}><Panel step={active} /></motion.div></AnimatePresence>
      </div>
    </div>
  );
}
