# Scripts to build and run all applications

# Build shared components
cd shared
npm run build

# Build client frontend
cd ../frontend
npm run build

# Build admin frontend
cd ../admin-frontend
npm run build

# Build backend
cd ../backend
npm run build