'use client';

import { type FormEvent, useState } from 'react';
import { submitFosterApplication } from '../../lib/api/foster';

export function FosterForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'error' | 'success' | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setResult(null);
    try {
      await submitFosterApplication({
        existing_pets: String(form.get('pets')),
        compatibility: String(form.get('compatibility')),
        prior_experience: String(form.get('experience')),
        city: String(form.get('city')),
        cost_aware: form.get('cost') === 'on',
      });
      setResult('success');
      event.currentTarget.reset();
    } catch {
      setResult('error');
    } finally {
      setSubmitting(false);
    }
  }
  if (result === 'success')
    return (
      <p className="rounded-2xl bg-teal-100 p-5 text-teal-900">
        Your application has been submitted. You can track its status under &quot;My
        applications&quot;.
      </p>
    );
  return (
    <form className="space-y-5" onSubmit={submit}>
      <Question name="pets" label="What animals currently live with you?" />
      <Question name="compatibility" label="How would you introduce a new cat to your home?" />
      <Question name="experience" label="Tell us about your experience with cats." />
      <label className="block text-sm font-semibold text-stone-700">
        City
        <input className="cartoon-input mt-1 w-full p-3 font-normal" name="city" required />
      </label>
      <label className="flex gap-3 text-sm text-stone-700">
        <input className="mt-1" name="cost" required type="checkbox" />I understand that fostering
        also involves costs and veterinary care.
      </label>
      {result === 'error' && (
        <p className="rounded-xl bg-red-50 p-3 text-red-800">
          Unable to submit your application. Please try again.
        </p>
      )}
      <button
        className="cartoon-btn w-full bg-teal-800 px-5 py-3 text-white hover:bg-teal-700 disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit application'}
      </button>
    </form>
  );
}

function Question({ name, label }: { name: string; label: string }) {
  return (
    <label className="block text-sm font-semibold text-stone-700">
      {label}
      <textarea
        className="cartoon-input mt-1 min-h-24 w-full p-3 font-normal"
        name={name}
        required
      />
    </label>
  );
}
