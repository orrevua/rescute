'use client';

import type { CatFilters } from '../../lib/api/cats';

const selectClass =
  'cartoon-input w-full bg-white px-3 py-2.5 text-sm font-semibold text-stone-800 appearance-none';
const inputClass =
  'cartoon-input w-full bg-white px-3 py-2.5 text-sm font-semibold text-stone-800 placeholder:text-stone-400';

export function FilterBar({
  filters,
  onChange,
}: {
  filters: CatFilters;
  onChange: (filters: CatFilters) => void;
}) {
  const update = (key: keyof CatFilters, value: string) =>
    onChange({ ...filters, [key]: value || undefined });

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select
        aria-label="Filter by sex"
        className={selectClass}
        value={filters.sex ?? ''}
        onChange={(e) => update('sex', e.target.value)}
      >
        <option value="">All sexes</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <select
        aria-label="Filter by age"
        className={selectClass}
        value={filters.age_max ?? ''}
        onChange={(e) => update('age_max', e.target.value)}
      >
        <option value="">All ages</option>
        <option value="12">Up to 1 year</option>
        <option value="60">Up to 5 years</option>
      </select>
      <input
        aria-label="Filter by city"
        className={inputClass}
        placeholder="City"
        value={filters.city ?? ''}
        onChange={(e) => update('city', e.target.value)}
      />
    </div>
  );
}
