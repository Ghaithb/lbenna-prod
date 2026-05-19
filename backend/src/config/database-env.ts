/**
 * Map Vercel Supabase integration env vars → Prisma (DATABASE_URL / DIRECT_URL).
 * When Supabase is linked on Vercel, POSTGRES_* are set automatically.
 */
function toPostgresqlUrl(url: string): string {
  return url.replace(/^postgres:\/\//, 'postgresql://');
}

function buildPooledUrl(prismaUrl: string): string {
  let url = toPostgresqlUrl(prismaUrl);
  if (!url.includes('pgbouncer=true')) {
    url += url.includes('?') ? '&' : '?';
    url += 'pgbouncer=true&connection_limit=1';
  }
  return url;
}

export function ensureDatabaseEnv(): void {
  // Vercel + Supabase integration: POSTGRES_* is the source of truth
  if (process.env.POSTGRES_PRISMA_URL) {
    process.env.DATABASE_URL = buildPooledUrl(process.env.POSTGRES_PRISMA_URL);
  } else if (!process.env.DATABASE_URL && process.env.POSTGRES_URL) {
    process.env.DATABASE_URL = toPostgresqlUrl(process.env.POSTGRES_URL);
  }

  if (process.env.POSTGRES_URL_NON_POOLING) {
    process.env.DIRECT_URL = toPostgresqlUrl(process.env.POSTGRES_URL_NON_POOLING);
  } else if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
    process.env.DIRECT_URL = process.env.DATABASE_URL;
  }

  if (!process.env.SUPABASE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    process.env.SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  if (!process.env.SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    process.env.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  if (!process.env.SUPABASE_BUCKET?.trim()) {
    process.env.SUPABASE_BUCKET = 'portfolio';
  }
}
