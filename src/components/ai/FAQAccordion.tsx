'use client';

import { useState } from 'react';
import type { FAQItem } from '../../lib/types';

export function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="border-b border-stone-200 py-4">
      <button
        className="flex w-full justify-between text-left font-bold text-stone-900"
        onClick={() => setOpen(!open)}
      >
        {item.question}
        <span>{open ? '−' : '+'}</span>
      </button>

      {open && <p className="mt-3 leading-7 text-stone-600">{item.answer}</p>}
    </article>
  );
}
