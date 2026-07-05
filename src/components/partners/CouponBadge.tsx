export function CouponBadge({ code, discount }: { code?: string; discount?: number }) {
  if (!code && !discount) return null;
  return (
    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
      {discount ? `${discount}% off` : `Coupon ${code}`}
    </span>
  );
}
