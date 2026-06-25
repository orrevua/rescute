'use client';

import { useState } from 'react';
import type { DonationPost } from '../../lib/types';
import { ContributionModal } from './ContributionModal';

export function DonationCard({ donation }: { donation: DonationPost }) {
  const [showModal, setShowModal] = useState(false);

  const progress = donation.target_amount
    ? Math.min(100, (donation.current_amount / donation.target_amount) * 100)
    : 0;

  const hasPaymentLink = !!donation.payment_link;

  return (
    <>
      <article className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-bold tracking-widest text-teal-700">FINANCIAL SUPPORT</p>
        <h2 className="mt-2 text-2xl font-bold text-stone-900">{donation.title}</h2>
        <p className="mt-2 text-stone-600">{donation.description}</p>
        {donation.target_amount && (
          <>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-stone-600">
              ${donation.current_amount.toFixed(2)} of ${donation.target_amount.toFixed(2)}
            </p>
          </>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          {hasPaymentLink ? (
            <a
              className="inline-block rounded-xl bg-teal-800 px-4 py-2 font-semibold text-white hover:bg-teal-700"
              href={donation.payment_link!}
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate now ↗
            </a>
          ) : (
            <button
              className="rounded-xl bg-teal-800 px-4 py-2 font-semibold text-white hover:bg-teal-700"
              onClick={() => setShowModal(true)}
              type="button"
            >
              I want to contribute
            </button>
          )}
        </div>
        {hasPaymentLink && (
          <p className="mt-2 text-xs text-stone-400">Opens external payment page</p>
        )}
      </article>

      {showModal && (
        <ContributionModal
          donationId={donation.id}
          campaignTitle={donation.title}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
