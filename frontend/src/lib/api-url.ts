import { resolveApiBaseUrl } from './api-base';

/** Base API path for axios (e.g. `/api` or `http://localhost:3001/api`). */
export function getApiUrl(): string {
  return resolveApiBaseUrl();
}

/** Origin without `/api` suffix — for static upload paths. */
export function getApiOrigin(): string {
  return getApiUrl().replace(/\/api\/?$/, '');
}
