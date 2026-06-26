import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { PawIcon } from '@/components/ui/PawIcon';

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="relative w-full max-w-sm space-y-6 cartoon-section bg-white p-8 overflow-hidden">
        <PawIcon size={64} className="absolute top-2 right-3 text-teal-800 opacity-20 pointer-events-none" style={{ transform: 'rotate(-25deg)' }} />
        <PawIcon size={48} className="absolute bottom-4 left-4 text-teal-800 opacity-20 pointer-events-none" style={{ transform: 'rotate(15deg)' }} />
        <PawIcon size={36} className="absolute top-1/3 left-2 text-teal-800 opacity-15 pointer-events-none" style={{ transform: 'rotate(-40deg)' }} />
        <PawIcon size={42} className="absolute bottom-1/4 right-6 text-teal-800 opacity-15 pointer-events-none" style={{ transform: 'rotate(35deg)' }} />
        <PawIcon size={28} className="absolute top-6 left-1/3 text-teal-800 opacity-15 pointer-events-none" style={{ transform: 'rotate(10deg)' }} />

        <h1 className="text-center text-2xl font-black tracking-tight text-teal-950">
          Sign In
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
