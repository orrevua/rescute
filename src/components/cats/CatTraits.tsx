import type { Cat } from '../../lib/types';

const labels = { sociability: 'Sociability', energy: 'Energy', playfulness: 'Playfulness' } as const;
export function CatTraits({ cat }: { cat: Cat }) { return <dl className="grid gap-4 sm:grid-cols-3">{(Object.keys(labels) as (keyof typeof labels)[]).map((trait) => <div key={trait}><dt className="text-sm font-semibold text-stone-700">{labels[trait]}</dt><dd className="mt-2 flex gap-1">{Array.from({ length: 5 }, (_, index) => <span key={index} aria-label={`${labels[trait]}: ${cat[trait]} of 5`} className={`h-2 flex-1 rounded-full ${index < cat[trait] ? 'bg-teal-700' : 'bg-stone-200'}`} />)}</dd></div>)}</dl>; }
