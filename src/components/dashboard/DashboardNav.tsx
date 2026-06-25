'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items: [string, string][] = [
  ['/dashboard', 'Overview'],
  ['/dashboard/cats', 'My cats'],
  ['/dashboard/cats/new', 'Register cat'],
  ['/dashboard/applications', 'Applications'],
  ['/dashboard/donations', 'Donations'],
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-bold transition-colors ${active ? 'bg-teal-800 text-white' : 'text-teal-950 hover:bg-teal-100'}`}
            href={href}
            key={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
