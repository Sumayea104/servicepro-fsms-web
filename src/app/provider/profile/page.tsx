import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { ProfileForm } from '@/components/profile/profile-form';
import { TechnicianSettings } from '@/components/profile/technician-settings';
import { serverApi } from '@/lib/server-api';
import type { MeResponse } from '@/types/api';

export const metadata: Metadata = { title: 'Profile & availability' };

export default async function ProviderProfile() {
  const me = await serverApi<MeResponse>('/users/me');
  return (
    <>
      <PageHeader title="Profile & availability" description="Your details, skills and working hours." />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <ProfileForm user={me} />
        {me.technician ? <TechnicianSettings profile={me.technician} /> : <p className="text-sm text-muted-foreground">No technician profile found for this account.</p>}
      </div>
    </>
  );
}
