import { HeroBanner } from '@/components/ui/HeroBanner';
import { ActionCard } from '@/components/ui/ActionCard';

export default function Home() {
  return (
    <main className="bg-[#f4f7f4]">
      <HeroBanner />

      <div className="mx-auto max-w-6xl px-6 -mt-8 relative z-10">
        {/* Action cards */}
        <section className="grid gap-6 md:grid-cols-3">
          <ActionCard
            href="/cats"
            label="I want to adopt"
            image="/hero-kittens.jpg"
            imagePosition="center 40%"
          />
          <ActionCard
            href="/donate"
            label="Make a donation"
            image="/hero-kittens.jpg"
            imagePosition="left center"
          />
          <ActionCard
            href="/foster/apply"
            label="Be a foster home"
            image="/hero-kittens.jpg"
            imagePosition="right center"
          />
        </section>

        {/* About section */}
        <section className="mt-16 cartoon-card relative paw-deco p-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐾</span>
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
            image="/hero-kittens.jpg"
            imagePosition="center 30%"
          />
          <ActionCard
            href="/partners"
            label="Our partners"
            image="/hero-kittens.jpg"
            imagePosition="center 60%"
          />
        </section>
      </div>
    </main>
  );
}
