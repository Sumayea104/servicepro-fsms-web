'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { AttachmentUploader } from './attachment-uploader';
import { PromptDialog } from './prompt-dialog';
import { useJobAction } from '@/hooks/use-job-action';
import { serviceReportSchema, type ServiceReportInput } from '@/lib/validators';
import type { JobDetail, JobStatus } from '@/types/api';

type StatusBody = { status: JobStatus; cancellationReason?: string; finalCost?: number };

function ServiceReportForm({ job }: { job: JobDetail }) {
  const r = job.serviceReport;
  const { register, handleSubmit, formState: { errors } } = useForm<ServiceReportInput>({
    resolver: zodResolver(serviceReportSchema),
    defaultValues: { summary: r?.summary ?? '', findings: r?.findings ?? '', recommendations: r?.recommendations ?? '', laborHours: r?.laborHours?.toString() ?? '', partsUsed: r?.partsUsed.join(', ') ?? '' },
  });
  const save = useJobAction<Record<string, unknown>>({ path: `/jobs/${job.id}/service-report`, success: 'Service report saved' });

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Service report</CardTitle></CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit((d) =>
            save.mutate({
              summary: d.summary,
              findings: d.findings || undefined,
              recommendations: d.recommendations || undefined,
              laborHours: d.laborHours ? Number(d.laborHours) : undefined,
              partsUsed: d.partsUsed ? d.partsUsed.split(',').map((p) => p.trim()).filter(Boolean) : [],
            }),
          )}
        >
          <FormField id="summary" label="Work summary" error={errors.summary?.message}><Textarea id="summary" aria-invalid={!!errors.summary} {...register('summary')} /></FormField>
          <FormField id="findings" label="Findings (optional)"><Textarea id="findings" {...register('findings')} /></FormField>
          <FormField id="recommendations" label="Recommendations (optional)"><Textarea id="recommendations" {...register('recommendations')} /></FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="laborHours" label="Labour hours" error={errors.laborHours?.message}><Input id="laborHours" inputMode="decimal" {...register('laborHours')} /></FormField>
            <FormField id="partsUsed" label="Parts used" hint="Comma separated"><Input id="partsUsed" {...register('partsUsed')} /></FormField>
          </div>
          <Button type="submit" loading={save.isPending}>{r ? 'Update report' : 'Save report'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function TechnicianJobActions({ job }: { job: JobDetail }) {
  const status = useJobAction<StatusBody>({ path: `/jobs/${job.id}/status`, method: 'PATCH', success: 'Job updated' });
  const busy = status.isPending;
  const active = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(job.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {job.status === 'ASSIGNED' && <Button loading={busy} onClick={() => status.mutate({ status: 'ACCEPTED' })}>Accept job</Button>}
        {job.status === 'ACCEPTED' && <Button loading={busy} onClick={() => status.mutate({ status: 'IN_PROGRESS' })}>Start work</Button>}
        {job.status === 'IN_PROGRESS' && (
          <PromptDialog
            trigger="Mark completed" triggerVariant="default" title="Complete this job" description="Enter the final amount the customer will be asked to pay (BDT)."
            label="Final cost" type="number" required confirmLabel="Complete job" pending={busy}
            onConfirm={(v) => status.mutate({ status: 'COMPLETED', finalCost: Number(v) })}
          />
        )}
        {active && (
          <PromptDialog
            trigger="Cancel job" title="Cancel this job?" description="The customer will be notified." label="Reason" required confirmLabel="Cancel job" confirmVariant="destructive" pending={busy}
            onConfirm={(reason) => status.mutate({ status: 'CANCELLED', cancellationReason: reason })}
          />
        )}
      </div>
      {['IN_PROGRESS', 'COMPLETED'].includes(job.status) && <ServiceReportForm job={job} />}
      {['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(job.status) && (
        <Card><CardHeader><CardTitle className="text-lg">Work photos &amp; documents</CardTitle></CardHeader><CardContent><AttachmentUploader jobId={job.id} purpose="work-photo" /></CardContent></Card>
      )}
    </div>
  );
}
