'use client';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { FilterSelect } from '@/components/shared/filter-select';
import { SearchInput } from '@/components/shared/search-input';
import { useUrlState } from '@/hooks/use-url-state';
import { JOB_CATEGORIES, JOB_STATUSES, PRIORITIES } from '@/lib/constants';
import { X } from 'lucide-react';

/** All filter, sort and search state lives in the URL (?status=…&sort=…&q=…). */
export function JobFilters({ search = false }: { search?: boolean }) {
  const { get, set, searchParams } = useUrlState();
  const hasFilters = ['status', 'category', 'priority', 'q', 'sort'].some((k) => searchParams.has(k));

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {search && <SearchInput placeholder="Search title, description, address" />}
      <FilterSelect param="status" label="Statuses" options={JOB_STATUSES} />
      <FilterSelect param="category" label="Categories" options={JOB_CATEGORIES} />
      <FilterSelect param="priority" label="Priorities" options={PRIORITIES} />
      <Select value={get('sort')} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort jobs" className="sm:w-44">
        <option value="">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="scheduled">Scheduled soonest</option>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => set({ status: null, category: null, priority: null, q: null, sort: null })}>
          <X className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}
