'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { getMyProfile, updateMyProfile } from '@/lib/api/users';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getMyProfile().then(setProfile);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const updated = await updateMyProfile({
      org_name: String(f.get('org_name') || '').trim(),
      description: String(f.get('description') || '').trim() || null,
      phone: String(f.get('phone') || '').trim() || null,
      city: String(f.get('city') || '').trim() || null,
      state: String(f.get('state') || '').trim() || null,
    });
    setProfile(updated);
    setSaved(true);
  }

  if (!profile) return null;

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 mb-6 text-3xl font-bold text-stone-900">My profile</h1>
          <div className="cartoon-section mb-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <form className="mx-auto max-w-2xl space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
            <label className="block text-sm font-semibold text-stone-700">
              Organization name
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="org_name" defaultValue={profile.org_name ?? ''} required />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Description
              <textarea className="mt-1 min-h-24 w-full rounded-xl border p-3 font-normal" name="description" defaultValue={profile.description ?? ''} />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Phone
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="phone" defaultValue={profile.phone ?? ''} />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              City
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="city" defaultValue={profile.city ?? ''} />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              State
              <input className="mt-1 w-full rounded-xl border p-3 font-normal" name="state" defaultValue={profile.state ?? ''} />
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
