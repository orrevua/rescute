import Image from 'next/image';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
      <Image
        src="/hero-kittens.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(26,58,56,0.93) 0%, rgba(26,58,56,0.8) 35%, rgba(26,58,56,0.45) 65%, rgba(26,58,56,0.15) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: 'linear-gradient(to top, #f5f0e1 0%, transparent 100%)',
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-8 py-24" style={{ minHeight: '520px' }}>
        <p className="text-sm font-black tracking-[.3em] text-amber-300">A NEW BEGINNING</p>
        <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight text-white drop-shadow-lg sm:text-4xl">
          Every cat deserves a corner of the world to call their own.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-teal-100 drop-shadow-md">
          Meet cats, embrace their stories, and support those who care for them every day.
        </p>
      </div>
    </section>
  );
}
