'use client';

import { Select } from '@/components/ui/input';
import { useUrlState } from '@/hooks/use-url-state';
import { humanize } from '@/lib/utils';

/** A <select> bound to a URL query param ("All" clears it). */
export function FilterSelect({ param, label, options }: { param: string; label: string; options: readonly string[] }) {
  const { get, set } = useUrlState();
  return (
    <Select value={get(param)} onChange={(e) => set({ [param]: e.target.value })} aria-label={label} className="sm:w-44">
      <option value="">{`All ${label.toLowerCase()}`}</option>
      {options.map((o) => (
        <option key={o} value={o}>{humanize(o)}</option>
      ))}
    </Select>
  );
}
