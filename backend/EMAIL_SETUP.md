# Configuration Email Service

## Option 1: SendGrid (Recommandé)

### Installation
```bash
npm install @sendgrid/mail
```

### Variables d'environnement (.env)
```env
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@lbenna.com
SENDGRID_FROM_NAME=L Benna Studio
FRONTEND_URL=https://lbenna.com
ADMIN_EMAIL=admin@lbenna.com
```

### Obtenir une clé API SendGrid
1. Créer un compte sur https://sendgrid.com (gratuit jusqu'à 100 emails/jour)
2. Aller dans Settings > API Keys
3. Créer une nouvelle clé avec accès "Full Access"
4. Copier la clé dans votre `.env`

---

## Option 2: Nodemailer (SMTP)

### Installation
```bash
npm install nodemailer
```

### Variables d'environnement (.env)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@lbenna.com
FRONTEND_URL=https://lbenna.com
ADMIN_EMAIL=admin@lbenna.com
```

### Note pour Gmail
Si vous utilisez Gmail, vous devez :
1. Activer l'authentification à 2 facteurs
2. Générer un "mot de passe d'application" dans les paramètres Google
3. Utiliser ce mot de passe dans `SMTP_PASS`

---

## Option 3: AWS SES

### Installation
```bash
npm install @aws-sdk/client-ses
```

### Variables d'environnement (.env)
```env
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SES_FROM_EMAIL=noreply@lbenna.com
FRONTEND_URL=https://lbenna.com
ADMIN_EMAIL=admin@lbenna.com
```

---

## Activation dans le code

Une fois que vous avez choisi et configuré un service, décommentez le code dans :
`backend/src/notifications/notifications.service.ts` dans la méthode `sendEmail()`

Le service est déjà prêt à recevoir l'intégration !
