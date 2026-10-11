import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';

export function EmptyState({ title, description, action }: { title: string; description?: string; icon?: LucideIcon; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-14 text-center">
      <Image src="/images/empty.svg" alt="" width={220} height={158} className="mb-4 h-auto w-44 opacity-90" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
