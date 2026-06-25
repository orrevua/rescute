import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t-3 border-teal-950 bg-teal-950 px-6 py-8 text-stone-200">
      <div className="mx-auto flex max-w-6xl justify-between items-center">
        <p className="font-bold">🐾 RESCUTE · more homes, more purrs</p>
        <Link className="rounded-full border-2 border-stone-400 px-4 py-1 text-sm font-bold hover:bg-teal-800 transition-colors" href="/about">
          About
        </Link>
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm opacity-20 tracking-[1em]">
        🐾🐾🐾
      </div>
    </footer>
  );
}
