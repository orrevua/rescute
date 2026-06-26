'use client';

import { useState } from 'react';

export function CepSearch({ onSearch }: { onSearch: (cep: string) => void }) {
  const [cep, setCep] = useState('');

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(cep);
      }}
    >
      <input
        className="cartoon-input min-w-0 flex-1 bg-white px-3 py-2 text-sm font-semibold text-stone-800 placeholder:text-stone-400"
        maxLength={9}
        onChange={(event) => setCep(event.target.value)}
        placeholder="Your ZIP code"
        value={cep}
      />
      <button className="cartoon-btn border-2 bg-teal-800 px-4 py-2 font-bold text-white hover:bg-teal-700">
        Search
      </button>
    </form>
  );
}
