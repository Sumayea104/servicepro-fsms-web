import Image from 'next/image';
import { BadgeCheck, CalendarCheck, CreditCard } from 'lucide-react';
import { Tilt } from '@/components/motion/parallax';
import { photo } from '@/lib/photos';

/** Real photo with live-looking UI chips when `public/photos/hero.jpg` exists; otherwise the SVG dashboard artwork. */
export function HeroVisual() {
  const hero = photo('hero', '/images/hero.svg');
  if (!hero.isPhoto) {
    return (
      <Tilt className="mx-auto w-full max-w-[600px]">
        <Image src="/images/hero.svg" alt="ServicePro dashboard showing an assigned repair job, technician, calendar slot and payment" width={640} height={470} priority className="h-auto w-full animate-float" />
      </Tilt>
    );
  }
  return (
    <Tilt className="relative mx-auto w-full max-w-[560px]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white/15 shadow-lift">
        <Image src={hero.src} alt="A ServicePro technician at work" fill priority sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1233]/60 via-transparent to-transparent" aria-hidden />
      </div>
      <div className="absolute -left-5 top-8 flex animate-float items-center gap-2.5 rounded-2xl bg-card px-4 py-3 text-card-foreground shadow-lift"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success"><BadgeCheck className="h-5 w-5" aria-hidden /></span><div><p className="text-sm font-bold">Technician verified</p><p className="text-xs text-muted-foreground">4.9 ★ · 128 jobs</p></div></div>
      <div className="absolute -right-4 bottom-24 flex animate-float items-center gap-2.5 rounded-2xl bg-card px-4 py-3 text-card-foreground shadow-lift [animation-delay:1.2s]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarCheck className="h-5 w-5" aria-hidden /></span><div><p className="text-sm font-bold">Visit scheduled</p><p className="text-xs text-muted-foreground">Today · 3:00 PM</p></div></div>
      <div className="absolute -bottom-4 left-10 flex animate-float items-center gap-2.5 rounded-2xl bg-gold px-4 py-3 text-gold-foreground shadow-lift [animation-delay:2.2s]"><CreditCard className="h-5 w-5" aria-hidden /><p className="text-sm font-bold">Paid securely</p></div>
    </Tilt>
  );
}
