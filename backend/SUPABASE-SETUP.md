# Lier le backend à Supabase (PostgreSQL + Storage)

Ce projet utilise déjà **Supabase Storage** pour les uploads (`SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET`).  
Il faut en plus connecter **PostgreSQL** pour Prisma (utilisateurs, portfolio, réservations, etc.).

---

## 1. Créer ou ouvrir le projet Supabase

1. Va sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** (ou ouvre ton projet existant, ex. `behuxzoknwlvteaogpfl`)
3. Note le **mot de passe** de la base (Database password)

---

## 2. Récupérer les URLs de connexion

1. **Project Settings** → **Database**
2. Section **Connection string** → onglet **URI**

Tu as besoin de **deux** URLs :

### `DIRECT_URL` (migrations Prisma)

- Mode : **Session** ou **Direct**
- Port : **5432**
- Exemple :
  ```txt
  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
  ```
  ou l’URL **Direct connection** affichée par Supabase.

### `DATABASE_URL` (API / Vercel serverless)

- Mode : **Transaction** (pooler)
- Port : **6543**
- Ajoute à la fin :
  ```txt
  ?pgbouncer=true&connection_limit=1
  ```
- Exemple complet :
  ```txt
  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
  ```

> Remplace `[PASSWORD]` par le mot de passe DB. Si le mot de passe contient `@`, `#`, etc., encode-le en [URL encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding).

---

## 3. Configurer le backend en local

Dans `prod/backend/`, copie `.env.example` vers `.env` (si ce n’est pas déjà fait) :

```powershell
cd prod/backend
copy .env.example .env
```

Édite `.env` :

```env
DATABASE_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="une-longue-chaine-aleatoire-minimum-32-caracteres"

# Storage (déjà dans ton projet Supabase)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...   # service_role pour uploads admin
SUPABASE_BUCKET=portfolio
```

**Clé Supabase pour les uploads :** utilise la clé **`service_role`** (Settings → API → `service_role` secret) pour le backend, pas seulement `anon`, si les uploads échouent.

---

## 4. Créer les tables sur Supabase (migrations)

Une seule fois, depuis `prod/backend` :

```powershell
npx prisma generate
npx prisma migrate deploy
```

- `migrate deploy` applique toutes les migrations dans `prisma/migrations/` sur ta base Supabase.
- Si tout est OK, tu verras `All migrations have been successfully applied`.

Vérification :

```powershell
npx prisma studio
```

(Ouvre une interface pour voir les tables.)

---

## 5. (Optionnel) Données de démo

```powershell
npm run prisma:seed
```

Seulement si tu as un script seed configuré et une base vide de prod.

---

## 6. Storage : bucket `portfolio`

1. Supabase → **Storage**
2. Crée un bucket **`portfolio`** (ou le nom dans `SUPABASE_BUCKET`)
3. Policies : pour un MVP, tu peux autoriser lecture publique sur les images ; les uploads passent par le backend avec `service_role`.

---

## 7. Variables sur Vercel (projet **backend**)

**Settings → Environment Variables** → ajoute pour **Production**, **Preview** et **Development** :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | URL Transaction (port 6543) + `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | URL Direct / Session (port 5432) |
| `JWT_SECRET` | Même secret qu’en local (long et aléatoire) |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_KEY` | `service_role` secret |
| `SUPABASE_BUCKET` | `portfolio` |
| `NODE_ENV` | `production` |

Puis **Deployments → Redeploy** (coche *Use existing build cache* ou non).

---

## 8. Vérifier que tout fonctionne

| URL | Résultat attendu |
|-----|------------------|
| `https://lbenna-prod.vercel.app/api/health/live` | `"databaseUrlConfigured": true` |
| `https://lbenna-prod.vercel.app/api/health` | `"status": "healthy"` |
| `https://lbenna-prod.vercel.app/api/partners` | JSON (tableau, même vide `[]`) |

---

## 9. Frontend / Admin sur Vercel

Sur les projets **frontend** et **admin** :

- `VITE_API_URL` = **`/api`** (proxy vers le backend dans `vercel.json`)
- Ou supprime `VITE_API_URL` du dashboard pour utiliser la valeur du `vercel.json`

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `Can't reach database server` | Vérifie mot de passe, URL, projet Supabase non en pause |
| Erreur Prisma / pgbouncer | `DATABASE_URL` doit avoir `?pgbouncer=true` (port 6543) |
| `migrate deploy` échoue | Utilise `DIRECT_URL` (port 5432), pas l’URL poolée |
| 500 sur Vercel | Logs → Functions ; vérifie `DATABASE_URL` + **Redeploy** |
| Upload images KO / `Bucket not found` | `SUPABASE_KEY` = **service_role**, bucket **`portfolio`** public (créé auto au boot ou manuellement dans Storage) |
| Images lourdes / 413 Vercel | Limite **~4,5 Mo par requête** HTTP ; le backend compresse ensuite (max 1920px, JPEG qualité 82). Compressez côté client si le fichier brut dépasse 4 Mo. |
| `SUPABASE_BUCKET` | Doit correspondre au nom exact du bucket (défaut: `portfolio`) |

---

## Commandes utiles

```powershell
npm run db:generate    # prisma generate
npm run db:migrate     # prisma migrate deploy (Supabase)
npm run db:studio      # interface visuelle des tables
```
