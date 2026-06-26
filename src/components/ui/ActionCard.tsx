import Image from 'next/image';
import Link from 'next/link';
import { PawIcon } from './PawIcon';

interface ActionCardProps {
  href: string;
  label: string;
  image: string;
  imagePosition?: string;
  imageOnRight?: boolean;
  size?: 'large' | 'pill';
  clean?: boolean;
}

export function ActionCard({
  href,
  label,
  image,
  imagePosition = 'center',
  imageOnRight = false,
  size = 'large',
  clean = false,
}: ActionCardProps) {
  if (size === 'pill') {
    return (
      <Link
        href={href}
        className="group relative flex h-20 items-center justify-center overflow-hidden rounded-2xl bg-[#3d6a4b] shadow-[0_0_0_3px_#1a3a38,4px_4px_0_#1a3a38] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-[#4a7c59] hover:shadow-[0_0_0_3px_#1a3a38,6px_6px_0_#1a3a38]"
      >
        <PawIcon className="absolute -bottom-5 -right-5 text-[#2d5a3e] opacity-40" size={80} style={{ transform: 'rotate(-45deg)' }} />
        <span className="relative z-10 text-lg font-black text-white drop-shadow-sm">{label}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className="group relative block h-56 overflow-hidden rounded-3xl bg-[#1a3a38] shadow-[0_0_0_3px_#1a3a38,5px_5px_0_#1a3a38] transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[0_0_0_3px_#1a3a38,7px_7px_0_#1a3a38]">
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ objectPosition: imagePosition }}
        aria-hidden="true"
      />
      {!clean && (
        <div
          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, transparent 25%, rgba(26,58,56,0.6) 50%, rgba(26,58,56,0.95) 75%, #1a3a38 100%)',
          }}
        />
      )}
      {!clean && <PawIcon className="absolute right-16 bottom-4 text-[#152e2c] opacity-25" size={80} />}
      <div className="absolute inset-0 flex items-center justify-end pr-8">
        <span className="text-2xl font-black text-white drop-shadow-lg transition-transform duration-300 group-hover:translate-x-1">
          {label}
        </span>
      </div>
    </Link>
  );
}
