import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, Bell, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TechnicianCard } from '@/components/technicians/technician-card';
import { ServiceCard, type ServiceItem } from '@/components/landing/service-card';
import { HeroVisual } from '@/components/landing/hero-visual';
import { HowItWorks } from '@/components/landing/how-it-works';
import { RolesTabs } from '@/components/landing/roles-tabs';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { RotatingWords } from '@/components/motion/rotating-words';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { publicApi } from '@/lib/public-api';
import { photo } from '@/lib/photos';
import { humanize } from '@/lib/utils';
import type { Paginated, TechnicianProfile } from '@/types/api';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Book vetted electricians, plumbers, AC and appliance technicians. Dispatch-managed scheduling and secure online payment.',
  openGraph: { title: 'ServicePro — Book a verified technician', description: 'Dispatch-managed field service with transparent payments.' },
};

const SERVICES: ServiceItem[] = [
  { slug: 'electrical', key: 'ELECTRICAL', blurb: 'Wiring, switchboards, lighting' },
  { slug: 'plumbing', key: 'PLUMBING', blurb: 'Leaks, drains, taps, pumps' },
  { slug: 'ac-repair', key: 'AC_REPAIR', blurb: 'Servicing, gas refill, install' },
  { slug: 'appliance-repair', key: 'APPLIANCE_REPAIR', blurb: 'Fridge, washer, oven' },
  { slug: 'carpentry', key: 'CARPENTRY', blurb: 'Furniture, doors, fittings' },
  { slug: 'painting', key: 'PAINTING', blurb: 'Interior, exterior, touch-ups' },
  { slug: 'cleaning', key: 'CLEANING', blurb: 'Deep and post-renovation' },
  { slug: 'other', key: 'OTHER', blurb: 'Describe it — we’ll match it' },
];

async function loadTechnicians(): Promise<{ items: TechnicianProfile[]; total: number }> {
  try {
    const data = await publicApi<Paginated<TechnicianProfile>>('/technicians', { verified: 'true', limit: 4 });
    return { items: data.items, total: data.total };
  } catch {
    return { items: [], total: 0 }; // the landing page must never fail because the API is slow or down
  }
}

export default async function HomePage() {
  const { items: techs, total } = await loadTechnicians();
  const cta = photo('cta', '');
  const stats = [
    ...(total > 0 ? [{ value: total, label: 'Verified technicians' }] : []),
    { value: SERVICES.length, label: 'Service categories' },
    { value: 2, label: 'Payment methods' },
    { value: 5, label: 'Step-by-step job lifecycle' },
  ];

  return (
    <>
      <ScrollProgress />
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
        <div className="absolute -right-24 -top-24 h-96 w-96 animate-float rounded-full bg-gold/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
        <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-gold" /></span> Verified technicians · Conflict-free scheduling
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
              Book a trusted <br className="hidden sm:block" />
              <RotatingWords words={['electrician', 'plumber', 'AC technician', 'carpenter', 'cleaner']} className="text-gradient" /> in minutes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">Tell us what’s broken. We review it, assign a verified technician, schedule the visit and keep you updated until the work is done and paid for.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold"><Link href="/register">Request a service <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"><Link href="/login">Try the live demo</Link></Button>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
              {['Stripe & bKash payments', 'Live notifications', 'Printable receipts'].map((t) => <li key={t} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-gold" aria-hidden /> {t}</li>)}
            </ul>
          </div>
          <div className="animate-fade-up delay-2"><HeroVisual /></div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b bg-card">
        <div className="container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center"><p className="text-3xl font-extrabold text-primary sm:text-4xl"><AnimatedNumber value={s.value} /></p><p className="mt-1 text-sm text-muted-foreground">{s.label}</p></div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b bg-secondary/40 py-4" aria-hidden>
        <div className="animate-marquee flex w-max gap-4">
          {[...SERVICES, ...SERVICES, ...SERVICES, ...SERVICES].map((s, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-full border bg-card px-4 py-2 text-sm font-medium"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{humanize(s.key)}</span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Services</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Every repair, one request</h2>
          <p className="mt-3 text-muted-foreground">Pick a category and we’ll match you with a technician who has exactly that skill.</p>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => <StaggerItem key={s.slug}><ServiceCard s={s} /></StaggerItem>)}
        </Stagger>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y bg-secondary/50 py-20">
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">From request to receipt in four steps</h2>
            <p className="mt-3 text-muted-foreground">Click a step to preview it.</p>
          </Reveal>
          <HowItWorks />
        </div>
      </section>

      {/* ROLES */}
      <section className="container py-20">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Built for everyone involved</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">One platform, three tailored workspaces</h2>
        </Reveal>
        <RolesTabs />
      </section>

      {/* TECHNICIANS (live data) */}
      {techs.length > 0 && (
        <section className="border-t bg-secondary/50 py-20">
          <div className="container">
            <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Our people</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Meet verified technicians</h2></div>
              <Button asChild variant="outline"><Link href="/technicians">Browse all <ArrowRight className="h-4 w-4" /></Link></Button>
            </Reveal>
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{techs.map((t) => <StaggerItem key={t.id} className="h-full"><TechnicianCard tech={t} /></StaggerItem>)}</Stagger>
          </div>
        </section>
      )}

      {/* PROMISES */}
      <section className="container py-20">
        <Stagger className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Zap, title: 'Never double-booked', body: 'Assignments are checked inside a locked database transaction, so two dispatchers can’t book the same slot.' },
            { icon: Bell, title: 'Always in the loop', body: 'Every status change sends a live notification and is recorded on the job’s timeline.' },
            { icon: ShieldCheck, title: 'Payments you can trust', body: 'Card and bKash payments are confirmed by signed gateway callbacks, never by the browser alone.' },
          ].map((p) => (
            <StaggerItem key={p.title}><div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold"><p.icon className="h-5 w-5" aria-hidden /></span><div><h3 className="font-semibold">{p.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p></div></div></StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-16 text-center text-white shadow-lift">
            {cta.isPhoto && <><Image src={cta.src} alt="" fill sizes="100vw" className="object-cover opacity-30" /><div className="absolute inset-0 bg-gradient-to-r from-[#0a1233]/90 to-[#11206b]/70" aria-hidden /></>}
            <div className="bg-grid absolute inset-0" aria-hidden /><div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
            <div className="relative"><h2 className="text-3xl font-extrabold sm:text-4xl">Ready when you are</h2><p className="mx-auto mt-3 max-w-lg text-white/70">Create a free account and submit your first request in minutes — or explore every role with one click.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild size="lg" variant="gold"><Link href="/register">Get started free</Link></Button><Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"><Link href="/login">Open demo</Link></Button></div></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
