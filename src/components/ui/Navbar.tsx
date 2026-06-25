'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';

const links: [string, string][] = [
  ['/cats', 'Cats'],
  ['/donate', 'Donate'],
  ['/partners', 'Partners'],
  ['/about', 'About'],
  ['/cat-care', 'Care'],
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <header className="border-b-3 border-teal-950 bg-[#f4f7f4]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-xl font-black text-teal-950 tracking-wider" href="/">
          🐾 RESCUTE
        </Link>
        <div className="flex gap-4 text-sm font-bold">
          {links.map(([href, label]) => (
            <Link
              className={`rounded-full px-3 py-1 transition-all ${
                isActive(href)
                  ? 'bg-teal-800 text-white shadow-[2px_2px_0_#1a3a38]'
                  : 'text-stone-700 hover:bg-teal-100 hover:text-teal-800'
              }`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                className={`rounded-full px-3 py-1 transition-all ${
                  isActive('/dashboard') || isActive('/foster')
                    ? 'bg-teal-800 text-white shadow-[2px_2px_0_#1a3a38]'
                    : 'text-stone-700 hover:bg-teal-100 hover:text-teal-800'
                }`}
                href={user.role === 'protector' ? '/dashboard' : '/foster/applications'}
              >
                Profile
              </Link>
              <button
                className="rounded-full px-3 py-1 text-stone-700 hover:bg-red-100 hover:text-red-700 transition-all"
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link className="rounded-full bg-amber-400 px-3 py-1 font-bold text-stone-950 shadow-[2px_2px_0_#1a3a38] hover:bg-amber-300 transition-all" href="/login">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
