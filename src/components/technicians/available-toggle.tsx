'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUrlState } from '@/hooks/use-url-state';

export function AvailableToggle() {
  const { get, set } = useUrlState();
  return (
    <div className="flex items-center gap-2.5 rounded-xl border bg-card px-3.5 py-2.5">
      <Switch id="available" checked={get('available') === 'true'} onCheckedChange={(v) => set({ available: v ? 'true' : null })} />
      <Label htmlFor="available" className="cursor-pointer">Available now</Label>
    </div>
  );
}
