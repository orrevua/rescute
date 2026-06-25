'use client';
import { useState } from 'react';
export function CepSearch({ onSearch }: { onSearch: (cep: string) => void }) { const [cep, setCep] = useState(''); return <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); onSearch(cep); }}><input className="min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2" maxLength={9} onChange={(event) => setCep(event.target.value)} placeholder="Your ZIP code" value={cep} /><button className="rounded-xl bg-teal-800 px-4 py-2 font-semibold text-white">Search</button></form>; }
