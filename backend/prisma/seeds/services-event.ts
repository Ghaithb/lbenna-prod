import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedEventServices() {
    console.log('🌱 Seeding event services...');

    // 1. Categories
    const productionCat = await prisma.category.upsert({
        where: { slug: 'production' },
        update: {},
        create: {
            name: 'Production Vidéo & Photo',
            slug: 'production',
            description: 'Services de production professionnelle pour événements',
            icon: 'Video'
        }
    });

    const photoboothCat = await prisma.category.upsert({
        where: { slug: 'photobooth' },
        update: {},
        create: {
            name: 'Location Photobooth',
            slug: 'photobooth',
            description: 'Bornes photo interactives pour vos événements',
            icon: 'Camera'
        }
    });

    // 2. Production Offers
    const prodOffers = [
        {
            title: 'Pack Mariage Silver',
            description: 'Couverture photo & vidéo essentielle',
            price: 1200,
            duration: 480,
            badge: 'Essentiel',
            features: ['1 Photographe', '1 Vidéaste', 'Montage 5min', 'Photos retouchées'],
            categoryId: productionCat.id
        },
        {
            title: 'Pack Mariage Gold',
            description: 'L\'expérience complète pour votre grand jour',
            price: 2500,
            duration: 720,
            badge: 'Populaire',
            features: ['2 Photographes', '2 Vidéastes', 'Drone inclus', 'Livre d\'art', 'Teaser 1min'],
            categoryId: productionCat.id
        },
        {
            title: 'Événement Corporate',
            description: 'Reportage professionnel pour entreprises',
            price: 800,
            duration: 240,
            badge: 'B2B',
            features: ['Couverture multi-angle', 'Livraison express', 'Cession de droits', 'Interview client'],
            categoryId: productionCat.id
        }
    ];

    for (const offer of prodOffers) {
        await prisma.serviceOffer.upsert({
            where: { id: `prod_${offer.title.toLowerCase().replace(/\s+/g, '_')}` },
            update: offer,
            create: {
                id: `prod_${offer.title.toLowerCase().replace(/\s+/g, '_')}`,
                ...offer
            }
        });
    }

    // 3. Photobooth Offers
    const photoboothOffers = [
        {
            title: 'Pack Photobooth Classic',
            description: 'L\'animation parfaite pour vos soirées',
            price: 450,
            duration: 180,
            badge: 'Best-Seller',
            features: ['3 Heures', 'Impressions illimitées', 'Accessoires fun', 'Galerie web'],
            categoryId: photoboothCat.id
        },
        {
            title: 'Pack Photobooth Premium',
            description: 'Le luxe de l\'impression instantanée',
            price: 750,
            duration: 360,
            badge: 'Premium',
            features: ['Soirée complète', 'Livre d\'or', 'Cadre personnalisé', 'Assistant dédié'],
            categoryId: photoboothCat.id
        },
        {
            title: 'Photobooth IA Corporate',
            description: 'IA et Branding pour vos marques',
            price: null, // Sur devis
            duration: 360,
            badge: 'Innovation',
            features: ['IA Face Swapping', 'Data Catching', 'Branding 360°', 'Statistiques'],
            categoryId: photoboothCat.id
        }
    ];

    for (const offer of photoboothOffers) {
        await prisma.serviceOffer.upsert({
            where: { id: `pb_${offer.title.toLowerCase().replace(/\s+/g, '_')}` },
            update: offer,
            create: {
                id: `pb_${offer.title.toLowerCase().replace(/\s+/g, '_')}`,
                ...offer
            }
        });
    }

    console.log('✅ Event services seeded!');
}
