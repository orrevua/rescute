'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Something slipped away here.</h1>

        <button className="cartoon-btn mt-5 bg-teal-800 px-4 py-2 text-white" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
