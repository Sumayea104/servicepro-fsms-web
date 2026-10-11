import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/layout/page-hero';
import { humanize } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Electrical, plumbing, AC repair, appliance repair, carpentry, painting and cleaning — all through one request flow.',
  openGraph: { title: 'ServicePro services', description: 'Every home and office repair category in one place.' },
};

const SERVICES = [
  { slug: 'electrical', key: 'ELECTRICAL', body: 'Wiring faults, switchboards, lighting, fans and power issues.' },
  { slug: 'plumbing', key: 'PLUMBING', body: 'Leaks, blocked drains, taps, pipes, geysers and water pumps.' },
  { slug: 'ac-repair', key: 'AC_REPAIR', body: 'Servicing, gas refills, cooling problems and installations.' },
  { slug: 'appliance-repair', key: 'APPLIANCE_REPAIR', body: 'Refrigerators, washing machines, ovens and household appliances.' },
  { slug: 'carpentry', key: 'CARPENTRY', body: 'Furniture repair, door and window fittings, custom woodwork.' },
  { slug: 'painting', key: 'PAINTING', body: 'Interior and exterior repainting, touch-ups and waterproof coatings.' },
  { slug: 'cleaning', key: 'CLEANING', body: 'Deep cleaning for homes, offices and post-renovation sites.' },
  { slug: 'other', key: 'OTHER', body: 'Something not listed? Describe it and a dispatcher will find the right person.' },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Every repair, matched to the right technician" description="Pick a category when you submit a request — dispatchers only assign verified technicians who have that skill.">
        <Button asChild size="lg" variant="gold"><Link href="/register">Request a service <ArrowRight className="h-4 w-4" /></Link></Button>
      </PageHero>
      <div className="container grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <article key={s.slug} className="group overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <div className="overflow-hidden"><Image src={`/images/service-${s.slug}.svg`} alt={`${humanize(s.key)} illustration`} width={480} height={320} className="h-auto w-full transition-transform duration-500 group-hover:scale-105" /></div>
            <div className="p-5">
              <h2 className="font-bold">{humanize(s.key)}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <Link href={`/technicians?skill=${s.key}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">See technicians <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
