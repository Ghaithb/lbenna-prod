/** Same-origin /api on Vercel — évite CORS et mauvaise VITE_API_URL. */
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
  if (!envUrl) return '/api';
  if (envUrl.startsWith('/')) return envUrl;
  // Ignore dashboard override that points to another origin (CORS).
  if (envUrl.startsWith('http')) return '/api';
  return envUrl;
}
