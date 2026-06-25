import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-bold tracking-tight text-zinc-900">
          Sign In
        </h1>

        <LoginForm />

        <p className="text-center text-sm text-zinc-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-zinc-900 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
