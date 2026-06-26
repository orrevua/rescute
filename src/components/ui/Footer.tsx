import Link from 'next/link';
import { RescuteLogo } from './RescuteLogo';
import { PawIcon } from './PawIcon';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t-3 border-teal-950 bg-teal-950 px-6 py-8 text-stone-200 shadow-[0_-3px_0_#1a3a38]">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <RescuteLogo height={24} className="brightness-200" />
          <span className="text-sm text-stone-400">· more homes, more purrs</span>
        </div>
        <Link className="cartoon-btn border-stone-300 bg-transparent px-5 py-1.5 text-stone-200 hover:bg-teal-800" href="/about">
          About
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-6 opacity-20">
        {[...Array(5)].map((_, i) => (
          <PawIcon key={i} size={24} className="text-stone-300" style={{ transform: `rotate(${-15 + i * 8}deg)` }} />
        ))}
      </div>
    </footer>
  );
}
