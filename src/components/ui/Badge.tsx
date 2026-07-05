import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`border-ink inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-extrabold shadow-[2px_2px_0_var(--cartoon-ink)] ${className}`}
      {...props}
    />
  );
}
