'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useUrlState } from '@/hooks/use-url-state';

/** Debounced search box that writes ?q= to the URL. */
export function SearchInput({ placeholder = 'Search…', param = 'q' }: { placeholder?: string; param?: string }) {
  const { get, set } = useUrlState();
  const [value, setValue] = useState(get(param));
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if (debounced !== get(param)) set({ [param]: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="pl-9" aria-label={placeholder} />
    </div>
  );
}
