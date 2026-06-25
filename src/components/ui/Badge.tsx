import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full border-2 border-teal-950 px-3 py-1 text-xs font-bold shadow-[2px_2px_0_#1a3a38] ${className}`} {...props} />;
}
