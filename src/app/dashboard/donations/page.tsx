'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { getDonations } from '@/lib/api/donations';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { DonationPost } from '@/lib/types';

export default function DashboardDonationsPage() {
  const [posts, setPosts] = useState<DonationPost[]>([]);

  useEffect(() => {
    void getDonations().then(setPosts);
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <main className="min-h-screen bg-[#f4f7f4] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <div className="mt-4 flex justify-between">
            <h1 className="text-3xl font-bold text-stone-900">Campaigns</h1>
            <Link className="rounded-xl bg-teal-800 px-4 py-2 font-bold text-white hover:bg-teal-900" href="/dashboard/donations/new">
              New campaign
            </Link>
          </div>
          <div className="mt-6 rounded-2xl bg-white p-3 shadow-sm">
            <DashboardNav />
          </div>
          <div className="mt-8 space-y-3">
            {posts.map((post) => (
              <article className="rounded-2xl bg-white p-5 shadow-sm" key={post.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold">{post.title}</h2>
                    <p className="text-stone-600">{post.description}</p>
                    {post.payment_link && (
                      <p className="mt-1 text-xs text-teal-700">Payment link configured</p>
                    )}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${post.is_active ? 'bg-teal-100 text-teal-800' : 'bg-stone-200 text-stone-600'}`}>
                    {post.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {post.target_amount && (
                  <p className="mt-2 text-sm text-stone-500">
                    ${post.current_amount.toFixed(2)} of ${post.target_amount.toFixed(2)}
                  </p>
                )}
                <div className="mt-3">
                  <Link className="font-bold text-teal-800 hover:underline" href={`/dashboard/donations/${post.id}/edit`}>
                    Edit
                  </Link>
                </div>
              </article>
            ))}
            {posts.length === 0 && (
              <p className="rounded-2xl bg-white p-6 text-stone-600">No campaigns yet.</p>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
