import type { Role } from '@/types/api';

export interface TokenClaims {
  sub: string;
  role: Role;
  exp: number;
}

/**
 * Decodes (does NOT verify) a JWT payload. Safe here because it's only used to
 * route users to the right dashboard and to check expiry for UX purposes —
 * the backend verifies the signature on every API call, so a forged token
 * would pass middleware but get 401s on every request that matters.
 */
export function decodeToken(token: string | undefined | null): TokenClaims | null {
  if (!token) return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as TokenClaims;
    if (!claims.sub || !claims.role) return null;
    return claims;
  } catch {
    return null;
  }
}

export function isExpired(claims: TokenClaims | null, skewSeconds = 10) {
  return !claims || claims.exp * 1000 < Date.now() + skewSeconds * 1000;
}
