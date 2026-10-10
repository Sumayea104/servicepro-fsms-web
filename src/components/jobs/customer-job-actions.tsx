'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { AttachmentUploader } from './attachment-uploader';
import { PromptDialog } from './prompt-dialog';
import { useJobAction } from '@/hooks/use-job-action';
import { reviewSchema, type ReviewInput } from '@/lib/validators';
import { cn } from '@/lib/utils';
import type { JobDetail } from '@/types/api';

const CANCELLABLE = ['PENDING', 'ASSIGNED', 'ACCEPTED'];

function RatingInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange(n)} className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Star className={cn('h-6 w-6', n <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ jobId }: { jobId: string }) {
  const { handleSubmit, register, setValue, watch } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5, punctuality: 5, professionalism: 5, quality: 5 } });
  const submit = useJobAction<ReviewInput>({ path: `/jobs/${jobId}/review-feedback`, success: 'Thanks for your feedback!' });
  const v = watch();
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Rate your technician</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((d) => submit.mutate({ ...d, comment: d.comment || undefined }))} className="space-y-3">
          <RatingInput label="Overall" value={v.rating} onChange={(n) => setValue('rating', n)} />
          <RatingInput label="Punctuality" value={v.punctuality} onChange={(n) => setValue('punctuality', n)} />
          <RatingInput label="Professionalism" value={v.professionalism} onChange={(n) => setValue('professionalism', n)} />
          <RatingInput label="Quality of work" value={v.quality} onChange={(n) => setValue('quality', n)} />
          <FormField id="comment" label="Comment (optional)"><Textarea id="comment" {...register('comment')} /></FormField>
          <Button type="submit" className="w-full" loading={submit.isPending}>Submit review</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function CustomerJobActions({ job }: { job: JobDetail }) {
  const cancel = useJobAction<{ cancellationReason?: string }>({ path: `/jobs/${job.id}/cancel`, success: 'Request cancelled' });
  const payable = job.status === 'COMPLETED' && job.payment?.status !== 'PAID';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {payable && <Button asChild><Link href={`/dashboard/jobs/${job.id}/pay`}><CreditCard className="h-4 w-4" /> Pay now</Link></Button>}
        {CANCELLABLE.includes(job.status) && (
          <PromptDialog
            trigger="Cancel request" triggerVariant="outline" title="Cancel this request?" description="This can’t be undone." label="Reason (optional)"
            confirmLabel="Cancel request" confirmVariant="destructive" pending={cancel.isPending}
            onConfirm={(reason) => cancel.mutate({ cancellationReason: reason || undefined })}
          />
        )}
      </div>
      {job.status === 'COMPLETED' && !job.review && <ReviewForm jobId={job.id} />}
      {!['COMPLETED', 'CANCELLED'].includes(job.status) && (
        <Card><CardHeader><CardTitle className="text-lg">Add photos or documents</CardTitle></CardHeader><CardContent><AttachmentUploader jobId={job.id} purpose="customer-upload" /></CardContent></Card>
      )}
    </div>
  );
}
