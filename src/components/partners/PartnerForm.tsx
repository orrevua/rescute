'use client';

import { type FormEvent, useState } from 'react';
import { createPartner } from '@/lib/api/partners';

export function PartnerForm() {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await createPartner({
        name: f.get('name') as string,
        description: (f.get('description') as string) || undefined,
        address: f.get('address') as string,
        cep: f.get('cep') as string,
        city: f.get('city') as string,
        state: f.get('state') as string,
        coupon_code: (f.get('coupon_code') as string) || undefined,
        discount_pct: f.get('discount_pct') ? Number(f.get('discount_pct')) : undefined,
      });
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="cartoon-section bg-[#f0fdf8] p-8 text-center">
        <p className="text-2xl font-extrabold text-teal-900">Welcome aboard!</p>
        <p className="mt-2 text-stone-600">Your purrtnership has been registered. Thank you for supporting cat rescue!</p>
      </div>
    );
  }

  return (
    <form className="cartoon-section space-y-6 bg-[#f0fdf8] p-8" onSubmit={submit}>
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Business info</legend>
        <div>
          <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-name">Business name</label>
          <input className="cartoon-input w-full bg-white p-3" id="partner-name" name="name" placeholder="e.g. Pet Palace" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-desc">Description</label>
          <textarea className="cartoon-input w-full bg-white p-3" id="partner-desc" name="description" placeholder="What does your business do?" rows={3} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Location</legend>
        <div>
          <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-address">Address</label>
          <input className="cartoon-input w-full bg-white p-3" id="partner-address" name="address" placeholder="e.g. Rua dos Gatos, 42" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-cep">CEP</label>
            <input className="cartoon-input w-full bg-white p-3" id="partner-cep" maxLength={9} name="cep" placeholder="00000-000" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-city">City</label>
            <input className="cartoon-input w-full bg-white p-3" id="partner-city" name="city" placeholder="e.g. São Paulo" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-state">State</label>
            <input className="cartoon-input w-full bg-white p-3" id="partner-state" maxLength={2} name="state" placeholder="e.g. SP" required />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Coupon</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-coupon">Coupon code</label>
            <input className="cartoon-input w-full bg-white p-3 uppercase" id="partner-coupon" name="coupon_code" placeholder="e.g. RESCUTE20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="partner-discount">Discount %</label>
            <input className="cartoon-input w-full bg-white p-3" id="partner-discount" max="100" min="1" name="discount_pct" placeholder="e.g. 20" type="number" />
          </div>
        </div>
        <p className="text-xs text-stone-500">The discount customers get when purchasing using the coupon code claimed from Rescute.</p>
      </fieldset>

      <button
        className="cartoon-btn w-full bg-teal-800 px-6 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
        disabled={saving}
      >
        {saving ? 'Registering...' : 'Register purrtnership'}
      </button>
    </form>
  );
}
