'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { ProtectedRoute } from '@/lib/auth/guard';
import { getDashboardStats, type DashboardStats } from '@/lib/api/dashboard';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold tracking-[.2em] text-teal-700">PROTECTOR DASHBOARD</p>
          <h1 className="mt-2 text-4xl font-bold text-stone-900">Your care network.</h1>
          <div className="cartoon-section mt-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <section className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="cartoon-card bg-white p-6">
              <p className="text-sm font-bold tracking-wide text-stone-500">Registered cats</p>
              <p className="mt-2 text-4xl font-black text-teal-800">
                {stats ? stats.cat_count : '—'}
              </p>
            </article>
            <article className="cartoon-card bg-white p-6">
              <p className="text-sm font-bold tracking-wide text-stone-500">New applications</p>
              <p className="mt-2 text-4xl font-black text-teal-800">
                {stats ? stats.application_count : '—'}
              </p>
            </article>
            <article className="cartoon-card bg-white p-6">
              <p className="text-sm font-bold tracking-wide text-stone-500">Active campaigns</p>
              <p className="mt-2 text-4xl font-black text-teal-800">
                {stats ? stats.active_campaign_count : '—'}
              </p>
            </article>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
