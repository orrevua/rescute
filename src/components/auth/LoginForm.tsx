'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch {
      setError('Incorrect email or password.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-stone-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="cartoon-input mt-1 block w-full px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-stone-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="cartoon-input mt-1 block w-full px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="cartoon-btn w-full bg-teal-800 px-4 py-2.5 text-sm text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {submitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
