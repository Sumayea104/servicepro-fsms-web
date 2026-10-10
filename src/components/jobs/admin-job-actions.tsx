'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FormField } from '@/components/forms/form-field';
import { PromptDialog } from './prompt-dialog';
import { api } from '@/lib/api-client';
import { useJobAction } from '@/hooks/use-job-action';
import { assignSchema, type AssignInput } from '@/lib/validators';
import { cn } from '@/lib/utils';
import type { JobDetail, TechnicianSuggestion } from '@/types/api';

function AssignDialog({ job, reschedule }: { job: JobDetail; reschedule?: boolean }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AssignInput>({
    resolver: zodResolver(assignSchema),
    defaultValues: { technicianId: reschedule ? job.technicianId ?? '' : '', scheduledAt: '' },
  });
  const technicianId = watch('technicianId');

  // Ranked by the API's scoring (distance, workload, rating) — advisory; the admin makes the call.
  const suggestions = useQuery({
    queryKey: ['suggest', job.id],
    queryFn: () => api<TechnicianSuggestion[]>('/technicians/suggest', { query: { jobId: job.id } }),
    enabled: open && !reschedule,
  });

  const assign = useJobAction<{ technicianId: string; scheduledAt: string }>({ path: `/jobs/${job.id}/assign`, success: 'Technician assigned', onDone: () => setOpen(false) });
  const move = useJobAction<{ scheduledAt: string }>({ path: `/jobs/${job.id}/reschedule`, method: 'PATCH', success: 'Visit rescheduled', onDone: () => setOpen(false) });

  function submit(d: AssignInput) {
    const scheduledAt = new Date(d.scheduledAt).toISOString();
    if (reschedule) move.mutate({ scheduledAt });
    else assign.mutate({ technicianId: d.technicianId, scheduledAt });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant={reschedule ? 'outline' : 'default'}>{reschedule ? 'Reschedule visit' : 'Assign technician'}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reschedule ? 'Reschedule visit' : 'Assign a technician'}</DialogTitle>
          <DialogDescription>Overlapping visits for the same technician are rejected automatically.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          {!reschedule && (
            <FormField id="technicianId" label="Suggested technicians" error={errors.technicianId?.message}>
              <div className="space-y-2" role="radiogroup" aria-label="Suggested technicians">
                {suggestions.isLoading && <><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /></>}
                {suggestions.isError && <p className="text-sm text-destructive">Couldn’t load suggestions.</p>}
                {suggestions.data?.length === 0 && <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No available, verified technician has the “{job.category}” skill. Verify technicians or update their skills first.</p>}
                {suggestions.data?.map((t) => (
                  <button key={t.technicianId} type="button" role="radio" aria-checked={technicianId === t.technicianId} onClick={() => setValue('technicianId', t.technicianId, { shouldValidate: true })}
                    className={cn('flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors', technicianId === t.technicianId ? 'border-primary bg-primary/5' : 'hover:bg-accent')}>
                    <span><span className="block font-medium">{t.name}</span><span className="text-xs text-muted-foreground">{t.distanceKm} km · {t.currentOpenJobs} open jobs</span></span>
                    <span className="flex items-center gap-1 text-xs"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />{t.rating.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </FormField>
          )}
          <FormField id="scheduledAt" label="Visit date & time" error={errors.scheduledAt?.message}><Input id="scheduledAt" type="datetime-local" aria-invalid={!!errors.scheduledAt} {...register('scheduledAt')} /></FormField>
          <input type="hidden" {...register('technicianId')} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Back</Button>
            <Button type="submit" loading={assign.isPending || move.isPending}>{reschedule ? 'Reschedule' : 'Assign'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminJobActions({ job }: { job: JobDetail }) {
  const review = useJobAction<{ decision: 'APPROVE' | 'REJECT'; cancellationReason?: string }>({ path: `/jobs/${job.id}/review`, method: 'PATCH', success: 'Review recorded' });
  const cancel = useJobAction<{ cancellationReason?: string }>({ path: `/jobs/${job.id}/cancel`, success: 'Job cancelled' });

  return (
    <div className="flex flex-wrap gap-3">
      {job.status === 'PENDING' && (
        <>
          <AssignDialog job={job} />
          <Button variant="outline" loading={review.isPending} onClick={() => review.mutate({ decision: 'APPROVE' })}>Mark as reviewed</Button>
          <PromptDialog trigger="Reject request" title="Reject this request?" description="The customer will be notified." label="Reason" required confirmLabel="Reject" confirmVariant="destructive" pending={review.isPending}
            onConfirm={(reason) => review.mutate({ decision: 'REJECT', cancellationReason: reason })} />
        </>
      )}
      {['ASSIGNED', 'ACCEPTED'].includes(job.status) && <AssignDialog job={job} reschedule />}
      {['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(job.status) && (
        <PromptDialog trigger="Cancel job" title="Cancel this job?" label="Reason (optional)" confirmLabel="Cancel job" confirmVariant="destructive" pending={cancel.isPending}
          onConfirm={(reason) => cancel.mutate({ cancellationReason: reason || undefined })} />
      )}
    </div>
  );
}
