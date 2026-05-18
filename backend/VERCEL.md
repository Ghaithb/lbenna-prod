# Déploiement backend sur Vercel

## Variables obligatoires (Settings → Environment Variables)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL Postgres (Supabase : **Connection pooling**, port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | URL Postgres directe (Supabase : **Direct connection**, port 5432) — pour Prisma migrate |
| `JWT_SECRET` | Secret long et aléatoire pour les tokens |

## Exemple Supabase

1. Supabase → Project Settings → Database
2. **DATABASE_URL** = `Transaction` mode URI + `?pgbouncer=true&connection_limit=1`
3. **DIRECT_URL** = `Session` mode URI (sans pgbouncer)

## Vérification après deploy

- `GET https://lbenna-prod.vercel.app/api/health/live` → `{ "alive": true, "databaseUrlConfigured": true }`
- `GET https://lbenna-prod.vercel.app/api/health` → `"status": "healthy"` si la DB répond

Si `databaseUrlConfigured: false` → ajouter `DATABASE_URL` puis **Redeploy**.

## Frontend / Admin

Définir `VITE_API_URL=/api` (ou laisser le `vercel.json` du frontend le faire).
Ne pas utiliser l’URL complète du backend dans le navigateur (évite CORS).
