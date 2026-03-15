# Prisma migration instructions (local dev)

This project added a new `Project` model to `prisma/schema.prisma`. Because migrations and Prisma client generation require a local database and your developer environment, follow these steps locally to generate the migration and update the Prisma client.

Important: Make a DB backup or use a dedicated local/dev database for migrations.

Windows PowerShell commands (copy & run in `backend`):

```powershell
# 1) Ensure DATABASE_URL is set (example for Postgres):
$env:DATABASE_URL = 'postgresql://user:password@localhost:5432/your_dev_db?schema=public'

# 2) Regenerate the Prisma client (updates TypeScript types):
npx prisma generate

# 3) Create and apply a new migration (interactive; will prompt DB changes):
npx prisma migrate dev --name add-projects

# 4) Commit the generated migration folder and updated schema/client to Git:
git add prisma/migrations prisma/schema.prisma
git commit -m "chore(prisma): add Project model and migration"

# 5) Optional: run tests
npm test
```

Notes
- Running `npx prisma migrate dev` will update your local database. Do not run on production without verification.
- After migration, you can restore strict typing in `backend/src/projects/projects.service.ts` by changing the constructor back to `constructor(private prisma: PrismaService) {}` and running `npm test`.
- If you use Docker for Postgres, ensure the container is running and DATABASE_URL points to it.

Troubleshooting
- If Prisma complains about shadow database or locks, run `npx prisma migrate reset` on a disposable dev DB (this **drops data**).
- If you cannot run migrations here, copy these commands and run on your machine.
