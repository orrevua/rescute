'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';

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
    <header className="border-b bg-[#f4f7f4]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-xl font-black text-teal-950" href="/">RESCUTE</Link>
        <div className="flex gap-4 text-sm font-semibold">
          {links.map(([href, label]) => (
            <Link
              className={`cursor-pointer transition-colors ${isActive(href) ? 'text-teal-700 underline underline-offset-4' : 'text-stone-700 hover:text-teal-700'}`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                className={`cursor-pointer transition-colors ${isActive('/dashboard') || isActive('/foster') ? 'text-teal-700 underline underline-offset-4' : 'text-stone-700 hover:text-teal-700'}`}
                href={user.role === 'protector' ? '/dashboard' : '/foster/applications'}
              >
                Profile
              </Link>
              <button className="cursor-pointer text-stone-700 hover:text-teal-700 transition-colors" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <Link className="cursor-pointer text-stone-700 hover:text-teal-700 transition-colors" href="/login">Sign In</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
