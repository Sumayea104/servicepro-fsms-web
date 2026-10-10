import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarCheck, ClipboardCheck, CreditCard, ShieldCheck, Star, UserCheck, Zap, Wrench, Snowflake, Droplets, Hammer, PaintRoller, Sparkles, Plug, WashingMachine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Book vetted electricians, plumbers, AC and appliance technicians. Dispatch-managed scheduling and secure online payment.',
  openGraph: { title: 'ServicePro — Book a verified technician', description: 'Dispatch-managed field service with transparent payments.' },
};

const STEPS = [
  { icon: ClipboardCheck, title: 'Submit a request', body: 'Describe the problem, add your address and priority. Takes about two minutes.' },
  { icon: UserCheck, title: 'We match a technician', body: 'A dispatcher reviews your request and assigns a verified technician with the right skills.' },
  { icon: CalendarCheck, title: 'Visit is scheduled', body: 'You get a confirmed time slot — technicians can never be double-booked.' },
  { icon: CreditCard, title: 'Pay when it’s done', body: 'Review the service report, then pay securely by card or bKash.' },
];

const SERVICES = [
  { icon: Plug, name: 'Electrical' }, { icon: Droplets, name: 'Plumbing' }, { icon: Snowflake, name: 'AC repair' }, { icon: WashingMachine, name: 'Appliances' },
  { icon: Hammer, name: 'Carpentry' }, { icon: PaintRoller, name: 'Painting' }, { icon: Sparkles, name: 'Cleaning' }, { icon: Wrench, name: 'Other repairs' },
];

const TRUST = [
  { icon: ShieldCheck, title: 'Verified technicians', body: 'Every technician is reviewed and approved by an admin before they can receive jobs.' },
  { icon: Zap, title: 'Conflict-free scheduling', body: 'Assignments are checked against the technician’s calendar so visits never overlap.' },
  { icon: Star, title: 'Rated by customers', body: 'Rate punctuality, professionalism and quality after every completed job.' },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden /> Dispatch-managed field service
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Repairs handled end to end — from request to receipt.</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Tell us what’s broken. We review it, assign a verified technician, schedule the visit and keep you updated until the work is done and paid for.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/register">Request a service</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/login">Try the demo</Link></Button>
            </div>
          </div>
          <Card className="shadow-lg">
            <CardContent className="space-y-4 p-6">
              <p className="text-sm font-semibold text-muted-foreground">What a request looks like</p>
              {[
                ['Pending', 'Submitted by customer'],
                ['Assigned', 'Technician matched by dispatcher'],
                ['In progress', 'Technician on site'],
                ['Completed', 'Service report filed, ready to pay'],
              ].map(([s, d], i) => (
                <div key={s} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <div><p className="font-medium">{s}</p><p className="text-sm text-muted-foreground">{d}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <Card key={s.title}><CardContent className="p-6">
              <s.icon className="mb-4 h-8 w-8 text-primary" aria-hidden />
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Services we cover</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SERVICES.map((s) => (
              <Link key={s.name} href="/services" className="flex flex-col items-center gap-3 rounded-xl border bg-background p-6 transition-shadow hover:shadow-md">
                <s.icon className="h-8 w-8 text-primary" aria-hidden /><span className="text-sm font-medium">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-4">
              <t.icon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
              <div><h3 className="font-semibold">{t.title}</h3><p className="mt-1 text-sm text-muted-foreground">{t.body}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Ready when you are</h2>
          <p className="mx-auto mt-2 max-w-lg opacity-90">Create a free account and submit your first request in minutes.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6"><Link href="/register">Get started</Link></Button>
        </div>
      </section>
    </>
  );
}
