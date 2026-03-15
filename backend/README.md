# 🔧 Backend API - Photoskop

API NestJS pour la plateforme Photoskop.

## 📦 Installation

### Option 1 : Avec Workspace (depuis la racine)
```bash
cd ..
pnpm install
pnpm dev:backend
```

### Option 2 : Installation Indépendante
```bash
# Dans ce dossier (backend/)
pnpm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env
notepad .env

# Démarrer Docker (PostgreSQL + Redis)
cd ..
docker-compose up -d
cd backend

# Générer Prisma
pnpm prisma generate

# Migrer la base de données
pnpm prisma migrate dev

# Démarrer le serveur
pnpm dev
```

## 🚀 Démarrage

```bash
# Développement
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## 📦 Base de données

```bash
# Générer le client Prisma
pnpm prisma:generate

# Créer une migration
pnpm prisma:migrate

# Ouvrir Prisma Studio
pnpm prisma:studio

# Seed la base de données
pnpm prisma:seed
```

## 🔐 Variables d'environnement

Copier `.env.example` vers `.env` et remplir les valeurs.

## 📚 Documentation API

Une fois l'API démarrée, accéder à la documentation Swagger :
- http://localhost:3001/api/docs

## 🏗️ Structure

```
backend/
├── src/
│   ├── auth/          # Authentification JWT
│   ├── users/         # Gestion utilisateurs
│   ├── products/      # CRUD produits
│   ├── orders/        # Gestion commandes
│   ├── upload/        # Upload fichiers S3
│   ├── payment/       # Intégration Stripe
│   ├── jobs/          # Queue BullMQ
│   ├── prisma/        # Service Prisma
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma  # Schéma base de données
└── package.json
```

## 🔌 Endpoints principaux

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/products` - Liste produits
- `POST /api/orders` - Créer commande
- `POST /api/upload` - Upload fichier
- `POST /api/payment/create-intent` - Créer paiement Stripe
