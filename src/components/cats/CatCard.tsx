import Image from 'next/image';
import Link from 'next/link';
import type { Cat } from '@/lib/types';
import { resolvePhotoUrl } from '@/lib/api/client';
import { placeholderGradient } from '@/lib/catPlaceholder';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CardHealthBadges } from '@/components/cats/CardHealthBadges';

export function CatCard({ cat }: { cat: Cat }) {
  const years =
    cat.age_months < 12
      ? `${cat.age_months} months`
      : `${Math.floor(cat.age_months / 12)} ${cat.age_months < 24 ? 'year' : 'years'}`;

  return (
    <div className="cat-card-wrapper group">
      <Card className="cat-card-inner overflow-hidden transition duration-200">
        {cat.photos.length > 0 ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={resolvePhotoUrl(cat.photos[0])}
              alt={cat.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            {cat.photos.length > 1 && (
              <span className="absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold text-white">
                +{cat.photos.length - 1}
              </span>
            )}
          </div>
        ) : (
          <div
            className="flex h-48 items-center justify-center text-7xl transition duration-300 group-hover:scale-105"
            style={{ backgroundImage: placeholderGradient(cat.name) }}
          >
            🐈
          </div>
        )}
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900">{cat.name}</h2>
              <p className="text-sm text-stone-600">
                {years} · {cat.city}, {cat.state}
              </p>
            </div>
            {cat.ready_for_adoption && <Badge className="bg-teal-100 text-teal-800">Ready</Badge>}
          </div>
          <p className="line-clamp-2 text-sm text-stone-600">
            {cat.personality || 'A companion waiting for a home full of love.'}
          </p>
          <Link
            className="cartoon-btn inline-flex border-2 bg-teal-800 px-4 py-1.5 text-sm text-white hover:bg-teal-700"
            href={`/cats/${cat.id}`}
          >
            Meet {cat.name}
          </Link>
        </div>
      </Card>
      <CardHealthBadges cat={cat} />
    </div>
  );
}
