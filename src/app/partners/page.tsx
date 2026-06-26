'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PartnerCard } from '@/components/partners/PartnerCard';
import { getPartners } from '@/lib/api/partners';
import type { Partner } from '@/lib/types';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getPartners()
      .then(setPartners)
      .catch(() => setPartners([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-bold tracking-[.2em] text-teal-700">
          FRIENDLY NETWORK
        </p>

        <h1 className="mt-2 text-5xl font-bold text-stone-900">
          Those who care together, transform more.
        </h1>

        <div className="mt-6">
          <Link
            className="cartoon-btn inline-block bg-amber-400 px-6 py-2.5 text-sm font-extrabold text-stone-950 hover:bg-amber-300"
            href="/partners/register"
          >
            Become a purrtner
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        {loaded && partners.length === 0 && (
          <div className="cartoon-section mt-8 bg-[#f0fdf8] p-10 text-center">
            <p className="inline-block -rotate-45 text-4xl">🐾</p>
            <p className="mt-3 text-xl font-extrabold text-teal-900">No purrtners yet</p>
            <p className="mt-2 text-stone-600">
              Be the first to join our network and support cat rescue!
            </p>
            <Link
              className="cartoon-btn mt-5 inline-block bg-teal-800 px-6 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700"
              href="/partners/register"
            >
              Register your business
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
