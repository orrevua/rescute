'use client';

import { type FormEvent, useState } from 'react';
import { deletePartner, updatePartner } from '@/lib/api/partners';
import type { Partner } from '@/lib/types';
import { CouponBadge } from './CouponBadge';
import { PawIcon } from '@/components/ui/PawIcon';

export function PartnerCard({
  partner,
  currentUserId,
  onChange,
}: {
  partner: Partner;
  currentUserId?: string | null;
  onChange?: () => void;
}) {
  const isOwner = currentUserId != null && currentUserId === partner.owner_id;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await updatePartner(partner.id, {
        name: f.get('name') as string,
        description: (f.get('description') as string) || undefined,
        coupon_code: (f.get('coupon_code') as string) || undefined,
        discount_pct: f.get('discount_pct') ? Number(f.get('discount_pct')) : undefined,
      });
      setEditing(false);
      onChange?.();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm('Delete this purrtnership?')) return;
    await deletePartner(partner.id);
    onChange?.();
  }

  if (editing) {
    return (
      <form className="cartoon-card space-y-3 bg-white p-6" onSubmit={save}>
        <input
          className="cartoon-input w-full bg-white p-2"
          defaultValue={partner.name}
          name="name"
          placeholder="Business name"
          required
        />
        <textarea
          className="cartoon-input w-full bg-white p-2"
          defaultValue={partner.description}
          name="description"
          placeholder="Description"
          rows={2}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="cartoon-input w-full bg-white p-2 uppercase"
            defaultValue={partner.coupon_code}
            name="coupon_code"
            placeholder="Coupon code"
          />
          <input
            className="cartoon-input w-full bg-white p-2"
            defaultValue={partner.discount_pct}
            max="100"
            min="1"
            name="discount_pct"
            placeholder="Discount %"
            type="number"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="cartoon-btn bg-teal-800 px-4 py-1.5 text-sm font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="cartoon-btn bg-white px-4 py-1.5 text-sm font-extrabold text-teal-950 hover:bg-teal-50"
            onClick={() => setEditing(false)}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <article className="cartoon-card relative overflow-hidden bg-white p-6">
      <PawIcon
        size={52}
        className="pointer-events-none absolute top-2 right-3 text-teal-800 opacity-20"
        style={{ transform: 'rotate(-25deg)' }}
      />
      <PawIcon
        size={36}
        className="pointer-events-none absolute bottom-3 left-4 text-teal-800 opacity-15"
        style={{ transform: 'rotate(18deg)' }}
      />
      <h2 className="text-xl font-black text-stone-900">{partner.name}</h2>
      <p className="mt-2 text-stone-600">{partner.description}</p>
      <p className="mt-4 text-sm font-bold text-stone-600">
        {partner.address} · {partner.city}/{partner.state}
      </p>
      <div className="mt-4">
        <CouponBadge code={partner.coupon_code} discount={partner.discount_pct} />
      </div>
      {isOwner && (
        <div className="relative mt-4 flex gap-2">
          <button
            className="cartoon-btn bg-white px-4 py-1.5 text-sm font-extrabold text-teal-950 hover:bg-teal-50"
            onClick={() => setEditing(true)}
            type="button"
          >
            Edit
          </button>
          <button
            className="cartoon-btn bg-rose-500 px-4 py-1.5 text-sm font-extrabold text-white hover:bg-rose-400"
            onClick={() => void remove()}
            type="button"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
