import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, CalendarCheck, ClipboardCheck, CreditCard, ShieldCheck, UserCheck, Zap, Bell, BarChart3, Wrench, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TechnicianCard } from '@/components/technicians/technician-card';
import { publicApi } from '@/lib/public-api';
import { humanize } from '@/lib/utils';
import type { Paginated, TechnicianProfile } from '@/types/api';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Book vetted electricians, plumbers, AC and appliance technicians. Dispatch-managed scheduling and secure online payment.',
  openGraph: { title: 'ServicePro — Book a verified technician', description: 'Dispatch-managed field service with transparent payments.' },
};

const SERVICES = [
  { slug: 'electrical', key: 'ELECTRICAL', blurb: 'Wiring, switchboards, lighting' },
  { slug: 'plumbing', key: 'PLUMBING', blurb: 'Leaks, drains, taps, pumps' },
  { slug: 'ac-repair', key: 'AC_REPAIR', blurb: 'Servicing, gas refill, install' },
  { slug: 'appliance-repair', key: 'APPLIANCE_REPAIR', blurb: 'Fridge, washer, oven' },
  { slug: 'carpentry', key: 'CARPENTRY', blurb: 'Furniture, doors, fittings' },
  { slug: 'painting', key: 'PAINTING', blurb: 'Interior, exterior, touch-ups' },
  { slug: 'cleaning', key: 'CLEANING', blurb: 'Deep and post-renovation' },
  { slug: 'other', key: 'OTHER', blurb: 'Describe it — we’ll match it' },
];

const STEPS = [
  { icon: ClipboardCheck, title: 'Submit a request', body: 'Describe the problem, add your address and priority in a quick 3-step form.' },
  { icon: UserCheck, title: 'We match a technician', body: 'A dispatcher reviews it and picks a verified technician by skill, distance, workload and rating.' },
  { icon: CalendarCheck, title: 'Visit is scheduled', body: 'You get a confirmed slot. Technicians can never be double-booked.' },
  { icon: CreditCard, title: 'Pay when it’s done', body: 'Review the service report, then pay by card or bKash and rate the work.' },
];

const ROLES = [
  { icon: ClipboardList, title: 'For customers', points: ['Track every request on a live timeline', 'Upload photos of the problem', 'Pay online and download receipts', 'Rate technicians after the job'], cta: 'Request a service', href: '/register' },
  { icon: Wrench, title: 'For technicians', points: ['See only the jobs assigned to you', 'File service reports with parts and hours', 'Set your skills and weekly schedule', 'Follow your earnings by month'], cta: 'Join as a technician', href: '/register' },
  { icon: BarChart3, title: 'For admins', points: ['Review and dispatch from ranked suggestions', 'Verify technicians before they get work', 'Live analytics and revenue charts', 'Full audit trail of every change'], cta: 'Try the admin demo', href: '/login' },
];

async function featuredTechnicians(): Promise<TechnicianProfile[]> {
  try {
    const data = await publicApi<Paginated<TechnicianProfile>>('/technicians', { verified: 'true', limit: 4 });
    return data.items;
  } catch {
    return []; // landing page must never fail because the API is slow or down
  }
}

export default async function HomePage() {
  const techs = await featuredTechnicians();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" aria-hidden />
        <div className="container relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> Verified technicians · Conflict-free scheduling
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">Home repairs, handled <span className="text-gradient">end to end.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">Tell us what’s broken. We review it, assign a verified technician, schedule the visit and keep you updated until the work is done and paid for.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold"><Link href="/register">Request a service <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"><Link href="/login">Try the live demo</Link></Button>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
              {['8 service categories', 'Stripe & bKash payments', 'Live notifications'].map((t) => (
                <li key={t} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-gold" aria-hidden /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up delay-2">
            <Image src="/images/hero.svg" alt="ServicePro dashboard showing an assigned repair job, technician, calendar slot and payment" width={640} height={470} priority className="mx-auto h-auto w-full max-w-[600px] animate-float" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Services</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Every repair, one request</h2>
          <p className="mt-3 text-muted-foreground">Pick a category and we’ll match you with a technician who has exactly that skill.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/technicians?skill=${s.key}`} className="group overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="overflow-hidden"><Image src={`/images/service-${s.slug}.svg`} alt={`${humanize(s.key)} service illustration`} width={480} height={320} className="h-auto w-full transition-transform duration-500 group-hover:scale-105" /></div>
              <div className="flex items-center justify-between p-4">
                <div><h3 className="font-semibold">{humanize(s.key)}</h3><p className="text-xs text-muted-foreground">{s.blurb}</p></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y bg-secondary/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">From request to receipt in four steps</h2>
          </div>
          <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border bg-card p-6 text-center shadow-soft">
                <span className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-gold shadow-lift"><s.icon className="h-6 w-6" aria-hidden /><span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-gold-foreground">{i + 1}</span></span>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ROLES */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Built for everyone involved</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">One platform, three tailored workspaces</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.title} className="flex flex-col rounded-2xl border bg-card p-7 shadow-soft transition-shadow hover:shadow-lift">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><r.icon className="h-6 w-6" aria-hidden /></span>
              <h3 className="text-xl font-bold">{r.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {r.points.map((p) => <li key={p} className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />{p}</li>)}
              </ul>
              <Button asChild variant="outline" className="mt-7 w-full"><Link href={r.href}>{r.cta}</Link></Button>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNICIANS (live data) */}
      {techs.length > 0 && (
        <section className="border-t bg-secondary/50 py-20">
          <div className="container">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Our people</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Meet verified technicians</h2></div>
              <Button asChild variant="outline"><Link href="/technicians">Browse all <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{techs.map((t) => <TechnicianCard key={t.id} tech={t} />)}</div>
          </div>
        </section>
      )}

      {/* PROMISES */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Zap, title: 'Never double-booked', body: 'Assignments are checked inside a locked database transaction, so two dispatchers can’t book the same slot.' },
            { icon: Bell, title: 'Always in the loop', body: 'Every status change sends a live notification and is recorded on the job’s timeline.' },
            { icon: ShieldCheck, title: 'Payments you can trust', body: 'Card and bKash payments are confirmed by signed gateway callbacks, never by the browser alone.' },
          ].map((p) => (
            <div key={p.title} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold"><p.icon className="h-5 w-5" aria-hidden /></span><div><h3 className="font-semibold">{p.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p></div></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-16 text-center text-white shadow-lift">
          <div className="bg-grid absolute inset-0" aria-hidden /><div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
          <div className="relative"><h2 className="text-3xl font-extrabold sm:text-4xl">Ready when you are</h2><p className="mx-auto mt-3 max-w-lg text-white/70">Create a free account and submit your first request in minutes — or explore every role with one click.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild size="lg" variant="gold"><Link href="/register">Get started free</Link></Button><Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"><Link href="/login">Open demo</Link></Button></div></div>
        </div>
      </section>
    </>
  );
}
