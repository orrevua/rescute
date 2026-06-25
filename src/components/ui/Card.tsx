import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`relative cartoon-border bg-white paw-trail ${className}`} {...props} />;
}
