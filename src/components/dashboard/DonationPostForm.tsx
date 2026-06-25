'use client';

import { type FormEvent, useState } from 'react';
import { createDonation } from '../../lib/api/donations';

export function DonationPostForm() {
  const [saved, setSaved] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const paymentLink = String(f.get('payment_link') || '').trim() || undefined;
    await createDonation({
      title: f.get('title'),
      description: f.get('description'),
      type: f.get('type'),
      target_amount: Number(f.get('target')) || undefined,
      payment_link: paymentLink,
    });
    setSaved(true);
  }

  return (
    <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
      <input className="w-full rounded-xl border p-3" name="title" placeholder="Title" required />
      <textarea className="min-h-24 w-full rounded-xl border p-3" name="description" placeholder="Description" required />
      <select className="rounded-xl border p-3" name="type">
        <option value="financial">Financial</option>
        <option value="item">Items</option>
      </select>
      <input className="w-full rounded-xl border p-3" min="0" name="target" placeholder="Financial goal" type="number" />
      <div>
        <label className="block text-sm font-semibold text-stone-700">
          Payment link (optional)
          <input
            className="mt-1 w-full rounded-xl border p-3 font-normal"
            name="payment_link"
            placeholder="GoFundMe, PayPal.me, Venmo, CashApp link..."
            type="url"
          />
        </label>
        <p className="mt-1 text-xs text-stone-400">
          If provided, donors will be redirected to this link. Otherwise, they can submit a donation intent with their contact info.
        </p>
      </div>
      {saved && <p className="text-teal-800">Campaign created.</p>}
      <button className="rounded-xl bg-teal-800 px-4 py-3 font-bold text-white" type="submit">
        Create campaign
      </button>
    </form>
  );
}
