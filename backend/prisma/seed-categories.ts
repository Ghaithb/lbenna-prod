import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
    console.log('🌱 Seeding categories...');

    // 1. Impression & Tirage
    const impressionTirage = await prisma.category.upsert({
        where: { slug: 'impression-tirage' },
        update: {},
        create: {
            name: 'Impression & Tirage',
            slug: 'impression-tirage',
            description: 'Services d\'impression photo professionnelle',
        },
    });

    await prisma.category.createMany({
        data: [
            {
                name: 'Tirage Standard',
                slug: 'tirage-standard',
                description: 'Photos format standard 10x15, 13x18, etc.',
            },
            {
                name: 'Albums & Livres Photo',
                slug: 'albums-livres-photo',
                description: 'Albums photo personnalisés et photobooks',
            },
            {
                name: 'Agrandissements d\'Art',
                slug: 'agrandissements-art',
                description: 'Impressions grand format haute qualité',
            },
        ],
        skipDuplicates: true,
    });

    // 2. Objets Personnalisés
    const objetsPersonnalises = await prisma.category.upsert({
        where: { slug: 'objets-personnalises' },
        update: {},
        create: {
            name: 'Objets Personnalisés',
            slug: 'objets-personnalises',
            description: 'Créations personnalisées avec vos photos',
        },
    });

    await prisma.category.createMany({
        data: [
            {
                name: 'Mugs & Tasses',
                slug: 'mugs-tasses',
                description: 'Mugs personnalisés avec vos photos',
            },
            {
                name: 'Porte-clés',
                slug: 'porte-cles',
                description: 'Porte-clés photo personnalisés',
            },
            {
                name: 'T-shirts & Textiles',
                slug: 'tshirts-textiles',
                description: 'Vêtements personnalisés par sublimation',
            },
            {
                name: 'Cadres Photo',
                slug: 'cadres-photo',
                description: 'Cadres avec photo imprimée',
            },
            {
                name: 'Photos sur MDF',
                slug: 'photos-mdf',
                description: 'Impressions sur support bois',
            },
            {
                name: 'Panneaux Mousse',
                slug: 'panneaux-mousse',
                description: 'Panneaux rigides légers',
            },
        ],
        skipDuplicates: true,
    });

    // 3. Matériel & Accessoires
    const materielAccessoires = await prisma.category.upsert({
        where: { slug: 'materiel-accessoires' },
        update: {},
        create: {
            name: 'Matériel & Accessoires',
            slug: 'materiel-accessoires',
            description: 'Matériel photo/vidéo et accessoires techniques',
        },
    });

    await prisma.category.createMany({
        data: [
            {
                name: 'Appareils Photo/Vidéo',
                slug: 'appareils-photo-video',
                description: 'Boîtiers, objectifs, caméras',
            },
            {
                name: 'Piles & Batteries',
                slug: 'piles-batteries',
                description: 'Alimentations pour matériel photo',
            },
            {
                name: 'Cartes Mémoire',
                slug: 'cartes-memoire',
                description: 'SD, microSD, CF, etc.',
            },
            {
                name: 'Clés USB',
                slug: 'cles-usb',
                description: 'Stockage portable',
            },
            {
                name: 'Câbles & Lecteurs',
                slug: 'cables-lecteurs',
                description: 'Connexions et lecteurs de cartes',
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Categories seeded successfully!');
    console.log(`   - ${impressionTirage.name} (3 sous-catégories)`);
    console.log(`   - ${objetsPersonnalises.name} (6 sous-catégories)`);
    console.log(`   - ${materielAccessoires.name} (5 sous-catégories)`);
}

async function main() {
    try {
        await seedCategories();
    } catch (error) {
        console.error('❌ Seed error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
