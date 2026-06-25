'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { RescuteLogo } from './RescuteLogo';

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
    <header className="border-b-3 border-teal-950 bg-[#f4f7f4] shadow-[0_3px_0_#1a3a38]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="flex items-center" href="/">
          <RescuteLogo height={30} />
        </Link>
        <div className="flex items-center gap-2 text-sm font-extrabold">
          {links.map(([href, label]) => (
            <Link
              className={`cartoon-btn px-4 py-1.5 ${
                isActive(href)
                  ? 'bg-teal-800 text-white'
                  : 'bg-white text-stone-800 hover:bg-teal-50'
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
                className={`cartoon-btn px-4 py-1.5 ${
                  isActive('/dashboard') || isActive('/foster')
                    ? 'bg-teal-800 text-white'
                    : 'bg-white text-stone-800 hover:bg-teal-50'
                }`}
                href={user.role === 'protector' ? '/dashboard' : '/foster/applications'}
              >
                Profile
              </Link>
              <button
                className="cartoon-btn bg-white px-4 py-1.5 text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link className="cartoon-btn bg-amber-400 px-4 py-1.5 text-stone-950 hover:bg-amber-300" href="/login">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
