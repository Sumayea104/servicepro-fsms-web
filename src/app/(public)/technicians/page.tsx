import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { FilterSelect } from '@/components/shared/filter-select';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { TechnicianCard } from '@/components/technicians/technician-card';
import { AvailableToggle } from '@/components/technicians/available-toggle';
import { publicApi } from '@/lib/public-api';
import { JOB_CATEGORIES } from '@/lib/constants';
import { humanize } from '@/lib/utils';
import type { Paginated, TechnicianProfile } from '@/types/api';

export const metadata: Metadata = {
  title: 'Technicians',
  description: 'Browse verified ServicePro technicians by skill and availability.',
  openGraph: { title: 'Verified technicians — ServicePro', description: 'Find a verified electrician, plumber, AC or appliance technician.' },
};

export default async function TechniciansPage({ searchParams }: { searchParams: Promise<{ skill?: string; available?: string; page?: string }> }) {
  const sp = await searchParams;
  const data = await publicApi<Paginated<TechnicianProfile>>('/technicians', { verified: 'true', skill: sp.skill, available: sp.available, page: sp.page || 1, limit: 9 }, 30);
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient py-14 text-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
        <div className="container relative"><h1 className="text-3xl font-extrabold sm:text-4xl">Verified technicians</h1><p className="mt-2 max-w-xl text-white/70">Every technician here has been reviewed and approved by an admin. {sp.skill ? `Showing ${humanize(sp.skill)} specialists.` : 'Filter by skill to narrow the list.'}</p></div>
      </section>
      <div className="container py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <FilterSelect param="skill" label="Skills" options={JOB_CATEGORIES} />
          <AvailableToggle />
        </div>
        {data.items.length === 0 ? (
          <EmptyState icon={Users} title="No technicians match" description="Try a different skill or turn off the availability filter." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((t) => <TechnicianCard key={t.id} tech={t} />)}</div>
        )}
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} />
      </div>
    </>
  );
}
