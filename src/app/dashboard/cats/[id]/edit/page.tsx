'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CatForm } from '@/components/dashboard/CatForm';
import { ProtectedRoute } from '@/lib/auth/guard';
import { getCat } from '@/lib/api/cats';
import type { Cat } from '@/lib/types';

export default function EditCatPage({ params }: { params: Promise<{ id: string }> }) {
  const [cat, setCat] = useState<Cat>();

  useEffect(() => {
    void params.then(({ id }) => getCat(id).then(setCat));
  }, [params]);

  return (
    <ProtectedRoute requiredRole="protector">
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link className="cursor-pointer text-sm font-semibold text-teal-700 hover:underline" href="/dashboard/cats">
            ← Back to my cats
          </Link>
          <h1 className="mt-4 mb-6 text-3xl font-bold text-stone-900">Edit cat</h1>
          {cat && <CatForm cat={cat} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
