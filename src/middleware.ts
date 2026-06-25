import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/dashboard', '/foster'];

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isLoggedIn = !!request.cookies.get('session-token')?.value;
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
