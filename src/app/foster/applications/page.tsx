'use client';

import { useEffect, useState } from 'react';
import { ApplicationStatus } from '@/components/foster/ApplicationStatus';
import { getFosterApplications } from '@/lib/api/foster';
import { ProtectedRoute } from '@/lib/auth/guard';
import type { FosterApplication } from '@/lib/types';

export default function FosterApplicationsPage() { const [applications, setApplications] = useState<FosterApplication[]>([]); const [error, setError] = useState(''); useEffect(() => { void getFosterApplications().then(setApplications).catch(() => setError('Unable to load your applications.')); }, []); return <ProtectedRoute requiredRole="foster"><div className="px-6 py-10"><div className="mx-auto max-w-3xl"><h1 className="text-4xl font-bold text-stone-900">My applications</h1><p className="mt-2 text-stone-600">Follow every step of your foster home journey.</p>{error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}<div className="mt-7 space-y-4">{applications.map((application) => <article key={application.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-stone-900">Foster home application</h2><p className="mt-1 text-sm text-stone-600">Submitted on {new Date(application.created_at).toLocaleDateString('en-US')}</p></div><ApplicationStatus status={application.status} /></div></article>)}</div>{!error && applications.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-stone-300 p-6 text-stone-600">You haven't submitted any applications yet.</p>}</div></div></ProtectedRoute>; }
