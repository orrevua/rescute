'use client';

import { useEffect, type ReactNode } from 'react';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-teal-950/60 p-4" role="presentation">
      <section
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto cartoon-section bg-white p-8 paw-deco"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-2xl font-black text-stone-900">{title}</h2>
          <button
            aria-label="Close"
            className="cartoon-btn border-2 bg-white px-3 py-1 text-xl leading-none text-stone-500 hover:bg-red-50 hover:text-red-700"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
