import Link from 'next/link';
import { PawIcon } from './PawIcon';

interface ActionCardProps {
  href: string;
  label: string;
  image: string;
  imagePosition?: string;
  imageOnRight?: boolean;
  size?: 'large' | 'pill';
}

export function ActionCard({
  href,
  label,
  image,
  imagePosition = 'center',
  imageOnRight = false,
  size = 'large',
}: ActionCardProps) {
  if (size === 'pill') {
    return (
      <Link
        href={href}
        className="group relative flex h-20 overflow-hidden rounded-2xl border-3 border-teal-950 shadow-[4px_4px_0_#1a3a38] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1a3a38]"
      >
        {imageOnRight ? (
          <>
            {/* Green area with label on left */}
            <div className="relative z-10 flex flex-1 items-center overflow-hidden bg-[#4a7c59] pl-6">
              <PawIcon className="absolute -bottom-3 -right-3 text-[#3d6a4b] opacity-40" size={70} style={{ transform: 'rotate(135deg)' }} />
              <span className="relative z-10 text-lg font-black text-white drop-shadow-sm">{label}</span>
            </div>
            {/* Image on right with gradient fade */}
            <div className="relative w-2/5 flex-shrink-0">
              <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ objectPosition: imagePosition }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, #4a7c59 0%, transparent 50%)',
                }}
              />
            </div>
          </>
        ) : (
          <>
            {/* Image on left with gradient fade */}
            <div className="relative w-2/5 flex-shrink-0">
              <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ objectPosition: imagePosition }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to left, #4a7c59 0%, transparent 50%)',
                }}
              />
            </div>
            {/* Green area with label on right */}
            <div className="relative z-10 flex flex-1 items-center justify-end overflow-hidden bg-[#4a7c59] pr-6">
              <PawIcon className="absolute -bottom-3 -right-3 text-[#3d6a4b] opacity-40" size={70} style={{ transform: 'rotate(135deg)' }} />
              <span className="relative z-10 text-lg font-black text-white drop-shadow-sm">{label}</span>
            </div>
          </>
        )}
      </Link>
    );
  }

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
      <PawIcon className="absolute right-16 bottom-4 text-[#152e2c] opacity-25" size={80} />
      <div className="absolute inset-0 flex items-center justify-end pr-8">
        <span className="text-2xl font-black text-white drop-shadow-lg transition-transform duration-300 group-hover:translate-x-1">
          {label}
        </span>
      </div>
    </Link>
  );
}
