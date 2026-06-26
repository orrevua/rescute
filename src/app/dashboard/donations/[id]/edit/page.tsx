'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { getDonation, updateDonation } from '@/lib/api/donations';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { DonationPost } from '@/lib/types';

export default function EditDonationPage({ params }: { params: Promise<{ id: string }> }) {
  const [donation, setDonation] = useState<DonationPost | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void params.then(({ id }) => getDonation(id).then(setDonation));
  }, [params]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!donation) return;
    const f = new FormData(e.currentTarget);
    const paymentLink = String(f.get('payment_link') || '').trim() || null;
    await updateDonation(donation.id, {
      title: f.get('title'),
      description: f.get('description'),
      target_amount: Number(f.get('target')) || undefined,
      payment_link: paymentLink,
      is_active: f.get('is_active') === 'on',
    });
    setSaved(true);
  }

  if (!donation) return null;

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/dashboard/donations">
            ← Back to campaigns
          </Link>
          <h1 className="mt-4 mb-6 text-3xl font-bold text-stone-900">Edit campaign</h1>
          <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
            <label className="block text-sm font-semibold text-stone-700">
              Title
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="title" defaultValue={donation.title} required />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Description
              <textarea className="mt-1 min-h-24 w-full rounded-xl border p-3 font-normal" name="description" defaultValue={donation.description} required />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Financial goal
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" min="0" name="target" defaultValue={donation.target_amount ?? ''} type="number" />
            </label>
            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Payment link (optional)
                <input
                  className="mt-1 w-full rounded-xl border p-3 font-normal"
                  name="payment_link"
                  defaultValue={donation.payment_link ?? ''}
                  placeholder="GoFundMe, PayPal.me, Venmo, CashApp link..."
                  type="url"
                />
              </label>
              <p className="mt-1 text-xs text-stone-400">
                If provided, donors will be redirected to this link. Otherwise, they can submit a donation intent.
              </p>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
              <input type="checkbox" name="is_active" defaultChecked={donation.is_active} />
              Campaign is active
            </label>
            {saved && <p className="text-teal-800">Campaign updated.</p>}
            <button className="rounded-xl bg-teal-800 px-4 py-3 font-bold text-white" type="submit">
              Save changes
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
