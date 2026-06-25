'use client';

import { type FormEvent, type InputHTMLAttributes, useState } from 'react';
import { contribute } from '../../lib/api/donations';
import { Modal } from '../ui/Modal';

interface Props {
  donationId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: (newTotal: number) => void;
}

export function ContributionModal({ donationId, campaignTitle, onClose, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'error' | 'success' | null>(null);
  const [amount, setAmount] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setResult(null);
    try {
      const res = await contribute(donationId, {
        donor_name: String(data.get('name')),
        donor_email: String(data.get('email')),
        amount: parseFloat(amount),
        message: String(data.get('message') || '') || undefined,
      });
      setResult('success');
      onSuccess(res.new_total);
    } catch {
      setResult('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Contribute to "${campaignTitle}"`} onClose={onClose}>
      {result === 'success' ? (
        <div className="space-y-4">
          <p className="leading-7 text-stone-700">
            Thank you for your contribution of <span className="font-bold text-teal-800">${parseFloat(amount).toFixed(2)}</span>!
            The protector will be notified.
          </p>
          <button
            className="rounded-xl bg-teal-800 px-4 py-2 font-semibold text-white"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm leading-6 text-stone-600">
            Your contribution helps provide food, medical care, and shelter for rescued cats.
          </p>
          <Input label="Your name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <label className="block text-sm font-semibold text-stone-700">
            Amount ($)
            <input
              className="mt-1 w-full rounded-xl border border-stone-300 p-3 font-normal"
              type="number"
              name="amount"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25.00"
            />
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Message (optional)
            <textarea
              className="mt-1 min-h-20 w-full rounded-xl border border-stone-300 p-3 font-normal"
              name="message"
              placeholder="Leave a kind word for the protector..."
            />
          </label>
          {result === 'error' && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
              Unable to process your contribution. Please try again.
            </p>
          )}
          <button
            className="w-full rounded-2xl bg-amber-400 px-5 py-3 font-bold text-stone-950 hover:bg-amber-300 disabled:opacity-60"
            disabled={submitting || !amount}
            type="submit"
          >
            {submitting ? 'Processing...' : `Contribute $${amount ? parseFloat(amount).toFixed(2) : '0.00'}`}
          </button>
        </form>
      )}
    </Modal>
  );
}

function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-semibold text-stone-700">
      {label}
      <input className="mt-1 w-full rounded-xl border border-stone-300 p-3 font-normal" {...props} />
    </label>
  );
}
