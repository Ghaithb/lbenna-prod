import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Seeding test data for Prod project...');

    // 0. Admin User
    const adminPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lbenna.tn' },
        update: { passwordHash: adminPassword, role: UserRole.ADMIN },
        create: {
            email: 'admin@lbenna.tn',
            passwordHash: adminPassword,
            firstName: 'Admin',
            lastName: 'L Benna',
            role: UserRole.ADMIN,
        }
    });
    console.log('✅ Admin user created:', admin.id);

    // 1. Categories
    const catWedding = await prisma.category.upsert({
        where: { slug: 'mariage-events' },
        update: {},
        create: {
            name: 'Mariage & Événements',
            slug: 'mariage-events',
            description: 'Capture pour vos moments inoubliables.',
            icon: 'Heart',
        }
    });

    const catStudio = await prisma.category.upsert({
        where: { slug: 'studio-creation' },
        update: {},
        create: {
            name: 'Studio de Création',
            slug: 'studio-creation',
            description: 'Shootings pro et portraits.',
            icon: 'Camera',
        }
    });

    // 2. Packs (Let Prisma generate IDs to be safe)
    const packWedding = await prisma.serviceOffer.create({
        data: {
            title: 'Pack Mariage Gold',
            description: 'Couverture complète, Drone 4K, Album Prestige.\n2 Photographes\n1 Vidéographe',
            price: 2500,
            isPack: true,
            categoryId: catWedding.id,
            imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        }
    });

    const packShooting = await prisma.serviceOffer.create({
        data: {
            title: 'Pack Shooting Pro',
            description: 'Session studio 2h, 20 photos retouchées.\nMaquillage inclus',
            price: 350,
            isPack: true,
            categoryId: catStudio.id,
            imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
        }
    });

    // 3. Options
    await prisma.serviceOffer.create({
        data: {
            title: 'Option Drone 5.4K',
            description: 'Prises de vues aériennes spectaculaires.',
            price: 450,
            isPack: false,
            badge: 'OPTION',
            categoryId: catWedding.id,
        }
    });

    // 4. Portfolio Item
    await prisma.portfolioItem.create({
        data: {
            title: 'Mariage de Luxe à Carthage',
            description: 'Une célébration exceptionnelle capturée par notre équipe.',
            coverUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
            galleryUrls: [
                'https://images.unsplash.com/photo-1519741497674-611481863552',
                'https://images.unsplash.com/photo-1465495910483-fb445ad57739',
                'https://images.unsplash.com/photo-1502633016831-74d30bc064bc'
            ],
            categoryId: catWedding.id
        }
    });

    console.log('✅ Test data seeded successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
