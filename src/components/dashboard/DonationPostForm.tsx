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
    <form className="cartoon-section space-y-4 bg-white p-6" onSubmit={submit}>
      <input className="cartoon-input w-full p-3" name="title" placeholder="Title" required />
      <textarea
        className="cartoon-input min-h-24 w-full p-3"
        name="description"
        placeholder="Description"
        required
      />
      <select className="cartoon-input p-3" name="type">
        <option value="financial">Financial</option>
        <option value="item">Items</option>
      </select>
      <input
        className="cartoon-input w-full p-3"
        min="0"
        name="target"
        placeholder="Financial goal"
        type="number"
      />
      <div>
        <label className="block text-sm font-semibold text-stone-700">
          Payment link (optional)
          <input
            className="cartoon-input mt-1 w-full p-3 font-normal"
            name="payment_link"
            placeholder="GoFundMe, PayPal.me, Venmo, CashApp link..."
            type="url"
          />
        </label>
        <p className="mt-1 text-xs text-stone-400">
          If provided, donors will be redirected to this link. Otherwise, they can submit a donation
          intent with their contact info.
        </p>
      </div>
      {saved && <p className="text-teal-800">Campaign created.</p>}
      <button className="cartoon-btn bg-teal-800 px-4 py-3 text-white" type="submit">
        Create campaign
      </button>
    </form>
  );
}
