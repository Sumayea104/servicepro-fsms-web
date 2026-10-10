import type { Metadata } from 'next';
import { JobWizard } from '@/components/forms/job-wizard';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'New request' };

export default function NewJobPage() {
  return (
    <>
      <PageHeader title="Request a service" description="Tell us what’s wrong and where — a dispatcher will take it from there." />
      <JobWizard />
    </>
  );
}
