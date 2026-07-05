'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { ApplicationList } from '@/components/dashboard/ApplicationList';
import { getAdoptions } from '@/lib/api/adoption';
import { getFosterApplications } from '@/lib/api/foster';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { AdoptionApplication, FosterApplication } from '@/lib/types';

export default function ApplicationsPage() {
  const [adoptions, setAdoptions] = useState<AdoptionApplication[]>([]);
  const [fosters, setFosters] = useState<FosterApplication[]>([]);

  useEffect(() => {
    void Promise.all([getAdoptions(), getFosterApplications()]).then(([a, f]) => {
      setAdoptions(a);
      setFosters(f);
    });
  }, []);

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            className="cursor-pointer text-sm font-semibold text-teal-700 hover:underline"
            href="/dashboard"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-stone-900">Received applications</h1>
          <div className="cartoon-section mt-6 bg-[#f0fdf8] p-4">
            <DashboardNav />
          </div>
          <div className="mt-8 space-y-6">
            <ApplicationList applications={adoptions} title="Adoptions" />
            <ApplicationList applications={fosters} title="Foster homes" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
