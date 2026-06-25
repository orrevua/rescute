import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden cartoon-section bg-teal-950 px-10 py-20 text-white">
      <div className="absolute -top-2 right-8 text-7xl opacity-20 rotate-12 pointer-events-none">🐾</div>
      <div className="absolute bottom-4 left-6 text-5xl opacity-15 -rotate-20 pointer-events-none">🐾</div>
      <div className="absolute top-1/2 right-1/4 text-3xl opacity-10 rotate-45 pointer-events-none">🐾</div>
      <p className="text-sm font-black tracking-[.3em] text-amber-300">A NEW BEGINNING</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight">
        Every cat deserves a corner of the world to call their own.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-teal-100">
        Meet cats, embrace their stories, and support those who care for them every day.
      </p>
      <div className="mt-10 flex gap-4">
        <Link className="cartoon-btn bg-amber-400 px-7 py-3 text-lg text-stone-950 hover:bg-amber-300" href="/cats">
          I want to adopt 🐾
        </Link>
        <Link className="cartoon-btn border-white bg-transparent px-7 py-3 text-lg text-white hover:bg-white/10" href="/donate">
          I want to help
        </Link>
      </div>
    </section>
  );
}
