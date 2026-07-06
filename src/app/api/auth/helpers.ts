import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const REFRESH_COOKIE = 'refresh-token';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const;

export function setRefreshCookie(response: NextResponse, token: string): void {
  response.cookies.set(REFRESH_COOKIE, token, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
}

export function clearRefreshCookie(response: NextResponse): void {
  response.cookies.set(REFRESH_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}

export async function proxyCredentials(request: NextRequest, backendPath: string): Promise<NextResponse> {
  const body = await request.json();

  let backendRes: Response;
  try {
    backendRes = await fetch(`${API_URL}${backendPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ detail: 'Authentication service unavailable' }, { status: 502 });
  }

  const data = await backendRes.json().catch(() => null);
  if (!backendRes.ok) {
    return NextResponse.json(data ?? { detail: 'Authentication failed' }, { status: backendRes.status });
  }

  const response = NextResponse.json({ user: data.user, access_token: data.access_token });
  setRefreshCookie(response, data.refresh_token);
  return response;
}
