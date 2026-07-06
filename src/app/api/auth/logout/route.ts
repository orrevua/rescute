import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clearRefreshCookie } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (authorization) {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: authorization },
    }).catch(() => {});
  }

  const response = new NextResponse(null, { status: 204 });
  clearRefreshCookie(response);
  return response;
}
