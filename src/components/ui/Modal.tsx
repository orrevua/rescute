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

  return <div className="fixed inset-0 z-50 grid place-items-center bg-teal-950/60 p-4" role="presentation"><section aria-modal="true" aria-labelledby="modal-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl" role="dialog"><div className="mb-5 flex items-start justify-between gap-4"><h2 id="modal-title" className="text-2xl font-bold text-stone-900">{title}</h2><button aria-label="Close" className="text-2xl leading-none text-stone-500 hover:text-stone-900" onClick={onClose} type="button">×</button></div>{children}</section></div>;
}
