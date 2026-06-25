'use client';

import Link from 'next/link';
import { DonationPostForm } from '@/components/dashboard/DonationPostForm';
import { ProtectedRoute } from '@/lib/auth/guard';

export default function NewDonationPage() {
  return (
    <ProtectedRoute requiredRole="protector">
      <main className="min-h-screen bg-[#f4f7f4] px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link className="cursor-pointer text-sm font-semibold text-teal-700 hover:underline" href="/dashboard/donations">
            ← Back to campaigns
          </Link>
          <h1 className="mt-4 mb-6 text-3xl font-bold text-stone-900">New campaign</h1>
          <DonationPostForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
