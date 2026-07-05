'use client';

import { useState } from 'react';
import type { DonationPost } from '@/lib/types';
import { ContributionModal } from './ContributionModal';
import { PawIcon } from '@/components/ui/PawIcon';

export function DonationCard({ donation }: { donation: DonationPost }) {
  const [showModal, setShowModal] = useState(false);

  const progress = donation.target_amount
    ? Math.min(100, (donation.current_amount / donation.target_amount) * 100)
    : 0;

  const hasPaymentLink = !!donation.payment_link;

  return (
    <>
      <article className="cartoon-card relative overflow-hidden bg-white p-6">
        <PawIcon
          size={52}
          className="pointer-events-none absolute top-2 right-3 text-teal-800 opacity-20"
          style={{ transform: 'rotate(-25deg)' }}
        />
        <PawIcon
          size={36}
          className="pointer-events-none absolute bottom-3 left-4 text-teal-800 opacity-15"
          style={{ transform: 'rotate(18deg)' }}
        />
        <p className="text-sm font-black tracking-widest text-teal-700">FINANCIAL SUPPORT</p>
        <h2 className="mt-2 text-2xl font-bold text-stone-900">{donation.title}</h2>
        <p className="mt-2 text-stone-600">{donation.description}</p>
        {donation.target_amount && (
          <>
            <div className="border-ink mt-5 h-3 overflow-hidden rounded-full border-2 bg-stone-200">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-bold text-stone-600">
              ${donation.current_amount.toFixed(2)} of ${donation.target_amount.toFixed(2)}
            </p>
          </>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          {hasPaymentLink ? (
            <a
              className="cartoon-btn bg-teal-800 px-5 py-2 text-white hover:bg-teal-700"
              href={donation.payment_link!}
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate now
            </a>
          ) : (
            <button
              className="cartoon-btn bg-teal-800 px-5 py-2 text-white hover:bg-teal-700"
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
