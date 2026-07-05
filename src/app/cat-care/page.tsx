'use client';

import { useEffect, useRef, useState } from 'react';
import { FAQAccordion } from '@/components/ai/FAQAccordion';
import { chatWithAI, getAIState, getFaq, type ChatMessage } from '@/lib/api/ai-care';
import type { FAQItem } from '@/lib/types';

export default function CatCarePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Rescute assistant. Ask me anything about cat care — nutrition, health, behavior, and much more.",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getAIState()
      .then(setEnabled)
      .catch(() => {});
    getFaq()
      .then(setFaq)
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      const history = next.filter((_, i) => i > 0);
      const reply = await chatWithAI(history);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `Sorry, an error occurred. ${e instanceof Error ? e.message : 'Please try again.'}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-bold tracking-[.2em] text-teal-700">CAT CARE</p>
        <h1 className="mt-2 text-4xl font-bold text-stone-900">
          One question at a time, with care.
        </h1>
        <p className="mt-3 text-stone-600">
          Helpful tips for everyday life. In emergencies, please see a veterinarian.
        </p>

        <div
          className="cartoon-section mt-8 flex flex-col overflow-hidden bg-white"
          style={{ height: '500px' }}
        >
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`border-ink max-w-[85%] rounded-2xl border-2 p-4 whitespace-pre-wrap shadow-[2px_2px_0_var(--cartoon-ink)] ${
                    m.role === 'user'
                      ? 'bg-amber-100 text-stone-800'
                      : 'bg-[#f0fdf8] text-stone-700'
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <p className="border-ink rounded-2xl border-2 bg-[#f0fdf8] p-4 text-stone-500 shadow-[2px_2px_0_var(--cartoon-ink)]">
                  Thinking carefully...
                </p>
              </div>
            )}
          </div>

          {enabled ? (
            <div className="border-ink flex gap-2 border-t-3 p-4">
              <textarea
                className="cartoon-input min-w-0 flex-1 resize-none bg-white px-4 py-3 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="E.g.: my cat stopped drinking water"
                rows={2}
              />
              <button
                className="cartoon-btn border-2 bg-teal-800 px-5 font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                onClick={send}
                disabled={sending || !input.trim()}
                type="button"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="border-ink border-t-3 p-4 text-center text-stone-500">
              AI assistant not configured. Add{' '}
              <code className="rounded bg-stone-100 px-1 text-sm font-bold">AI_PROVIDER_KEY</code>{' '}
              to{' '}
              <code className="rounded bg-stone-100 px-1 text-sm font-bold">rescute-api/.env</code>.
            </div>
          )}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900">Frequently asked questions</h2>
          <div className="cartoon-section mt-4 bg-white p-6">
            {faq.map((item) => (
              <FAQAccordion item={item} key={item.question} />
            ))}
            {faq.length === 0 && <p className="text-stone-500">No FAQs available yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
