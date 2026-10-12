import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { photo, type PhotoSlot } from '@/lib/photos';
import { humanize } from '@/lib/utils';

export interface ServiceItem { slug: string; key: string; blurb: string }

/** Uses `public/photos/service-<slug>.jpg` when present, else the illustrated tile. */
export function ServiceCard({ s }: { s: ServiceItem }) {
  const img = photo(`service-${s.slug}` as PhotoSlot, `/images/service-${s.slug}.svg`);
  return (
    <Link href={`/technicians?skill=${s.key}`} className="group block overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image src={img.src} alt={`${humanize(s.key)} service`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        {img.isPhoto && <div className="absolute inset-0 bg-gradient-to-t from-[#0a1233]/70 via-transparent to-transparent" aria-hidden />}
      </div>
      <div className="flex items-center justify-between p-4">
        <div><h3 className="font-semibold">{humanize(s.key)}</h3><p className="text-xs text-muted-foreground">{s.blurb}</p></div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-gold group-hover:text-gold-foreground"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
      </div>
    </Link>
  );
}
