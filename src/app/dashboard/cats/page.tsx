'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { deleteCat, getMyCats } from '@/lib/api/cats';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { Cat } from '@/lib/types';

export default function DashboardCatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);

  async function load() {
    const results = await getMyCats();
    setCats(results);
  }

  useEffect(() => {
    void getMyCats().then(setCats);
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <main className="min-h-screen bg-[#f4f7f4] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="cursor-pointer text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <div className="mt-4 flex justify-between">
            <h1 className="text-3xl font-bold text-stone-900">My cats</h1>
            <Link className="cursor-pointer rounded-xl bg-teal-800 px-4 py-2 font-bold text-white hover:bg-teal-900" href="/dashboard/cats/new">
              Register cat
            </Link>
          </div>
          <div className="mt-6 rounded-2xl bg-white p-3 shadow-sm">
            <DashboardNav />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cats.map((cat) => (
              <article className="rounded-2xl bg-white p-5 shadow-sm" key={cat.id}>
                <h2 className="text-xl font-bold">{cat.name}</h2>
                <p className="text-stone-600">{cat.city}/{cat.state}</p>
                <div className="mt-4 flex gap-3">
                  <Link className="cursor-pointer font-bold text-teal-800 hover:underline" href={`/dashboard/cats/${cat.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    className="cursor-pointer font-bold text-red-700 hover:underline"
                    onClick={async () => { await deleteCat(cat.id); await load(); }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
