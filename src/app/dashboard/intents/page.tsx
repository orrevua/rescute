'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { getIntents } from '@/lib/api/donations';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { DonationIntent } from '@/lib/types';

export default function IntentsPage() {
  const [intents, setIntents] = useState<DonationIntent[]>([]);

  useEffect(() => {
    void getIntents().then(setIntents).catch(() => {});
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-stone-900">Donation intents</h1>
          <p className="mt-2 text-stone-600">
            People who expressed interest in donating to your campaigns. Reach out to arrange payment.
          </p>
          <div className="cartoon-section mt-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <div className="mt-8 space-y-4">
            {intents.map((intent) => (
              <article className="cartoon-card bg-white p-5" key={intent.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-stone-900">{intent.donor_name}</p>
                    <p className="text-sm text-stone-600">{intent.donor_email} · {intent.donor_phone}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border-2 border-teal-950 bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-900 shadow-[2px_2px_0_#1a3a38]">
                    ${intent.amount.toFixed(2)}
                  </span>
                </div>
                {intent.message && (
                  <p className="mt-2 text-sm italic text-stone-500">"{intent.message}"</p>
                )}
                <p className="mt-2 text-xs font-semibold text-stone-400">
                  {new Date(intent.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </article>
            ))}
            {intents.length === 0 && (
              <p className="cartoon-card bg-white p-6 text-stone-600">No donation intents yet.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
