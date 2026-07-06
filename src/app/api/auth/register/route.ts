import type { NextRequest } from 'next/server';
import { proxyCredentials } from '../helpers';

export async function POST(request: NextRequest) {
  return proxyCredentials(request, '/auth/register');
}
