'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { RescuteLogo } from './RescuteLogo';

const links: [string, string][] = [
  ['/cats', 'Cats'],
  ['/donate', 'Donate'],
  ['/partners', 'Purrtners'],
  ['/about', 'About'],
  ['/cat-care', 'Care'],
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="border-ink relative border-b-3 bg-[#f5f0e1] shadow-[0_3px_0_var(--cartoon-ink)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="flex items-center" href="/">
          <RescuteLogo height={30} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 text-sm font-extrabold md:flex">
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
                href={user.role === 'protector' ? '/dashboard/profile' : '/foster/profile'}
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
            <Link
              className="cartoon-btn bg-amber-400 px-4 py-1.5 text-stone-950 hover:bg-amber-300"
              href="/login"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Hamburger button */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block h-0.5 w-6 rounded bg-teal-950 transition-transform duration-300 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded bg-teal-950 transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded bg-teal-950 transition-transform duration-300 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={closeMenu} />}

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col gap-3 bg-[#f5f0e1] p-6 pt-20 shadow-[-4px_0_12px_rgba(0,0,0,0.15)] transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {links.map(([href, label]) => (
          <Link
            className={`cartoon-btn w-full px-4 py-2.5 text-center text-sm font-extrabold ${
              isActive(href) ? 'bg-teal-800 text-white' : 'bg-white text-stone-800 hover:bg-teal-50'
            }`}
            href={href}
            key={href}
            onClick={closeMenu}
          >
            {label}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              className={`cartoon-btn w-full px-4 py-2.5 text-center text-sm font-extrabold ${
                isActive('/dashboard') || isActive('/foster')
                  ? 'bg-teal-800 text-white'
                  : 'bg-white text-stone-800 hover:bg-teal-50'
              }`}
              href={user.role === 'protector' ? '/dashboard/profile' : '/foster/profile'}
              onClick={closeMenu}
            >
              Profile
            </Link>
            <button
              className="cartoon-btn w-full bg-white px-4 py-2.5 text-sm font-extrabold text-red-700 hover:bg-red-50"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            className="cartoon-btn w-full bg-amber-400 px-4 py-2.5 text-center text-sm font-extrabold text-stone-950 hover:bg-amber-300"
            href="/login"
            onClick={closeMenu}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
