import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border-3 border-teal-950 bg-teal-950 px-8 py-16 text-white shadow-[6px_6px_0_#1a3a38]">
      <div className="absolute -top-4 -right-4 text-6xl opacity-10 rotate-12">🐾</div>
      <div className="absolute bottom-6 left-8 text-4xl opacity-10 -rotate-15">🐾</div>
      <p className="font-bold tracking-[.2em] text-amber-300">A NEW BEGINNING</p>
      <h1 className="mt-3 max-w-3xl text-5xl font-black">
        Every cat deserves a corner of the world to call their own.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-teal-50">
        Meet cats, embrace their stories, and support those who care for them every day.
      </p>
      <div className="mt-8 flex gap-3">
        <Link className="rounded-full border-2 border-amber-400 bg-amber-400 px-6 py-3 font-bold text-stone-950 shadow-[3px_3px_0_#1a3a38] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1a3a38]" href="/cats">
          I want to adopt 🐾
        </Link>
        <Link className="rounded-full border-2 border-white px-6 py-3 font-bold shadow-[3px_3px_0_rgba(255,255,255,0.2)] transition hover:bg-white/10" href="/donate">
          I want to help
        </Link>
      </div>
    </section>
  );
}
