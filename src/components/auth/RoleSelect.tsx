'use client';

import { UserRole } from '@/lib/types';

interface RoleSelectProps {
  value: UserRole | null;
  onChange: (role: UserRole) => void;
}

const roles: { value: UserRole; label: string; subtitle: string }[] = [
  {
    value: 'protector',
    label: 'Protector',
    subtitle: 'Register cats for adoption',
  },
  {
    value: 'foster',
    label: 'Foster Home',
    subtitle: 'Temporarily shelter cats',
  },
];

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => (
        <button
          key={role.value}
          type="button"
          onClick={() => onChange(role.value)}
          className={`cartoon-card p-4 text-left ${
            value === role.value ? '!border-teal-800 bg-teal-50' : 'bg-white hover:bg-stone-50'
          }`}
        >
          <span className="block font-bold text-stone-900">{role.label}</span>
          <span className="mt-1 block text-sm text-stone-500">{role.subtitle}</span>
        </button>
      ))}
    </div>
  );
}
