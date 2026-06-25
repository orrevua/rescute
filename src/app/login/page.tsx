import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="relative w-full max-w-sm space-y-6 cartoon-section bg-white p-8 paw-deco">
        <h1 className="text-center text-2xl font-black tracking-tight text-teal-950">
          🐾 Sign In
        </h1>

        <LoginForm />

        <p className="text-center text-sm text-stone-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-teal-800 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
