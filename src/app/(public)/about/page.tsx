import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PageHero } from '@/components/layout/page-hero';
import { photo } from '@/lib/photos';
import { CalendarCheck, ClipboardList, ShieldCheck, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'ServicePro connects customers with verified field technicians through a dispatcher-managed workflow.',
  openGraph: { title: 'About ServicePro', description: 'How our dispatcher-managed field service platform works.' },
};

const PILLARS = [
  { icon: Users, title: 'Three roles, one workflow', body: 'Customers request work, administrators review and dispatch it, and technicians carry it out. Each role sees only what it needs.' },
  { icon: ShieldCheck, title: 'Verification first', body: 'Technicians register, then wait for admin approval before they appear in dispatch suggestions or receive assignments.' },
  { icon: CalendarCheck, title: 'No double bookings', body: 'Scheduling is validated on the server inside a locked transaction, so two dispatchers can’t assign the same slot at once.' },
  { icon: ClipboardList, title: 'A full paper trail', body: 'Every status change is logged — who did it and when — so any job’s history can be audited.' },
];

export default function AboutPage() {
  const team = photo('about', '');
  return (
    <>
      <PageHero eyebrow="About" title="Field service, run like a well-oiled workshop" description="Instead of leaving customers to haggle with strangers, a dispatcher reviews every request, picks the most suitable verified technician and schedules the visit — then payment and feedback close the loop." />
      <div className="container max-w-5xl py-16">
      {team.isPhoto && <div className="relative mb-10 aspect-[16/7] overflow-hidden rounded-3xl shadow-lift"><Image src={team.src} alt="The ServicePro field team" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" /></div>}
      <div className="grid gap-6 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <Card key={p.title}><CardContent className="p-6">
            <p.icon className="mb-3 h-7 w-7 text-primary" aria-hidden />
            <h2 className="font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
          </CardContent></Card>
        ))}
      </div>
      </div>
    </>
  );
}
