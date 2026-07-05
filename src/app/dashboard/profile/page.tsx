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
          <form className="mx-auto max-w-2xl cartoon-section space-y-6 bg-[#f0fdf8] p-8" onSubmit={submit}>
            <fieldset className="space-y-4">
              <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Organization</legend>
              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="profile-org-name">Organization name</label>
                <input className="cartoon-input w-full bg-white p-3" defaultValue={profile.org_name ?? ''} id="profile-org-name" name="org_name" placeholder="e.g. Happy Paws Shelter" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="profile-description">Description</label>
                <textarea className="cartoon-input w-full bg-white p-3" defaultValue={profile.description ?? ''} id="profile-description" name="description" placeholder="Tell us about your organization" rows={3} />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Contact & location</legend>
              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="profile-phone">Phone</label>
                <input className="cartoon-input w-full bg-white p-3" defaultValue={profile.phone ?? ''} id="profile-phone" name="phone" placeholder="(555) 000-0000" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="profile-city">City</label>
                  <input className="cartoon-input w-full bg-white p-3" defaultValue={profile.city ?? ''} id="profile-city" name="city" placeholder="e.g. Springfield" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="profile-state">State</label>
                  <input className="cartoon-input w-full bg-white p-3" defaultValue={profile.state ?? ''} id="profile-state" maxLength={2} name="state" placeholder="e.g. NY" />
                </div>
              </div>
            </fieldset>

            {saved && (
              <p className="rounded-full bg-teal-100 px-4 py-2 text-center text-sm font-bold text-teal-900 shadow-[0_0_0_2.5px_#0d9488,3px_3px_0_#0d9488]">
                Profile updated successfully!
              </p>
            )}
            <button className="cartoon-btn w-full bg-teal-800 px-6 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50" type="submit">
              Save changes
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
