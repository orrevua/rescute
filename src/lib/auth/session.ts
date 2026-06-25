import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;
  if (!token) return null;
  return { id: '123', name: 'User Profile' };
}

export async function requireAuth() {
  const session = await getUserSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}
