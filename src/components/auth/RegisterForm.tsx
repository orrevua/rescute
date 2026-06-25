'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/lib/types';
import { RoleSelect } from './RoleSelect';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select an account type.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const profileData =
      role === 'protector'
        ? { org_name: orgName, description, phone, city, state }
        : { full_name: fullName, phone, city, state };

    setSubmitting(true);
    try {
      await register(email, password, role, profileData);
      router.push(role === 'protector' ? '/dashboard' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-stone-700">
          Account type
        </legend>
        <RoleSelect value={role} onChange={setRole} />
      </fieldset>

      <div className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={setEmail} required />
        <Input label="Password" type="password" value={password} onChange={setPassword} required />
        <Input label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} required />
      </div>

      {role === 'protector' && (
        <div className="space-y-4">
          <Input label="Organization Name" value={orgName} onChange={setOrgName} required />
          <Input label="Description" value={description} onChange={setDescription} />
          <Input label="Phone" value={phone} onChange={setPhone} />
          <Input label="City" value={city} onChange={setCity} />
          <Input label="State" value={state} onChange={setState} />
        </div>
      )}

      {role === 'foster' && (
        <div className="space-y-4">
          <Input label="Full Name" value={fullName} onChange={setFullName} required />
          <Input label="Phone" value={phone} onChange={setPhone} required />
          <Input label="City" value={city} onChange={setCity} required />
          <Input label="State" value={state} onChange={setState} required />
        </div>
      )}

      {error && (
        <p className="text-sm font-bold text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cartoon-btn w-full bg-teal-800 px-4 py-2.5 text-sm text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {submitting ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}

function Input({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-stone-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="cartoon-input w-full px-3 py-2 text-sm"
      />
    </label>
  );
}
