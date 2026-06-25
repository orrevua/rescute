import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t-3 border-teal-950 bg-teal-950 px-6 py-8 text-stone-200 shadow-[0_-3px_0_#1a3a38]">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-lg font-black tracking-wide">🐾 RESCUTE · more homes, more purrs</p>
        <Link className="cartoon-btn border-stone-300 bg-transparent px-5 py-1.5 text-stone-200 hover:bg-teal-800" href="/about">
          About
        </Link>
      </div>
      <div className="mt-4 text-center text-2xl opacity-20 tracking-[1.5em]">
        🐾🐾🐾🐾🐾
      </div>
    </footer>
  );
}
