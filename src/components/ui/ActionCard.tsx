import Link from 'next/link';

interface ActionCardProps {
  href: string;
  label: string;
  image: string;
  imagePosition?: string;
}

export function ActionCard({ href, label, image, imagePosition = 'center' }: ActionCardProps) {
  return (
    <Link href={href} className="group relative block h-56 overflow-hidden cartoon-card">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ objectPosition: imagePosition }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, transparent 25%, rgba(26,58,56,0.6) 50%, rgba(26,58,56,0.95) 75%, #1a3a38 100%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-end pr-8">
        <span className="text-2xl font-black text-white drop-shadow-lg transition-transform duration-300 group-hover:translate-x-1">
          {label}
        </span>
      </div>
    </Link>
  );
}
