'use client';

import Link from 'next/link';
import { FosterForm } from '@/components/foster/FosterForm';
import { ProtectedRoute } from '@/lib/auth/guard';

export default function FosterApplyPage() { return <ProtectedRoute requiredRole="foster"><div className="px-6 py-10"><div className="mx-auto max-w-2xl"><p className="text-sm font-bold tracking-[0.18em] text-teal-700">FOSTER HOME</p><h1 className="mt-2 text-4xl font-bold text-stone-900">Make room for a story to begin again.</h1><p className="mt-3 leading-7 text-stone-600">Your answers help us find safe and compatible foster placements.</p><div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm"><FosterForm /></div><Link className="mt-5 inline-block text-sm font-semibold text-teal-800 hover:underline" href="/foster/applications">View my applications</Link></div></div></ProtectedRoute>; }
