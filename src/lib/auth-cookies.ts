import Cookies from 'js-cookie';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './constants';

// Browser-side only. Cookies (not localStorage) so Next.js middleware and
// Server Components can read the session on the server for route protection
// and server-side data fetching.
const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';

export function setSession(accessToken: string, refreshToken: string) {
  // Cookie lives as long as the refresh cookie; validity is decided by the JWT's own exp claim,
  // so middleware can tell "expired, refresh it" apart from "never logged in".
  Cookies.set(ACCESS_COOKIE, accessToken, { expires: 7, sameSite: 'lax', secure });
  Cookies.set(REFRESH_COOKIE, refreshToken, { expires: 7, sameSite: 'lax', secure });
}

export function getAccessToken() {
  return Cookies.get(ACCESS_COOKIE);
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_COOKIE);
}

export function clearSession() {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
}
