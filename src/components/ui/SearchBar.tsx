'use client';

import type { ChangeEvent } from 'react';

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="sr-only">Search by name</span>
      <input
        className="cartoon-input w-full bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 placeholder:text-stone-400"
        placeholder="🔍 Search by name..."
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </label>
  );
}
