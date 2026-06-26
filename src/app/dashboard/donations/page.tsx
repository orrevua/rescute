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
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/dashboard">
            ← Back to dashboard
          </Link>
          <div className="mt-4 flex justify-between">
            <h1 className="text-3xl font-bold text-stone-900">Campaigns</h1>
            <Link className="cartoon-btn border-2 bg-teal-800 px-4 py-2 font-bold text-white hover:bg-teal-700" href="/dashboard/donations/new">
              New campaign
            </Link>
          </div>
          <div className="cartoon-section mt-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <div className="mt-8 space-y-4">
            {posts.map((post) => (
              <article className="cartoon-card bg-white p-5" key={post.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-stone-900">{post.title}</h2>
                    <p className="text-sm text-stone-600">{post.description}</p>
                    {post.payment_link && (
                      <p className="mt-1 text-xs font-semibold text-teal-700">Payment link configured</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center rounded-full border-2 border-teal-950 px-3 py-1 text-xs font-extrabold shadow-[2px_2px_0_#1a3a38] ${post.is_active ? 'bg-teal-100 text-teal-800' : 'bg-stone-200 text-stone-600'}`}>
                    {post.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {post.target_amount && (
                  <p className="mt-2 text-sm font-semibold text-stone-500">
                    ${post.current_amount.toFixed(2)} of ${post.target_amount.toFixed(2)}
                  </p>
                )}
                <div className="mt-3">
                  <Link className="text-sm font-bold text-teal-800 hover:underline" href={`/dashboard/donations/${post.id}/edit`}>
                    Edit
                  </Link>
                </div>
              </article>
            ))}
            {posts.length === 0 && (
              <p className="cartoon-card bg-white p-6 text-stone-600">No campaigns yet.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
