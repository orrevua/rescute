import Link from 'next/link';
import type { Cat } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function CatCard({ cat }: { cat: Cat }) {
  const years = cat.age_months < 12 ? `${cat.age_months} months` : `${Math.floor(cat.age_months / 12)} ${cat.age_months < 24 ? 'year' : 'years'}`;
  return <Card className="group overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div className="flex h-44 items-center justify-center bg-[radial-gradient(circle_at_35%_30%,#fef3c7_0,transparent_30%),linear-gradient(135deg,#b8d9d0,#e7f0ed)] text-7xl transition duration-300 group-hover:scale-105">🐈</div>
    <div className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-stone-900">{cat.name}</h2><p className="text-sm text-stone-600">{years} · {cat.city}, {cat.state}</p></div>{cat.ready_for_adoption && <Badge className="bg-teal-100 text-teal-800">Ready</Badge>}</div><p className="line-clamp-2 text-sm text-stone-600">{cat.personality || 'A companion waiting for a home full of love.'}</p><Link className="cursor-pointer inline-flex font-semibold text-teal-800 underline-offset-4 hover:underline" href={`/cats/${cat.id}`}>Meet {cat.name}</Link></div>
  </Card>;
}
