import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { REFRESH_COOKIE, clearRefreshCookie, setRefreshCookie } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ detail: 'No refresh token' }, { status: 401 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    return NextResponse.json({ detail: 'Authentication service unavailable' }, { status: 502 });
  }

  if (!backendRes.ok) {
    const response = NextResponse.json({ detail: 'Invalid token' }, { status: 401 });
    clearRefreshCookie(response);
    return response;
  }

  const data = await backendRes.json();
  const response = NextResponse.json({ access_token: data.access_token });
  setRefreshCookie(response, data.refresh_token);
  return response;
}
