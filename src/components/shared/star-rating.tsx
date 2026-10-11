import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ value, className, showValue = true }: { value: number; className?: string; showValue?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={cn('h-4 w-4', value >= n - 0.25 ? 'fill-gold text-gold' : value >= n - 0.75 ? 'fill-gold/50 text-gold' : 'text-muted-foreground/40')} aria-hidden />
        ))}
      </span>
      {showValue && <span className="text-sm font-semibold">{value.toFixed(1)}</span>}
    </span>
  );
}
