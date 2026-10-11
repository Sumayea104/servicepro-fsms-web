import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Award, BadgeCheck, Banknote, Briefcase, MapPin, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { StarRating } from '@/components/shared/star-rating';
import { TechnicianAvatar } from '@/components/technicians/technician-card';
import { ApiError } from '@/lib/api-client-shared';
import { publicApi } from '@/lib/public-api';
import { formatCurrency, formatDate, humanize } from '@/lib/utils';
import type { Paginated, TechnicianProfile, TechnicianReview } from '@/types/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const t = await publicApi<TechnicianProfile>(`/technicians/${id}`);
    const name = t.user?.fullName ?? 'Technician';
    return { title: name, description: `${name} — verified ServicePro technician.`, openGraph: { title: `${name} · ServicePro`, description: `${t.skills.map(humanize).join(', ')}` } };
  } catch {
    return { title: 'Technician' };
  }
}

export default async function TechnicianProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let tech: TechnicianProfile, reviews: Paginated<TechnicianReview>;
  try {
    [tech, reviews] = await Promise.all([publicApi<TechnicianProfile>(`/technicians/${id}`, undefined, 30), publicApi<Paginated<TechnicianReview>>(`/technicians/${id}/reviews`, { limit: 10 }, 30)]);
  } catch (e) {
    if (e instanceof ApiError && [400, 404].includes(e.status)) notFound();
    throw e;
  }
  const name = tech.user?.fullName ?? 'Technician';

  return (
    <div className="container py-10">
      <Link href="/technicians" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All technicians</Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-brand-gradient" />
            <CardContent className="-mt-10 pb-7">
              <div className="flex flex-wrap items-end gap-5">
                <div className="rounded-2xl ring-4 ring-card"><TechnicianAvatar name={name} url={tech.user?.avatarUrl} size={88} /></div>
                <div className="pb-1">
                  <div className="flex items-center gap-2"><h1 className="text-2xl font-extrabold">{name}</h1>{tech.isVerified && <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success"><BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified</span>}</div>
                  <StarRating value={tech.rating} className="mt-1" /> <span className="text-sm text-muted-foreground">· {reviews.total} {reviews.total === 1 ? 'review' : 'reviews'}</span>
                </div>
              </div>
              {tech.bio && <p className="mt-6 leading-relaxed text-muted-foreground">{tech.bio}</p>}
              <div className="mt-6 flex flex-wrap gap-2">{tech.skills.map((s) => <span key={s} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">{humanize(s)}</span>)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MessageSquareQuote className="h-5 w-5 text-gold" aria-hidden /> Customer reviews</CardTitle></CardHeader>
            <CardContent>
              {reviews.items.length === 0 ? <EmptyState title="No reviews yet" description="Reviews appear after customers rate completed jobs." /> : (
                <ul className="divide-y">
                  {reviews.items.map((r) => (
                    <li key={r.id} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3"><p className="font-semibold">{r.reviewer?.fullName ?? 'Customer'}</p><span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span></div>
                      <StarRating value={r.rating} className="mt-1" />
                      {r.comment && <p className="mt-2 text-sm text-muted-foreground">“{r.comment}”</p>}
                      <p className="mt-2 text-xs text-muted-foreground">Punctuality {r.punctuality}/5 · Professionalism {r.professionalism}/5 · Quality {r.quality}/5</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card><CardContent className="space-y-4 p-6 text-sm">
            <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-primary" aria-hidden /><span>{tech.totalJobs} completed jobs</span></div>
            {tech.experience != null && <div className="flex items-center gap-3"><Award className="h-4 w-4 text-primary" aria-hidden /><span>{tech.experience} years experience</span></div>}
            {tech.hourlyRate != null && <div className="flex items-center gap-3"><Banknote className="h-4 w-4 text-primary" aria-hidden /><span>{formatCurrency(tech.hourlyRate)} / hour</span></div>}
            {tech.serviceAreas.length > 0 && <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden /><span>{tech.serviceAreas.join(', ')}</span></div>}
            <div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${tech.isAvailable ? 'bg-success' : 'bg-muted-foreground/40'}`} /><span>{tech.isAvailable ? 'Accepting new jobs' : 'Currently unavailable'}</span></div>
          </CardContent></Card>
          <Card className="bg-brand-gradient text-white"><CardContent className="p-6">
            <h2 className="font-bold">Need this service?</h2>
            <p className="mt-1 text-sm text-white/70">Submit a request and a dispatcher will match the best available technician.</p>
            <Button asChild variant="gold" className="mt-5 w-full"><Link href="/dashboard/jobs/new">Request a service</Link></Button>
          </CardContent></Card>
        </aside>
      </div>
    </div>
  );
}
