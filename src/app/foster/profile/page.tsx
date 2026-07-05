'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '@/lib/api/users';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { UserProfile } from '@/lib/types';

export default function FosterProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getMyProfile().then(setProfile);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const updated = await updateMyProfile({
      full_name: String(f.get('full_name') || '').trim(),
      phone: String(f.get('phone') || '').trim(),
      city: String(f.get('city') || '').trim(),
      state: String(f.get('state') || '').trim(),
    });
    setProfile(updated);
    setSaved(true);
  }

  if (!profile) return null;

  return (
    <ProtectedRoute requiredRole="foster">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/foster/applications">
            ← Back to my applications
          </Link>
          <h1 className="mt-4 mb-6 text-3xl font-bold text-stone-900">My profile</h1>
          <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
            <label className="block text-sm font-semibold text-stone-700">
              Full name
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="full_name" defaultValue={profile.full_name ?? ''} required />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Phone
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="phone" defaultValue={profile.phone ?? ''} required />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              City
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="city" defaultValue={profile.city ?? ''} required />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              State
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="state" defaultValue={profile.state ?? ''} required />
            </label>
            {saved && <p className="text-teal-800">Profile updated.</p>}
            <button className="rounded-xl bg-teal-800 px-4 py-3 font-bold text-white" type="submit">
              Save changes
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
