'use client';

import type { Cat } from '../../lib/types';

const BADGES: { label: string; field: (c: Cat) => boolean }[] = [
  { label: 'Neutered', field: (c) => c.castrated },
  { label: 'Vaccinated', field: (c) => c.vaccinated },
  { label: 'Dewormed', field: (c) => c.dewormed },
  { label: 'FIV-', field: (c) => !c.fiv_status },
  { label: 'FeLV-', field: (c) => !c.felv_status },
];

function DropSvg() {
  return (
    <svg viewBox="0 0 32 42" className="drop-svg" fill="#0d9488">
      <path d="M16 0 C16 0 0 22 0 30 A16 12 0 0 0 32 30 C32 22 16 0 16 0Z" />
    </svg>
  );
}

export function CardHealthBadges({ cat }: { cat: Cat }) {
  const active = BADGES.filter((b) => b.field(cat));

  return (
    <div className="card-badges">
      {active.map((b, i) => (
        <div key={b.label} className="card-badge-slot" style={{ '--i': i } as React.CSSProperties}>
          <span className="card-badge-drop"><DropSvg /></span>
          <span className="card-badge-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
