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
          className={`rounded-lg border-2 p-4 text-left transition-colors ${
            value === role.value
              ? 'border-zinc-900 bg-zinc-50'
              : 'border-zinc-200 hover:border-zinc-400'
          }`}
        >
          <span className="block font-medium text-zinc-900">{role.label}</span>
          <span className="mt-1 block text-sm text-zinc-500">
            {role.subtitle}
          </span>
        </button>
      ))}
    </div>
  );
}
