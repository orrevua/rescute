'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/dashboard/DashboardNav';
import { ProtectedRoute } from '../../../lib/auth/guard';
import { getDashboardStats, type DashboardStats } from '../../../lib/api/dashboard';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <main className="min-h-screen bg-[#f4f7f4] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold tracking-[.2em] text-teal-700">PROTECTOR DASHBOARD</p>
          <h1 className="mt-2 text-4xl font-bold text-stone-900">Your care network.</h1>
          <div className="mt-6 rounded-2xl bg-white p-3 shadow-sm">
            <DashboardNav />
          </div>
          <section className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-stone-600">Registered cats</p>
              <p className="mt-2 text-4xl font-bold text-teal-800">
                {stats ? stats.cat_count : '—'}
              </p>
            </article>
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-stone-600">New applications</p>
              <p className="mt-2 text-4xl font-bold text-teal-800">
                {stats ? stats.application_count : '—'}
              </p>
            </article>
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-stone-600">Active campaigns</p>
              <p className="mt-2 text-4xl font-bold text-teal-800">
                {stats ? stats.active_campaign_count : '—'}
              </p>
            </article>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
