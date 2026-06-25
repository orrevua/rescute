'use client';

import { type FormEvent, type InputHTMLAttributes, useState } from 'react';
import { submitIntent } from '@/lib/api/donations';
import { Modal } from '@/components/ui/Modal';

interface Props {
  donationId: string;
  campaignTitle: string;
  onClose: () => void;
}

export function ContributionModal({ donationId, campaignTitle, onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'error' | 'success' | null>(null);
  const [amount, setAmount] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setResult(null);
    try {
      await submitIntent(donationId, {
        donor_name: String(data.get('name')),
        donor_email: String(data.get('email')),
        donor_phone: String(data.get('phone')),
        amount: parseFloat(amount),
        message: String(data.get('message') || '') || undefined,
      });
      setResult('success');
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
            Your interest to contribute <span className="font-black text-teal-800">${parseFloat(amount).toFixed(2)}</span> has been submitted!
            The protector will reach out to arrange payment.
          </p>
          <button className="cartoon-btn bg-teal-800 px-5 py-2 text-white hover:bg-teal-700" onClick={onClose} type="button">
            Close
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm leading-6 text-stone-600">
            This campaign doesn&apos;t have a direct payment link yet. Leave your contact info and the protector will reach out to arrange the donation.
          </p>
          <Input label="Your name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Phone" name="phone" type="tel" required />
          <label className="block text-sm font-bold text-stone-700">
            Amount ($)
            <input
              className="cartoon-input mt-1 w-full p-3 font-normal"
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
          <label className="block text-sm font-bold text-stone-700">
            Message (optional)
            <textarea
              className="cartoon-input mt-1 min-h-20 w-full p-3 font-normal"
              name="message"
              placeholder="Leave a kind word for the protector..."
            />
          </label>
          {result === 'error' && (
            <p className="cartoon-card !border-red-500 bg-red-50 p-3 text-sm font-bold text-red-800">
              Unable to submit. Please try again.
            </p>
          )}
          <button
            className="cartoon-btn w-full bg-amber-400 px-5 py-3 text-stone-950 hover:bg-amber-300 disabled:opacity-60"
            disabled={submitting || !amount}
            type="submit"
          >
            {submitting ? 'Submitting...' : 'Submit interest to donate'}
          </button>
        </form>
      )}
    </Modal>
  );
}

function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-bold text-stone-700">
      {label}
      <input className="cartoon-input mt-1 w-full p-3 font-normal" {...props} />
    </label>
  );
}
