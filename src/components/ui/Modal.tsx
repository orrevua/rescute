'use client';

import { useEffect, type ReactNode } from 'react';
import { PawIcon } from './PawIcon';

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-teal-950/60 p-4"
      role="presentation"
    >
      <section
        aria-modal="true"
        aria-labelledby="modal-title"
        className="cartoon-section relative max-h-[90vh] w-full max-w-lg overflow-hidden bg-white p-8"
        role="dialog"
      >
        <PawIcon
          size={56}
          className="pointer-events-none absolute top-3 right-4 text-teal-800 opacity-20"
          style={{ transform: 'rotate(-20deg)' }}
        />
        <PawIcon
          size={40}
          className="pointer-events-none absolute bottom-4 left-5 text-teal-800 opacity-15"
          style={{ transform: 'rotate(22deg)' }}
        />
        <div className="relative max-h-[calc(90vh-4rem)] overflow-y-auto p-2">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id="modal-title" className="text-2xl font-black text-stone-900">
              {title}
            </h2>
            <button
              aria-label="Close"
              className="cartoon-btn bg-white px-3 py-1 text-xl leading-none text-stone-500 hover:bg-red-50 hover:text-red-700"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
