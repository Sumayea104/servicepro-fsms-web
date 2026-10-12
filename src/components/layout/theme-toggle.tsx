'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const;

/** Three-way theme switch (Light / System / Dark) with a sliding highlight. */
export function ThemeToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = mounted ? theme ?? 'system' : 'light';

  if (compact) {
    const dark = mounted && resolvedTheme === 'dark';
    return (
      <button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={cn('relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent', className)}>
        <motion.span key={dark ? 'moon' : 'sun'} initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          {dark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </motion.span>
      </button>
    );
  }

  return (
    <div role="radiogroup" aria-label="Colour theme" className={cn('relative flex items-center rounded-xl border bg-card p-0.5 shadow-sm', className)}>
      {OPTIONS.map((o) => {
        const on = active === o.value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} aria-label={`${o.label} theme`} title={`${o.label} theme`} onClick={() => setTheme(o.value)}
            className={cn('relative z-10 flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors', on ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
            {on && <motion.span layoutId="theme-pill" className="absolute inset-0 -z-10 rounded-[10px] bg-primary shadow-sm" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <o.icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
