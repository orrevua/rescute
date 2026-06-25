import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="relative w-full max-w-md space-y-6 cartoon-section bg-white p-8 paw-deco">
        <h1 className="text-center text-2xl font-black text-teal-950">
          🐾 Create Account
        </h1>
        <RegisterForm />
        <p className="text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-teal-800 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
