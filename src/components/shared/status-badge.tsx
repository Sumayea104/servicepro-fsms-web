import { Badge } from '@/components/ui/badge';
import { STATUS_STYLES } from '@/lib/constants';
import { cn, humanize } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return <Badge className={cn('gap-1.5', STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground', className)}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />{humanize(status)}</Badge>;
}
