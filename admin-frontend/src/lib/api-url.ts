import { resolveApiBaseUrl } from './api-base';

export function getApiUrl(): string {
  return resolveApiBaseUrl();
}

export function getApiOrigin(): string {
  return getApiUrl().replace(/\/api\/?$/, '');
}
