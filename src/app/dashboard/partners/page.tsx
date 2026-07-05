'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Badge } from '@/components/ui/Badge';
import { actOnNegotiation, getNegotiations } from '@/lib/api/partners';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { PartnerNegotiation } from '@/lib/types';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900',
  accepted: 'bg-teal-100 text-teal-900',
  rejected: 'bg-rose-100 text-rose-900',
  countered: 'bg-sky-100 text-sky-900',
};

export default function PartnerNegotiationsPage() {
  const [negotiations, setNegotiations] = useState<PartnerNegotiation[]>([]);

  function refresh() {
    void getNegotiations()
      .then(setNegotiations)
      .catch(() => {});
  }

  useEffect(refresh, []);

  async function act(id: string, action: 'accept' | 'reject' | 'counter') {
    let counter_amount: number | undefined;
    let counter_message: string | undefined;
    if (action === 'counter') {
      const amount = window.prompt('Counter amount ($)');
      if (!amount) return;
      counter_amount = Number(amount);
      counter_message = window.prompt('Counter message (optional)') || undefined;
    }
    await actOnNegotiation(id, { action, counter_amount, counter_message });
    refresh();
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-stone-900">Purrtner requests</h1>
          <p className="mt-2 text-stone-600">
            Businesses that want to host their coupon with you. Accept to list them publicly, or
            counter their offer.
          </p>
          <div className="cartoon-section mt-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <div className="mt-8 space-y-4">
            {negotiations.map((negotiation) => (
              <article className="cartoon-card bg-white p-5" key={negotiation.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-stone-900">{negotiation.partner.name}</p>
                    <p className="text-sm text-stone-600">
                      {negotiation.partner.address} · {negotiation.partner.city}/
                      {negotiation.partner.state}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {negotiation.contact_email} · {negotiation.contact_phone}
                    </p>
                  </div>
                  <Badge className="bg-amber-100 text-sm text-amber-900">
                    ${negotiation.proposed_amount.toFixed(2)}
                  </Badge>
                </div>
                {negotiation.proposed_message && (
                  <p className="mt-2 text-sm text-stone-500 italic">
                    &ldquo;{negotiation.proposed_message}&rdquo;
                  </p>
                )}
                {negotiation.counter_amount != null && (
                  <p className="mt-2 text-sm font-semibold text-sky-800">
                    Countered: ${negotiation.counter_amount.toFixed(2)}
                    {negotiation.counter_message ? ` — ${negotiation.counter_message}` : ''}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                      STATUS_STYLES[negotiation.status] ?? 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {negotiation.status}
                  </span>
                  {(negotiation.status === 'pending' || negotiation.status === 'countered') && (
                    <div className="ml-auto flex flex-wrap gap-2">
                      <button
                        className="cartoon-btn bg-teal-800 px-4 py-1.5 text-sm font-extrabold text-white hover:bg-teal-700"
                        onClick={() => void act(negotiation.id, 'accept')}
                        type="button"
                      >
                        Accept
                      </button>
                      {negotiation.status === 'pending' && (
                        <button
                          className="cartoon-btn bg-sky-500 px-4 py-1.5 text-sm font-extrabold text-white hover:bg-sky-400"
                          onClick={() => void act(negotiation.id, 'counter')}
                          type="button"
                        >
                          Counter
                        </button>
                      )}
                      <button
                        className="cartoon-btn bg-rose-500 px-4 py-1.5 text-sm font-extrabold text-white hover:bg-rose-400"
                        onClick={() => void act(negotiation.id, 'reject')}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
            {negotiations.length === 0 && (
              <p className="cartoon-card bg-white p-6 text-stone-600">No purrtner requests yet.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
