import type { Partner } from '@/lib/types';
import { CouponBadge } from './CouponBadge';
import { PawIcon } from '@/components/ui/PawIcon';

export function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="relative cartoon-card bg-white p-6 overflow-hidden">
      <PawIcon size={52} className="absolute top-2 right-3 text-teal-800 opacity-20 pointer-events-none" style={{ transform: 'rotate(-25deg)' }} />
      <PawIcon size={36} className="absolute bottom-3 left-4 text-teal-800 opacity-15 pointer-events-none" style={{ transform: 'rotate(18deg)' }} />
      <h2 className="text-xl font-black text-stone-900">{partner.name}</h2>
      <p className="mt-2 text-stone-600">{partner.description}</p>
      <p className="mt-4 text-sm font-bold text-stone-600">
        {partner.address} · {partner.city}/{partner.state}
      </p>
      <div className="mt-4">
        <CouponBadge code={partner.coupon_code} discount={partner.discount_pct} />
      </div>
    </article>
  );
}
