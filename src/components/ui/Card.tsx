import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`cartoon-card relative bg-white ${className}`} {...props} />;
}
