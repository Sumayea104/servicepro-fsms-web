import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, MapPin } from 'lucide-react';
import { StarRating } from '@/components/shared/star-rating';
import { humanize } from '@/lib/utils';
import type { TechnicianProfile } from '@/types/api';

export function TechnicianAvatar({ name, url, size = 56 }: { name: string; url?: string | null; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return url ? (
    <Image src={url} alt={name} width={size} height={size} className="rounded-2xl object-cover" style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden className="flex items-center justify-center rounded-2xl bg-brand-gradient font-bold text-gold" style={{ width: size, height: size, fontSize: size * 0.36 }}>{initials}</span>
  );
}

export function TechnicianCard({ tech }: { tech: TechnicianProfile }) {
  const name = tech.user?.fullName ?? 'Technician';
  return (
    <Link href={`/technicians/${tech.id}`} className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start gap-4">
        <TechnicianAvatar name={name} url={tech.user?.avatarUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold group-hover:text-primary">{name}</h3>
            {tech.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-success" aria-label="Verified" />}
          </div>
          <StarRating value={tech.rating} className="mt-1" />
          <p className="mt-0.5 text-xs text-muted-foreground">{tech.totalJobs} completed {tech.totalJobs === 1 ? 'job' : 'jobs'}</p>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${tech.isAvailable ? 'bg-success' : 'bg-muted-foreground/40'}`} title={tech.isAvailable ? 'Available' : 'Unavailable'} />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tech.skills.slice(0, 4).map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{humanize(s)}</span>)}
        {tech.skills.length === 0 && <span className="text-xs text-muted-foreground">Skills not added yet</span>}
        {tech.skills.length > 4 && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">+{tech.skills.length - 4}</span>}
      </div>
      {tech.serviceAreas.length > 0 && (
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden /> {tech.serviceAreas.slice(0, 3).join(', ')}</p>
      )}
    </Link>
  );
}
