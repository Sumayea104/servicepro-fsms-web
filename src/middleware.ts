import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, ROLE_HOME, ROLE_PREFIXES, API_URL } from '@/lib/constants';
import { decodeToken, isExpired } from '@/lib/jwt';

const AUTH_PAGES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  let claims = decodeToken(access);
  let rotated: { accessToken: string; refreshToken: string } | null = null;

  // Access token missing/expired but a refresh token exists: rotate here. Middleware is the one place
  // that can both call the backend and write cookies before Server Components render, so pages
  // fetched on the server always see a fresh token.
  if (isExpired(claims) && refresh && !isExpired(decodeToken(refresh))) {
    try {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (res.ok) {
        rotated = (await res.json()).data;
        claims = decodeToken(rotated!.accessToken);
      }
    } catch {
      // backend unreachable — treat as logged out below
    }
  }

  const loggedIn = !isExpired(claims);
  const prefix = Object.keys(ROLE_PREFIXES).find((p) => pathname === p || pathname.startsWith(`${p}/`));

  let response: NextResponse;

  if (prefix) {
    if (!loggedIn) {
      const url = new URL('/login', request.url);
      url.searchParams.set('next', pathname);
      response = NextResponse.redirect(url);
    } else if (claims!.role !== ROLE_PREFIXES[prefix]) {
      // Logged in, wrong role: send them to their own dashboard rather than a dead end.
      response = NextResponse.redirect(new URL(ROLE_HOME[claims!.role], request.url));
    } else {
      response = NextResponse.next(rotated ? withCookies(request, rotated) : undefined);
    }
  } else if (loggedIn && AUTH_PAGES.includes(pathname)) {
    response = NextResponse.redirect(new URL(ROLE_HOME[claims!.role], request.url));
  } else {
    response = NextResponse.next(rotated ? withCookies(request, rotated) : undefined);
  }

  if (rotated) {
    const opts = { path: '/', sameSite: 'lax' as const, maxAge: 7 * 24 * 60 * 60, secure: request.nextUrl.protocol === 'https:' };
    response.cookies.set(ACCESS_COOKIE, rotated.accessToken, opts);
    response.cookies.set(REFRESH_COOKIE, rotated.refreshToken, opts);
  }
  return response;
}

/** Make the rotated tokens visible to Server Components in this same request. */
function withCookies(request: NextRequest, tokens: { accessToken: string; refreshToken: string }) {
  const headers = new Headers(request.headers);
  const existing = request.cookies
    .getAll()
    .filter((c) => c.name !== ACCESS_COOKIE && c.name !== REFRESH_COOKIE)
    .map((c) => `${c.name}=${c.value}`);
  existing.push(`${ACCESS_COOKIE}=${tokens.accessToken}`, `${REFRESH_COOKIE}=${tokens.refreshToken}`);
  headers.set('cookie', existing.join('; '));
  return { request: { headers } };
}

export const config = {
  matcher: ['/dashboard/:path*', '/provider/:path*', '/admin/:path*', '/login', '/register'],
};
