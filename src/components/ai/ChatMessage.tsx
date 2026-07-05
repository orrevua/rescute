export function ChatMessage({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="space-y-3">
      <p className="ml-auto max-w-[85%] rounded-2xl bg-amber-100 p-4 text-stone-800">{question}</p>
      <p className="max-w-[85%] rounded-2xl bg-white p-4 text-stone-700 shadow-sm">{answer}</p>
    </div>
  );
}
