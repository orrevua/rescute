import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`relative cartoon-card bg-white ${className}`} {...props} />;
}
