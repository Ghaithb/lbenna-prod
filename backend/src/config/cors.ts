/**
 * CORS for browser clients (local dev + Vercel production/preview URLs).
 * Origin header is the full URL (e.g. https://xxx.vercel.app), not hostname only.
 */
const STATIC_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://lbenna.tn',
  'https://www.lbenna.tn',
  'https://lbenna-prod.vercel.app',
  'https://lbenna-prod-frontend.vercel.app',
  'https://lbenna-prod-admin.vercel.app',
];

function isLocalDevOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function isVercelDeploymentOrigin(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'https:' && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  const fromEnv = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(
    (v): v is string => Boolean(v),
  );

  if ([...STATIC_ORIGINS, ...fromEnv].includes(origin)) {
    return true;
  }

  if (isLocalDevOrigin(origin) || isVercelDeploymentOrigin(origin)) {
    return true;
  }

  return false;
}

/** Set CORS headers on a Node/Vercel response (e.g. errors before Nest boots). */
export function applyCorsHeaders(
  req: { headers?: { origin?: string } },
  res: {
    setHeader(name: string, value: string): void;
  },
): void {
  const origin = req.headers?.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept, Origin, X-Requested-With',
    );
    res.setHeader('Vary', 'Origin');
  }
}

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    callback(null, isOriginAllowed(origin));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],
};
