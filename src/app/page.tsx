import Link from 'next/link';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { ActionCard } from '@/components/ui/ActionCard';
import { PawIcon } from '@/components/ui/PawIcon';

export default function Home() {
  return (
    <div>
      <HeroBanner />

      <div className="mx-auto max-w-6xl px-6 -mt-8 relative z-10">
        <section className="flex flex-col gap-4 md:flex-row [&>*]:md:flex-1">
          <ActionCard
            href="/donate"
            label="Make a donation"
            image="/hero-kittens.jpg"
            imagePosition="right bottom"
            size="pill"
            imageOnRight={true}
          />
          <ActionCard
            href="/foster/apply"
            label="Be a foster home"
            image="/hero-kittens.jpg"
            imagePosition="left center"
            size="pill"
            imageOnRight={false}
          />
          <Link
            href="/cats"
            className="group relative flex h-20 items-center justify-center overflow-hidden rounded-2xl bg-amber-400 shadow-[0_0_0_3px_#1a3a38,4px_4px_0_#1a3a38] text-lg font-black text-stone-950 transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-amber-300 hover:shadow-[0_0_0_3px_#1a3a38,6px_6px_0_#1a3a38]"
          >
            <PawIcon className="absolute -bottom-5 -right-5 text-amber-500 opacity-40" size={80} style={{ transform: 'rotate(-45deg)' }} />
            <span className="relative z-10">I want to adopt</span>
          </Link>
        </section>

        {/* About section */}
        <section className="mt-16 cartoon-card bg-white relative overflow-hidden p-10">
          <PawIcon size={56} className="absolute top-3 right-4 text-teal-800 opacity-20 pointer-events-none" style={{ transform: 'rotate(-20deg)' }} />
          <PawIcon size={40} className="absolute bottom-4 left-6 text-teal-800 opacity-20 pointer-events-none" style={{ transform: 'rotate(25deg)' }} />
          <PawIcon size={32} className="absolute top-1/2 right-1/4 text-teal-800 opacity-15 pointer-events-none" style={{ transform: 'rotate(-35deg)' }} />
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-teal-950">About Rescute</h2>
          </div>
          <div className="mt-5 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Adopt with care</h3>
              <p className="mt-2 text-stone-600">
                Get to know each personality before choosing. Every cat has their own story waiting to continue with you.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Offer a foster home</h3>
              <p className="mt-2 text-stone-600">
                Your space can be the bridge to a fresh start. Temporary shelter makes a permanent difference.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Strengthen the network</h3>
              <p className="mt-2 text-stone-600">
                Donations keep the care going. Every contribution helps feed, heal, and shelter cats in need.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom action row */}
        <section className="mt-12 mb-16 grid gap-6 md:grid-cols-2">
          <ActionCard
            href="/cats"
            label="Meet our cats"
            image="/Cat-on-couch.jpg"
            size="large"
          />
          <Link
            href="/partners"
            className="group relative flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-amber-400 shadow-[0_0_0_3px_#1a3a38,5px_5px_0_#1a3a38] transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-amber-300 hover:shadow-[0_0_0_3px_#1a3a38,7px_7px_0_#1a3a38]"
          >
            <PawIcon className="absolute -bottom-6 -right-6 text-amber-500 opacity-40" size={120} style={{ transform: 'rotate(-45deg)' }} />
            <span className="relative z-10 text-2xl font-black text-stone-950 drop-shadow-lg transition-transform duration-300 group-hover:translate-x-1">
              Our purrtners
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
