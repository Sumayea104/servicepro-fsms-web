import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, light = false, href = '/' }: { className?: string; light?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn('group flex items-center gap-2.5 font-bold tracking-tight', light ? 'text-white' : 'text-foreground', className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-soft ring-1 ring-white/10 transition-transform group-hover:rotate-[-8deg]">
        <Wrench className="h-[18px] w-[18px] text-gold" aria-hidden />
      </span>
      <span className="text-lg">Service<span className="text-gold">Pro</span></span>
    </Link>
  );
}
