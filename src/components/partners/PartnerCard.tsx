import type { Partner } from '@/lib/types';
import { CouponBadge } from './CouponBadge';

export function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="relative cartoon-card p-6 paw-deco">
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
