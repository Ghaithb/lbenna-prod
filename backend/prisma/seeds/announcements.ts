import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAnnouncements() {
    console.log('Seeding initial announcements...');

    const announcements = [
        {
            text: "OFFRE SPÉCIALE: -20% sur tous les shootings Studio ce mois-ci !",
            code: "STUDIO20",
            link: "/services",
            isActive: true,
            priority: 10
        },
        {
            text: "Nouveau: Photobooth interactif disponible pour vos mariages 2026",
            code: "WED2026",
            link: "/photobooth",
            isActive: true,
            priority: 5
        },
        {
            text: "Réserver votre session de portrait professionnel dès maintenant",
            link: "/production",
            isActive: true,
            priority: 1
        }
    ];

    for (const ann of announcements) {
        await prisma.announcement.create({
            data: ann
        });
    }

    console.log('Announcements seeded successfully.');
}

if (require.main === module) {
    seedAnnouncements()
        .catch(e => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
