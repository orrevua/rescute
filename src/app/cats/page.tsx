'use client';

import { useEffect, useState } from 'react';
import { listCats, type CatFilters } from '@/lib/api/cats';
import type { Cat } from '@/lib/types';
import { CatCard } from '@/components/cats/CatCard';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchBar } from '@/components/ui/SearchBar';

export default function CatsPage() {
  const [filters, setFilters] = useState<CatFilters>({});
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        setCats((await listCats(filters)).items);
        setError('');
      } catch {
        setError('Unable to load cats right now. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div>
      <section className="bg-teal-950 px-6 py-16 text-stone-50">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold tracking-[0.2em] text-amber-300">
            FIND YOUR COMPANION
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
            Every cat has their own way. One is waiting for yours.
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="cartoon-section mb-8 bg-[#f0fdf8] p-6">
          <p className="mb-4 text-sm font-extrabold tracking-[0.15em] text-teal-800">FILTERS</p>
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <SearchBar
              value={filters.name ?? ''}
              onChange={(name) => setFilters({ ...filters, name: name || undefined })}
            />
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        </div>

        {error && <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}

        {loading ? (
          <p className="text-stone-600">Looking for whiskers and purrs...</p>
        ) : (
          <div className="cat-card-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}

        {!loading && !error && cats.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-stone-600">
            No cats match these filters. Try broadening your search.
          </p>
        )}
      </div>
    </div>
  );
}
