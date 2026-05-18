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

/** Matches any HTTPS Vercel deployment (production + preview). */
const VERCEL_ORIGIN = /^https:\/\/[\w.-]+\.vercel\.app$/i;

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

  return VERCEL_ORIGIN.test(origin);
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
