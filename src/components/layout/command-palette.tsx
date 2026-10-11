'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CornerDownLeft, LogOut, Moon, Search, Sun, Users } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NAV } from './nav-config';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/api';

interface Command { id: string; label: string; hint?: string; icon: React.ComponentType<{ className?: string }>; run: () => void; keywords?: string }

/** Ctrl/⌘ + K quick launcher: jump to any page for the current role, toggle the theme, search jobs (admin) or sign out. */
export function CommandPalette({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = useCallback((href: string) => { setOpen(false); router.push(href); }, [router]);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV[role].map((n) => ({ id: n.href, label: n.label, hint: 'Go to page', icon: n.icon, keywords: n.keywords, run: () => go(n.href) }));
    const extra: Command[] = [
      { id: 'theme', label: resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', hint: 'Appearance', icon: resolvedTheme === 'dark' ? Sun : Moon, keywords: 'theme dark light', run: () => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); setOpen(false); } },
      { id: 'tech', label: 'Browse technicians', hint: 'Public directory', icon: Users, keywords: 'directory verified', run: () => go('/technicians') },
      { id: 'logout', label: 'Log out', hint: 'End session', icon: LogOut, run: () => { setOpen(false); onLogout(); } },
    ];
    const q = query.trim();
    const search: Command[] = role === 'ADMIN' && q ? [{ id: 'search', label: `Search jobs for “${q}”`, hint: 'Admin search', icon: Search, run: () => go(`/admin/jobs?q=${encodeURIComponent(q)}`) }] : [];
    const all = [...nav, ...extra];
    const filtered = q ? all.filter((c) => `${c.label} ${c.keywords ?? ''}`.toLowerCase().includes(q.toLowerCase())) : all;
    return [...search, ...filtered];
  }, [role, query, resolvedTheme, setTheme, go, onLogout]);

  useEffect(() => setActive(0), [query, open]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); else setQuery(''); }, [open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, commands.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); commands[active]?.run(); }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="hidden w-56 justify-between text-muted-foreground sm:flex" onClick={() => setOpen(true)} aria-label="Open quick search">
        <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Quick search…</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Ctrl K</kbd>
      </Button>
      <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setOpen(true)} aria-label="Open quick search"><Search className="h-5 w-5" /></Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[22%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 [&>button]:hidden">
          <DialogTitle className="sr-only">Quick search</DialogTitle>
          <DialogDescription className="sr-only">Type to find a page or action, use arrow keys and Enter.</DialogDescription>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} placeholder="Search pages and actions…" aria-label="Search pages and actions" className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <ul role="listbox" className="max-h-80 overflow-y-auto p-2">
            {commands.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results</li>}
            {commands.map((c, i) => (
              <li key={c.id} role="option" aria-selected={i === active}>
                <button type="button" onMouseEnter={() => setActive(i)} onClick={c.run} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm', i === active ? 'bg-accent' : '')}>
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">{c.label}</span>
                  <span className="text-xs text-muted-foreground">{c.hint}</span>
                  {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
