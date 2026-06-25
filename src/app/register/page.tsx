import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl font-bold text-zinc-900">
          Create Account
        </h1>
        <RegisterForm />
        <p className="text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-900 underline hover:no-underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
