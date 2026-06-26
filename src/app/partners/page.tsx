'use client';

import { useEffect, useState } from 'react';
import { PartnerCard } from '@/components/partners/PartnerCard';
import { getPartners } from '@/lib/api/partners';
import type { Partner } from '@/lib/types';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    void getPartners()
      .then(setPartners)
      .catch(() => setPartners([]));
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

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
          {partners.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-stone-600">
              No partners registered yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
