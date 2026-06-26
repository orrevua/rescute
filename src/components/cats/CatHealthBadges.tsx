import type { Cat } from '../../lib/types';
import { Badge } from '../ui/Badge';

export function CatHealthBadges({ cat }: { cat: Cat }) {
  const facts = [
    ['Neutered', cat.castrated],
    ['Vaccinated', cat.vaccinated],
    ['Dewormed', cat.dewormed],
    ['FIV-', cat.fiv_status],
    ['FeLV-', cat.felv_status],
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {facts.map(([label, ok]) => (
        <Badge
          key={label as string}
          className={
            ok ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-600'
          }
        >
          {label as string}
        </Badge>
      ))}
    </div>
  );
}
