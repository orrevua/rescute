'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdoptionModal } from '@/components/cats/AdoptionModal';
import { CatGallery } from '@/components/cats/CatGallery';
import { CatHealthBadges } from '@/components/cats/CatHealthBadges';
import { CatTraits } from '@/components/cats/CatTraits';
import { getCat } from '@/lib/api/cats';
import type { Cat } from '@/lib/types';

export default function CatProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [cat, setCat] = useState<Cat | null>(null);
  const [error, setError] = useState('');
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    void params.then(({ id }) =>
      getCat(id)
        .then(setCat)
        .catch(() => setError('We could not find this cat.')),
    );
  }, [params]);

  if (error)
    return (
      <div className="mx-auto max-w-3xl p-8">
        <p>{error}</p>
        <Link className="text-teal-800 underline" href="/cats">
          Back to cats
        </Link>
      </div>
    );
  if (!cat)
    return (
      <div className="mx-auto max-w-3xl p-8 text-stone-600">Getting to know your new friend...</div>
    );

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link className="text-sm font-semibold text-teal-800 hover:underline" href="/cats">
          ← All cats
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <CatGallery photos={cat.photos} name={cat.name} />
          <article className="space-y-7">
            <header>
              <p className="text-sm font-bold tracking-[0.18em] text-teal-700">
                {cat.city}, {cat.state}
              </p>
              <h1 className="mt-2 text-5xl font-bold tracking-tight text-stone-900">{cat.name}</h1>
              <p className="mt-3 text-lg text-stone-600">
                {cat.personality || 'A cat with lots of love to share.'}
              </p>
            </header>
            <CatHealthBadges cat={cat} />
            <CatTraits cat={cat} />
            <section>
              <h2 className="text-xl font-bold text-stone-900">{cat.name}&apos;s story</h2>
              <p className="mt-2 leading-7 text-stone-700">
                {cat.backstory ||
                  'This story is still being written, preferably in a safe and loving home.'}
              </p>
            </section>
            <button
              className="w-full rounded-2xl bg-amber-400 px-5 py-4 font-bold text-stone-950 transition hover:bg-amber-300"
              onClick={() => setAdopting(true)}
            >
              I want to adopt {cat.name}
            </button>
          </article>
        </div>
      </div>
      {adopting && (
        <AdoptionModal catId={cat.id} catName={cat.name} onClose={() => setAdopting(false)} />
      )}
    </div>
  );
}
