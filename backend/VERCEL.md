# Déploiement backend sur Vercel

## Variables obligatoires (Settings → Environment Variables)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL Postgres (Supabase : **Connection pooling**, port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | URL Postgres directe (Supabase : **Direct connection**, port 5432) — pour Prisma migrate |
| `JWT_SECRET` | Secret long et aléatoire pour les tokens |

## Supabase (guide détaillé)

Voir **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)** — connexion DB, migrations, Storage, Vercel.

Résumé :
1. **DATABASE_URL** = mode Transaction, port **6543** + `?pgbouncer=true&connection_limit=1`
2. **DIRECT_URL** = mode Session/Direct, port **5432**
3. En local : `npm run db:migrate` après avoir rempli `.env`

## Vérification après deploy

- `GET https://lbenna-prod.vercel.app/api/health/live` → `{ "alive": true, "databaseUrlConfigured": true }`
- `GET https://lbenna-prod.vercel.app/api/health` → `"status": "healthy"` si la DB répond

Si `databaseUrlConfigured: false` → ajouter `DATABASE_URL` puis **Redeploy**.

## Frontend / Admin

Définir `VITE_API_URL=/api` (ou laisser le `vercel.json` du frontend le faire).
Ne pas utiliser l’URL complète du backend dans le navigateur (évite CORS).

**Important :** dans le dashboard Vercel du projet **admin** (et frontend), **supprime** toute variable
`VITE_API_URL` = `https://lbenna-prod.vercel.app/api`. Elle écrase le build et provoque des erreurs CORS.
L’admin force déjà `/api` sur `*.vercel.app` au runtime ; un redeploy suffit après suppression.

Upload portfolio : limite ~4,5 Mo par requête sur Vercel (hobby). Au-delà → 500 sans en-têtes CORS visibles.
