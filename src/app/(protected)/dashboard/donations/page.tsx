'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../../components/dashboard/DashboardNav';
import { getDonations } from '../../../../lib/api/donations';
import { ProtectedRoute } from '../../../../lib/auth/guard';
import type { DonationPost } from '../../../../lib/types';

export default function DashboardDonationsPage() {
  const [posts, setPosts] = useState<DonationPost[]>([]);

  useEffect(() => {
    void getDonations().then(setPosts);
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <main className="min-h-screen bg-[#f4f7f4] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="cursor-pointer text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <div className="mt-4 flex justify-between">
            <h1 className="text-3xl font-bold text-stone-900">Campaigns</h1>
            <Link className="cursor-pointer rounded-xl bg-teal-800 px-4 py-2 font-bold text-white hover:bg-teal-900" href="/dashboard/donations/new">
              New campaign
            </Link>
          </div>
          <div className="mt-6 rounded-2xl bg-white p-3 shadow-sm">
            <DashboardNav />
          </div>
          <div className="mt-8 space-y-3">
            {posts.map((post) => (
              <article className="rounded-2xl bg-white p-5 shadow-sm" key={post.id}>
                <h2 className="font-bold">{post.title}</h2>
                <p className="text-stone-600">{post.description}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
