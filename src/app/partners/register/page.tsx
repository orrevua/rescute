import Link from 'next/link';
import { PartnerForm } from '@/components/partners/PartnerForm';

export default function RegisterPartnerPage() {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link className="text-sm font-semibold text-teal-700 hover:underline" href="/partners">
          ← Back to purrtners
        </Link>
        <p className="font-bold tracking-[.2em] text-teal-700">JOIN THE NETWORK</p>
        <h1 className="mt-2 text-4xl font-bold text-stone-900">Register your business.</h1>
        <p className="mt-3 text-stone-600">
          Become a Rescute purrtner and offer discounts to adopters while supporting cat rescue.
        </p>
        <div className="mt-8">
          <PartnerForm />
        </div>
      </div>
    </div>
  );
}
