'use client';

import { type FormEvent, type InputHTMLAttributes, useState } from 'react';
import { submitAdoption } from '../../lib/api/adoption';
import { Modal } from '../ui/Modal';

export function AdoptionModal({ catId, catName, onClose }: { catId: string; catName: string; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<'error' | 'success' | null>(null);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); setSubmitting(true); setResult(null); try { await submitAdoption({ cat_id: catId, applicant_name: String(data.get('name')), applicant_email: String(data.get('email')), applicant_phone: String(data.get('phone')), message: message || undefined, accepted_terms: data.get('terms') === 'on' }); setResult('success'); } catch { setResult('error'); } finally { setSubmitting(false); } }
  return <Modal title={`Adopt ${catName}`} onClose={onClose}>{result === 'success' ? <div className="space-y-4"><p className="leading-7 text-stone-700">Your interest has been submitted. {catName}'s protector will reach out via the email or phone you provided.</p><button className="cursor-pointer rounded-xl bg-teal-800 px-4 py-2 font-semibold text-white" onClick={onClose} type="button">Close</button></div> : <form className="space-y-4" onSubmit={handleSubmit}><p className="text-sm leading-6 text-stone-600">Tell us a bit about yourself. This helps the protector start the adoption conversation.</p><Input label="Your name" name="name" required /><Input label="Email" name="email" type="email" required /><Input label="Phone" name="phone" type="tel" required /><label className="block text-sm font-semibold text-stone-700">Message<textarea className="mt-1 min-h-24 w-full rounded-xl border border-stone-300 p-3 font-normal" onChange={(event) => setMessage(event.target.value)} value={message} /></label><label className="flex gap-3 text-sm leading-5 text-stone-700"><input className="mt-1" name="terms" required type="checkbox" />I have read and agree that my information may be shared with the protector for this adoption.</label>{result === 'error' && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">Unable to submit your interest. Please check your information and try again.</p>}<button className="cursor-pointer w-full rounded-2xl bg-amber-400 px-5 py-3 font-bold text-stone-950 hover:bg-amber-300 disabled:opacity-60" disabled={submitting} type="submit">{submitting ? 'Submitting interest...' : `I want to meet ${catName}`}</button></form>}</Modal>;
}

function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) { return <label className="block text-sm font-semibold text-stone-700">{label}<input className="mt-1 w-full rounded-xl border border-stone-300 p-3 font-normal" {...props} /></label>; }
