'use client';

import { useEffect, useState } from 'react';
import { getPartners } from '@/lib/api/partners';
import type { Partner } from '@/lib/types';

export function DonationMap({ cep }: { cep: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPartners()
      .then((all) => {
        if (cep) {
          const normalized = cep.replace(/\D/g, '');
          for (let digits = 5; digits >= 2; digits--) {
            const prefix = normalized.slice(0, digits);
            const matches = all.filter((p) => p.cep.replace(/\D/g, '').startsWith(prefix));
            if (matches.length > 0) {
              setPartners(matches);
              return;
            }
          }
          setPartners([]);
        } else {
          setPartners(all);
        }
      })
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, [cep]);

  if (loading) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-teal-700 bg-teal-50 p-6">
        <p className="text-sm text-teal-900">Looking for nearby drop-off points...</p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-teal-700 bg-teal-50 p-6">
        <p className="font-bold text-teal-950">Nearby drop-off points{cep ? ` near ${cep}` : ''}</p>
        <p className="mt-2 text-sm text-teal-900">
          No purrtner locations found{cep ? ' in your area' : ' yet'}. Check the{' '}
          <a href="/partners" className="font-semibold underline">purrtners page</a> for the full list.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      <p className="font-bold text-teal-950">
        Nearby drop-off points{cep ? ` near ${cep}` : ''} ({partners.length})
      </p>
      {partners.map((partner) => (
        <article key={partner.id} className="cartoon-card bg-white p-4">
          <p className="font-bold text-teal-950">{partner.name}</p>
          {partner.description && (
            <p className="mt-1 text-sm text-teal-800">{partner.description}</p>
          )}
          <p className="mt-2 text-sm text-teal-900">
            {partner.address} · {partner.city}/{partner.state}
          </p>
        </article>
      ))}
    </div>
  );
}
