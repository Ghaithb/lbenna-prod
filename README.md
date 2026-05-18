# 🎬 L Benna Production — Plateforme de Gestion Studio

Plateforme web complète pour la gestion d'un studio de production audiovisuelle (mariages, événements, portraits). Architecture monorepo avec **NestJS**, **React/Vite**, et **PostgreSQL**.

---

## 🏗️ Architecture

```
prod/
├── backend/          # API NestJS (port 3001)
├── frontend/         # Site client React/Vite (port 5173)
├── admin-frontend/   # Interface admin React/Vite (port 5174)
└── docker-compose.yml
```

## 🚀 Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Variables d'environnement

```bash
# Depuis la racine du projet
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin-frontend/.env.example admin-frontend/.env
```

> Remplissez les valeurs dans chaque fichier `.env` avec vos vraies credentials.

### 2. Démarrer la base de données

```bash
docker compose up -d postgres redis
```

### 3. Lancer les serveurs

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Client Frontend
cd frontend && npm install && npm run dev

# Terminal 3 — Admin Frontend
cd admin-frontend && npm install && npm run dev
```

### Accès
| Service | URL |
|---------|-----|
| 🌐 Site client | http://localhost:5173 |
| ⚙️ Admin | http://localhost:5174 |
| 🔌 API Backend | http://localhost:3001/api |
| 📖 Swagger Docs | http://localhost:3001/api/docs |

---

## ☁️ Déploiement Vercel (Frontend)

Le fichier `frontend/vercel.json` gère le routage SPA automatiquement.

1. Importer le dépôt sur [Vercel](https://vercel.com)
2. Sélectionner le dossier `frontend/` comme **Root Directory**
3. Ajouter les variables d'environnement :
   - `VITE_API_URL` → URL de votre backend déployé (ex: `https://api.lbenna.tn/api`)
   - `VITE_WS_URL` → URL WebSocket backend

## 🔒 Sécurité

- Les fichiers `.env` sont exclus du dépôt git (`/.gitignore`)
- Utilisez des secrets forts pour `JWT_SECRET` et `LICENSE_JWT_SECRET` en production
- Activez HTTPS et configurez `FRONTEND_URL` / `ADMIN_URL` dans le backend

---

## 🛠️ Stack Technique

| Couche | Technologies |
|--------|-------------|
| Backend | NestJS, TypeORM, PostgreSQL, Redis, JWT |
| Frontend | React 18, Vite, TailwindCSS, React Router |
| Stockage | Supabase Storage |
| Déploiement | Vercel (frontend) + Docker (backend) |
