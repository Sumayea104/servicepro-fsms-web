'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileNav({ links, dashboardHref }: { links: { href: string; label: string }[]; dashboardHref: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {open && (
        <nav id="mobile-menu" className="absolute inset-x-0 top-16 border-b bg-background p-4 shadow-lg" aria-label="Mobile">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-accent">{l.label}</Link></li>
            ))}
            <li className="pt-2">
              {dashboardHref ? (
                <Button asChild className="w-full"><Link href={dashboardHref} onClick={() => setOpen(false)}>Go to dashboard</Link></Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline"><Link href="/login" onClick={() => setOpen(false)}>Log in</Link></Button>
                  <Button asChild><Link href="/register" onClick={() => setOpen(false)}>Get started</Link></Button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
