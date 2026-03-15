# 🌐 Frontend - Photoskop

Site web public React pour la plateforme Photoskop.

## 📦 Installation

### Option 1 : Avec Workspace (depuis la racine)
```bash
cd ..
pnpm install
pnpm dev:frontend
```

### Option 2 : Installation Indépendante
```bash
# Dans ce dossier (frontend/)
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

**Note :** Le frontend nécessite que le backend soit démarré sur `http://localhost:3001`

## 🚀 Démarrage

```bash
# Développement
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## 📦 Technologies

- **React 18** - Framework UI
- **Vite** - Build tool
- **TypeScript** - Typage statique
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Zustand** - State management
- **React Hook Form** - Formulaires
- **Zod** - Validation
- **Lucide React** - Icônes

## 🏗️ Structure

```
frontend/
├── src/
│   ├── components/    # Composants réutilisables
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/         # Pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── CatalogPage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── CartPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilitaires
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
└── tailwind.config.js
```

## 🔌 API

Le frontend communique avec le backend via proxy Vite :
- `/api/*` → `http://localhost:3001/api/*`

## 🎨 Pages

- `/` - Page d'accueil
- `/catalog` - Catalogue produits
- `/product/:slug` - Détails produit
- `/cart` - Panier
- `/checkout` - Paiement
- `/services` - Services
- `/formation` - Formation
- `/contact` - Contact
