'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items: [string, string][] = [
  ['/dashboard', 'Overview'],
  ['/dashboard/cats', 'My cats'],
  ['/dashboard/cats/new', 'Register cat'],
  ['/dashboard/applications', 'Applications'],
  ['/dashboard/donations', 'Donations'],
  ['/dashboard/intents', 'Intents'],
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            className={`rounded-full px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#1a3a38] transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#1a3a38] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#1a3a38] ${
              active
                ? 'bg-teal-800 text-white'
                : 'bg-white text-teal-950 hover:bg-teal-50'
            }`}
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
