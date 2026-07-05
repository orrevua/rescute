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
          <Link
            className="text-sm font-semibold text-teal-700 hover:underline"
            href="/foster/applications"
          >
            ← Back to my applications
          </Link>
          <h1 className="mt-4 mb-6 text-3xl font-bold text-stone-900">My profile</h1>
          <form className="cartoon-section space-y-6 bg-[#f0fdf8] p-8" onSubmit={submit}>
            <fieldset className="space-y-4">
              <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">
                About you
              </legend>
              <div>
                <label
                  className="mb-1 block text-sm font-bold text-stone-700"
                  htmlFor="foster-full-name"
                >
                  Full name
                </label>
                <input
                  className="cartoon-input w-full bg-white p-3"
                  defaultValue={profile.full_name ?? ''}
                  id="foster-full-name"
                  name="full_name"
                  placeholder="e.g. Jamie Rivera"
                  required
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-bold text-stone-700"
                  htmlFor="foster-phone"
                >
                  Phone
                </label>
                <input
                  className="cartoon-input w-full bg-white p-3"
                  defaultValue={profile.phone ?? ''}
                  id="foster-phone"
                  name="phone"
                  placeholder="(555) 000-0000"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1 block text-sm font-bold text-stone-700"
                    htmlFor="foster-city"
                  >
                    City
                  </label>
                  <input
                    className="cartoon-input w-full bg-white p-3"
                    defaultValue={profile.city ?? ''}
                    id="foster-city"
                    name="city"
                    placeholder="e.g. Springfield"
                    required
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-sm font-bold text-stone-700"
                    htmlFor="foster-state"
                  >
                    State
                  </label>
                  <input
                    className="cartoon-input w-full bg-white p-3"
                    defaultValue={profile.state ?? ''}
                    id="foster-state"
                    maxLength={2}
                    name="state"
                    placeholder="e.g. NY"
                    required
                  />
                </div>
              </div>
            </fieldset>

            {saved && (
              <p className="rounded-full bg-teal-100 px-4 py-2 text-center text-sm font-bold text-teal-900 shadow-[0_0_0_2.5px_var(--cartoon-accent),3px_3px_0_var(--cartoon-accent)]">
                Profile updated successfully!
              </p>
            )}
            <button
              className="cartoon-btn w-full bg-teal-800 px-6 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
              type="submit"
            >
              Save changes
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
