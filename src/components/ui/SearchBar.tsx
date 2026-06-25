'use client';

import type { ChangeEvent } from 'react';

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="block">
    <span className="sr-only">Search by name</span>
    <input className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-200" placeholder="Search by name" value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} />
  </label>;
}
