import { Check, XCircle } from 'lucide-react';
import { cn, humanize } from '@/lib/utils';
import type { JobStatus } from '@/types/api';

const STEPS: JobStatus[] = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
const LABELS: Record<string, string> = { PENDING: 'Requested', ASSIGNED: 'Assigned', ACCEPTED: 'Accepted', IN_PROGRESS: 'In progress', COMPLETED: 'Completed' };

/** Visual progress for a job's lifecycle. Cancelled jobs show a banner instead of a misleading partial bar. */
export function JobStepper({ status, compact = false }: { status: JobStatus; compact?: boolean }) {
  if (status === 'CANCELLED') {
    return <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" role="status"><XCircle className="h-4 w-4" aria-hidden /> This job was cancelled</div>;
  }
  const current = STEPS.indexOf(status);
  return (
    <ol className="flex items-center" aria-label={`Progress: ${humanize(status)}`}>
      {STEPS.map((step, i) => {
        const done = i < current || status === 'COMPLETED';
        const active = i === current && status !== 'COMPLETED';
        return (
          <li key={step} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')} aria-current={active ? 'step' : undefined}>
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn('flex items-center justify-center rounded-full border-2 text-xs font-bold transition-colors', compact ? 'h-6 w-6' : 'h-8 w-8',
                done ? 'border-success bg-success text-white' : active ? 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/15' : 'border-border bg-card text-muted-foreground')}>
                {done ? <Check className={compact ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden /> : i + 1}
              </span>
              {!compact && <span className={cn('hidden text-[11px] font-medium sm:block', active ? 'text-foreground' : 'text-muted-foreground')}>{LABELS[step]}</span>}
            </div>
            {i < STEPS.length - 1 && <span className={cn('mx-1.5 h-0.5 flex-1 rounded-full sm:mx-2', compact ? '' : '-mt-5 sm:-mt-5', i < current || status === 'COMPLETED' ? 'bg-success' : 'bg-border')} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
