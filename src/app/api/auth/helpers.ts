import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const REFRESH_COOKIE = 'refresh-token';
// JS-readable hint that a session exists, so the client can skip the silent
// refresh on anonymous page loads. Carries no token — presence only.
export const SESSION_HINT_COOKIE = 'has-session';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const;

const hintOptions = { ...cookieOptions, httpOnly: false } as const;

export function setRefreshCookie(response: NextResponse, token: string): void {
  response.cookies.set(REFRESH_COOKIE, token, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
  response.cookies.set(SESSION_HINT_COOKIE, '1', { ...hintOptions, maxAge: REFRESH_MAX_AGE });
}

export function clearRefreshCookie(response: NextResponse): void {
  response.cookies.set(REFRESH_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set(SESSION_HINT_COOKIE, '', { ...hintOptions, maxAge: 0 });
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
