/**
 * API base URL for the admin app.
 * On Vercel (and production domains), always use same-origin `/api` so vercel.json
 * proxies to the backend — avoids CORS and wrong VITE_API_URL in the dashboard.
 */
export function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    if (
      protocol === 'https:' &&
      (hostname.endsWith('.vercel.app') ||
        hostname === 'lbenna.tn' ||
        hostname === 'www.lbenna.tn')
    ) {
      return '/api';
    }
  }

  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (!envUrl) {
    return '/api';
  }
  if (envUrl.startsWith('/')) {
    return envUrl;
  }
  if (envUrl.startsWith('http')) {
    return '/api';
  }
  return envUrl;
}
