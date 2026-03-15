# L Benna - Production & Services Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../admin-frontend && npm install

# Setup database
cd backend
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma generate

# Start development servers
npm run dev # in backend
npm run dev # in frontend  
npm run dev # in admin-frontend
```

## 📁 Project Structure

```
├── backend/          # NestJS API
├── frontend/         # React client app
├── admin-frontend/   # React admin dashboard
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lbenna_db"
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
PORT=3001
```

See `.env.example` for complete list.

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Admin:** http://localhost:5174
- **API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/health

## 📚 Features

### E-commerce
- Product catalog with categories
- Shopping cart & checkout
- Order management
- Coupons & promotions
- Stripe & Flouci payments

### Services
- Service bookings
- Quote requests
- Portfolio showcase
- Project management

### Learning Platform
- Tutorials & courses
- Workshops
- Quizzes & certifications
- Progress tracking
- Simulator

### Admin Dashboard
- Complete CRUD operations
- Analytics & reporting
- User management
- Content management (CMS)
- Order processing
- Inventory management

## 🔒 Security

- JWT authentication
- Role-based access control (Admin/Client)
- Input validation with class-validator
- CORS configuration
- Rate limiting
- XSS protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:cov

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview

# Admin
cd admin-frontend
npm run build
npm run preview
```

### Environment Setup

1. Set production environment variables
2. Run database migrations
3. Configure CORS for production domains
4. Setup SSL/HTTPS
5. Configure CDN for static assets

## 🛠️ Tech Stack

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- Swagger
- Bull (queues)
- SendGrid (emails)

### Frontend
- React 18
- Vite
- TailwindCSS
- React Query
- Zustand
- React Router
- Axios

### Admin
- React 18
- Vite
- Ant Design
- React Query
- React Router

## 📊 API Documentation

Swagger documentation available at: http://localhost:3001/api

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

## 📝 License

Proprietary - All rights reserved

## 👥 Support

For support, email: support@lbenna.com

## 🔄 Version

Current version: 1.0.0

## ⚡ Performance

- Lighthouse score: 85+
- First Contentful Paint: <2s
- Time to Interactive: <3.5s

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Real-time notifications
- [ ] PWA support

---

**Built with ❤️ by L Benna Production Team**
