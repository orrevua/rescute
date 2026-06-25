'use client';

import type { CatFilters } from '../../lib/api/cats';

export function FilterBar({ filters, onChange }: { filters: CatFilters; onChange: (filters: CatFilters) => void }) {
  const update = (key: keyof CatFilters, value: string) => onChange({ ...filters, [key]: value || undefined });
  return <div className="grid gap-3 sm:grid-cols-3">
    <select aria-label="Filter by sex" className="rounded-xl border border-stone-300 bg-white px-3 py-2" value={filters.sex ?? ''} onChange={(event) => update('sex', event.target.value)}><option value="">All sexes</option><option value="female">Female</option><option value="male">Male</option></select>
    <select aria-label="Filter by age" className="rounded-xl border border-stone-300 bg-white px-3 py-2" value={filters.age_max ?? ''} onChange={(event) => update('age_max', event.target.value)}><option value="">All ages</option><option value="12">Up to 1 year</option><option value="60">Up to 5 years</option></select>
    <input aria-label="Filter by city" className="rounded-xl border border-stone-300 bg-white px-3 py-2" placeholder="City" value={filters.city ?? ''} onChange={(event) => update('city', event.target.value)} />
  </div>;
}
