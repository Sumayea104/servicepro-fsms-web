import { Badge } from '@/components/ui/badge';
import { STATUS_STYLES } from '@/lib/constants';
import { cn, humanize } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return <Badge className={cn(STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground', className)}>{humanize(status)}</Badge>;
}
