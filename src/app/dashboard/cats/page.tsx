'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { deleteCat, getMyCats } from '@/lib/api/cats';
import { ProtectedRoute } from '@/lib/auth/guard';
import { Modal } from '@/components/ui/Modal';
import type { Cat } from '@/lib/types';

export default function DashboardCatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [deleting, setDeleting] = useState<Cat | null>(null);

  async function load() {
    const results = await getMyCats();
    setCats(results);
  }

  useEffect(() => {
    void getMyCats().then(setCats);
  }, []);

  async function confirmDelete() {
    if (!deleting) return;
    await deleteCat(deleting.id);
    setDeleting(null);
    await load();
  }

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="cursor-pointer text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <div className="mt-4 flex justify-between">
            <h1 className="text-3xl font-bold text-stone-900">My cats</h1>
            <Link className="cartoon-btn border-2 bg-teal-800 px-4 py-2 font-bold text-white hover:bg-teal-700" href="/dashboard/cats/new">
              Register cat
            </Link>
          </div>
          <div className="cartoon-section mt-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {cats.map((cat) => (
              <article className="cartoon-card bg-white p-5" key={cat.id}>
                <h2 className="text-xl font-bold text-stone-900">{cat.name}</h2>
                <p className="text-sm text-stone-600">{cat.city}/{cat.state}</p>
                <div className="mt-4 flex gap-3">
                  <Link className="cursor-pointer text-sm font-bold text-teal-800 hover:underline" href={`/dashboard/cats/${cat.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    className="cursor-pointer text-sm font-bold text-red-700 hover:underline"
                    onClick={() => setDeleting(cat)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {deleting && (
        <Modal title="Remove cat" onClose={() => setDeleting(null)}>
          <p className="text-stone-700">
            Are you sure you want to remove <span className="font-bold">{deleting.name}</span>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="cartoon-btn bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
              onClick={() => setDeleting(null)}
            >
              Cancel
            </button>
            <button
              className="cartoon-btn bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
              onClick={confirmDelete}
            >
              Yes, remove
            </button>
          </div>
        </Modal>
      )}
    </ProtectedRoute>
  );
}
