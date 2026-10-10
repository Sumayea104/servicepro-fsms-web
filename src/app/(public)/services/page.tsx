import Link from 'next/link';
import type { Metadata } from 'next';
import { Droplets, Hammer, PaintRoller, Plug, Snowflake, Sparkles, Wrench, WashingMachine, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Electrical, plumbing, AC repair, appliance repair, carpentry, painting and cleaning — all through one request flow.',
  openGraph: { title: 'ServicePro services', description: 'Every home and office repair category in one place.' },
};

const SERVICES: { icon: LucideIcon; name: string; body: string }[] = [
  { icon: Plug, name: 'Electrical', body: 'Wiring faults, switchboards, lighting, fans and power issues.' },
  { icon: Droplets, name: 'Plumbing', body: 'Leaks, blocked drains, taps, pipes, geysers and water pumps.' },
  { icon: Snowflake, name: 'AC repair', body: 'Servicing, gas refills, cooling problems and installations.' },
  { icon: WashingMachine, name: 'Appliance repair', body: 'Refrigerators, washing machines, ovens and other household appliances.' },
  { icon: Hammer, name: 'Carpentry', body: 'Furniture repair, door and window fittings, custom woodwork.' },
  { icon: PaintRoller, name: 'Painting', body: 'Interior and exterior repainting, touch-ups and waterproof coatings.' },
  { icon: Sparkles, name: 'Cleaning', body: 'Deep cleaning for homes, offices and post-renovation sites.' },
  { icon: Wrench, name: 'Other repairs', body: 'Something not listed? Describe it and a dispatcher will find the right person.' },
];

export default function ServicesPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Services</h1>
        <p className="mt-3 text-lg text-muted-foreground">Pick a category when you submit a request — we’ll match you with a technician who has that skill.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <Card key={s.name}><CardContent className="p-6">
            <s.icon className="mb-4 h-8 w-8 text-primary" aria-hidden />
            <h2 className="font-semibold">{s.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </CardContent></Card>
        ))}
      </div>
      <div className="mt-12 text-center"><Button asChild size="lg"><Link href="/register">Request a service</Link></Button></div>
    </div>
  );
}
