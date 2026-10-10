import { API_URL } from './constants';
import { clearSession, getAccessToken, getRefreshToken, setSession } from './auth-cookies';
import { decodeToken, isExpired } from './jwt';
import { ApiError, buildQuery, type RequestOptions } from './api-client-shared';
import type { ApiErrorBody, ApiSuccess } from '@/types/api';

export { ApiError };


interface RefreshData {
  accessToken: string;
  refreshToken: string;
}

let refreshInFlight: Promise<string | null> | null = null;

/** Single-flight refresh: concurrent 401s share one refresh call, because the backend rotates (invalidates) the old refresh token. */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw new Error('refresh failed');
      const body = (await res.json()) as ApiSuccess<RefreshData>;
      setSession(body.data.accessToken, body.data.refreshToken);
      return body.data.accessToken;
    } catch {
      // Middleware may have rotated the cookie moments ago — prefer that over logging the user out.
      const fresh = getAccessToken();
      if (fresh && !isExpired(decodeToken(fresh))) return fresh;
      clearSession();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function currentToken(): Promise<string | null> {
  const token = getAccessToken();
  if (token && !isExpired(decodeToken(token))) return token;
  return refreshAccessToken();
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, formData, query, auth = true } = options;

  const send = async (token: string | null) => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return fetch(`${API_URL}${path}${buildQuery(query)}`, {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  };

  let res = await send(auth ? await currentToken() : null);

  if (res.status === 401 && auth) {
    const fresh = await refreshAccessToken();
    if (fresh) res = await send(fresh);
  }

  let payload: ApiSuccess<T> | ApiErrorBody | null = null;
  try {
    payload = await res.json();
  } catch {
    // non-JSON body — fall through to the generic error below
  }

  if (!res.ok || !payload || payload.success === false) {
    const err = payload && payload.success === false ? payload : null;
    throw new ApiError(err?.message || `Request failed (${res.status})`, res.status, err?.errors || []);
  }

  return payload.data;
}

/** XHR upload so we can report real progress (fetch has no upload progress events). */
export function uploadWithProgress<T>(path: string, formData: FormData, onProgress: (pct: number) => void): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const token = await currentToken();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}${path}`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && body.success) resolve(body.data as T);
        else reject(new ApiError(body.message || 'Upload failed', xhr.status, body.errors || []));
      } catch {
        reject(new ApiError('Upload failed', xhr.status));
      }
    };
    xhr.onerror = () => reject(new ApiError('Network error during upload', 0));
    xhr.send(formData);
  });
}
