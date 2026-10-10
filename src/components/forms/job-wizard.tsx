'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from './form-field';
import { api, ApiError } from '@/lib/api-client';
import { JOB_CATEGORIES, PRIORITIES } from '@/lib/constants';
import { jobSchema, type JobInput } from '@/lib/validators';
import { cn, formatCurrency, humanize } from '@/lib/utils';
import type { Job } from '@/types/api';

const STEPS = ['Basics', 'Details', 'Review'] as const;
const STEP_FIELDS: (keyof JobInput)[][] = [['title', 'category', 'priority'], ['description', 'address', 'estimatedCost'], []];

/** Three-step wizard. Each step validates only its own fields before letting the user continue. */
export function JobWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { register, trigger, getValues, setError, formState: { errors } } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    mode: 'onChange',
    defaultValues: { category: 'ELECTRICAL', priority: 'MEDIUM' },
  });

  const create = useMutation({
    mutationFn: (v: JobInput) =>
      api<Job>('/jobs', {
        method: 'POST',
        body: { title: v.title, description: v.description, category: v.category, priority: v.priority, address: v.address, ...(v.estimatedCost ? { estimatedCost: Number(v.estimatedCost) } : {}) },
      }),
    onSuccess: (job) => {
      toast.success('Request submitted — a dispatcher will review it shortly');
      router.push(`/dashboard/jobs/${job.id}`);
      router.refresh();
    },
    onError: (e) => {
      if (e instanceof ApiError) {
        e.errors.forEach((er) => er.field && setError(er.field as keyof JobInput, { message: er.message }));
        toast.error(e.message);
      } else toast.error('Could not submit your request');
    },
  });

  async function next() {
    if (await trigger(STEP_FIELDS[step])) setStep((s) => s + 1);
  }

  const v = getValues();

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>New service request</CardTitle>
        <CardDescription>Step {step + 1} of {STEPS.length}: {STEPS[step]}</CardDescription>
        <ol className="mt-4 flex items-center gap-2" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold', i < step && 'border-primary bg-primary text-primary-foreground', i === step && 'border-primary text-primary')} aria-current={i === step ? 'step' : undefined}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="hidden text-sm sm:inline">{label}</span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden />}
            </li>
          ))}
        </ol>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={cn('space-y-4', step !== 0 && 'hidden')}>
            <FormField id="title" label="What needs fixing?" error={errors.title?.message}><Input id="title" placeholder="e.g. Living room AC not cooling" aria-invalid={!!errors.title} {...register('title')} /></FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="category" label="Category" error={errors.category?.message}>
                <Select id="category" {...register('category')}>{JOB_CATEGORIES.map((c) => <option key={c} value={c}>{humanize(c)}</option>)}</Select>
              </FormField>
              <FormField id="priority" label="Priority" error={errors.priority?.message}>
                <Select id="priority" {...register('priority')}>{PRIORITIES.map((p) => <option key={p} value={p}>{humanize(p)}</option>)}</Select>
              </FormField>
            </div>
          </div>

          <div className={cn('space-y-4', step !== 1 && 'hidden')}>
            <FormField id="description" label="Describe the problem" error={errors.description?.message}><Textarea id="description" aria-invalid={!!errors.description} {...register('description')} /></FormField>
            <FormField id="address" label="Service address" error={errors.address?.message}><Input id="address" autoComplete="street-address" aria-invalid={!!errors.address} {...register('address')} /></FormField>
            <FormField id="estimatedCost" label="Budget in BDT (optional)" hint="Helps the technician quote accurately" error={errors.estimatedCost?.message}><Input id="estimatedCost" inputMode="decimal" aria-invalid={!!errors.estimatedCost} {...register('estimatedCost')} /></FormField>
          </div>

          {step === 2 && (
            <dl className="divide-y rounded-lg border text-sm">
              {[
                ['Title', v.title], ['Category', humanize(v.category)], ['Priority', humanize(v.priority)],
                ['Address', v.address], ['Budget', v.estimatedCost ? formatCurrency(v.estimatedCost) : 'Not specified'], ['Description', v.description],
              ].map(([k, val]) => (
                <div key={k} className="grid gap-1 p-3 sm:grid-cols-3"><dt className="text-muted-foreground">{k}</dt><dd className="sm:col-span-2">{val}</dd></div>
              ))}
            </dl>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button type="button" variant="outline" disabled={step === 0 || create.isPending} onClick={() => setStep((s) => s - 1)}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next}>Continue</Button>
          ) : (
            <Button type="button" loading={create.isPending} onClick={() => create.mutate(getValues())}>Submit request</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
