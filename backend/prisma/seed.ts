import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  // Admin user (brand: lbenna)
  const adminEmail = 'admin@lbenna.tn';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  // Test client user (brand: lbenna)
  const userEmail = 'user@lbenna.tn';
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.CLIENT,
      emailVerified: true,
    },
  });

  // Seed some demo projects for the portfolio
  const projectsData = [
    {
      slug: 'portrait-studio-classique',
      title: 'Portrait Studio Classique',
      summary: 'Série de portraits en lumière continue, fond neutre.',
      imageUrl: 'https://picsum.photos/seed/portrait/800/600',
      tags: ['portrait', 'studio', 'softbox'],
      published: true,
      authorId: admin.id,
    },
    {
      slug: 'mariage-tunis-2025',
      title: 'Mariage à Tunis 2025',
      summary: 'Reportage complet jour J, album premium inclus.',
      imageUrl: 'https://picsum.photos/seed/wedding/800/600',
      tags: ['mariage', 'reportage', 'événement'],
      published: true,
      authorId: admin.id,
    },
    {
      slug: 'paysage-coucher-soleil',
      title: 'Paysage – Coucher de soleil',
      summary: 'Longues expositions et filtres ND en bord de mer.',
      imageUrl: 'https://picsum.photos/seed/landscape/800/600',
      tags: ['paysage', 'longue-expo'],
      published: false,
      authorId: admin.id,
    },
  ];

  const client: any = prisma;
  for (const p of projectsData) {
    await client.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.summary,
        imageUrl: p.imageUrl,
        tags: p.tags,
        published: p.published,
        authorId: p.authorId,
      },
      create: p,
    });
  }

  console.log('Seeded users (lbenna):');
  console.log(`  Admin: ${admin.email} / ${password}`);
  console.log(`  User:  ${user.email} / ${password}`);

  console.log('Seeded demo tutorial: Skipped for Prod project');

  // Seed Event Services (Photobooth, Production)
  const { seedEventServices } = await import('./seeds/services-event');
  await seedEventServices();

  // Seed Pages (Home, About)
  const { seedPages } = await import('./seeds/pages');
  await seedPages();

  // Seed Announcements
  const { seedAnnouncements } = await import('./seeds/announcements');
  await seedAnnouncements();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
