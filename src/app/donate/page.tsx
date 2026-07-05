'use client';

import { useEffect, useState } from 'react';
import { CepSearch } from '@/components/donations/CepSearch';
import { DonationCard } from '@/components/donations/DonationCard';
import { DonationMap } from '@/components/donations/DonationMap';
import { getDonations } from '@/lib/api/donations';
import type { DonationPost } from '@/lib/types';

export default function DonatePage() {
  const [posts, setPosts] = useState<DonationPost[]>([]);
  const [cep, setCep] = useState('');

  useEffect(() => {
    void getDonations('financial')
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-bold tracking-[.2em] text-teal-700">JOIN THE NETWORK</p>
        <h1 className="mt-2 text-5xl font-bold text-stone-900">Every bit of help finds a purr.</h1>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-stone-900">Financial support</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <DonationCard donation={post} key={post.id} />
            ))}
            {posts.length === 0 && (
              <p className="cartoon-card bg-white p-6 text-stone-600">
                No active campaigns at the moment.
              </p>
            )}
          </div>
        </section>

        <section className="cartoon-section mt-14 bg-[#f0fdf8] p-7">
          <h2 className="text-2xl font-bold text-stone-900">Donate items</h2>
          <p className="mt-2 text-stone-600">
            Food, litter, and care supplies make an immediate difference.
          </p>
          <div className="mt-5 max-w-md">
            <CepSearch onSearch={setCep} />
            <DonationMap cep={cep} />
          </div>
        </section>
      </div>
    </div>
  );
}
