'use client';

import { useState } from 'react';

export function ChatInput({ onAsk }: { onAsk: (question: string) => void }) {
  const [question, setQuestion] = useState('');

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (question.trim()) {
          onAsk(question);
          setQuestion('');
        }
      }}
    >
      <input
        className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3"
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="E.g.: my cat stopped drinking water"
        value={question}
      />
      <button className="rounded-xl bg-teal-800 px-4 font-bold text-white">
        Ask
      </button>
    </form>
  );
}
