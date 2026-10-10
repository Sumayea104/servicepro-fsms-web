import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { ProfileForm } from '@/components/profile/profile-form';
import { serverApi } from '@/lib/server-api';
import type { User } from '@/types/api';

export const metadata: Metadata = { title: 'Profile' };

export default async function CustomerProfile() {
  const user = await serverApi<User>('/users/me');
  return (<><PageHeader title="Profile & settings" description="Keep your contact details up to date so technicians can reach you." /><div className="max-w-2xl"><ProfileForm user={user} /></div></>);
}
