import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPages() {
    console.log('Seeding initial pages...');

    // Home Page
    const homeContent = {
        hero: {
            badge: "Production Audiovisuelle & Événementielle • Depuis 1988",
            title_fixed: "L'Art de",
            title_words: ["Capturer", "Sublimer", "Raconter", "Célébrer", "Éterniser"],
            description: "Depuis 1988, L Benna Production écrit votre histoire par l'image. Mariages d'exception, films corporate et studio de création."
        },
        personas: [
            {
                title: "Un particulier",
                description: "Capturez vos moments précieux, réservez un photographe pour vos événements familiaux.",
                cta: "Voir les services",
                link: "/services",
                icon_name: "Heart"
            },
            {
                title: "Une entreprise",
                description: "Communication visuelle, couverture d'événements pro ou packshots produits de haute qualité.",
                cta: "Découvrir l'offre Pro",
                link: "/services",
                icon_name: "Briefcase"
            }
        ],
        features: [
            {
                title: "Qualité Certifiée",
                description: "Savoir-faire artisanal pour des résultats d'exception.",
                icon_name: "Shield"
            },
            {
                title: "Rapidité",
                description: "Production et livraison optimisées pour vos projets pressants.",
                icon_name: "Zap"
            },
            {
                title: "Équipe d'Experts",
                description: "Des photographes et techniciens passionnés à votre écoute.",
                icon_name: "Users"
            },
            {
                title: "Satisfaction Garantie",
                description: "Votre vision, sublimée par notre expertise.",
                icon_name: "Check"
            }
        ],
        cta_final: {
            title: "Donnez vie à vos projets dès aujourd'hui",
            description: "Expertise studio et production audiovisuelle d'exception."
        }
    };

    await prisma.page.upsert({
        where: { slug: 'home' },
        update: { content: homeContent as any },
        create: {
            title: 'Accueil',
            slug: 'home',
            content: homeContent as any,
            isPublished: true,
            showInMenu: false,
            template: 'landing'
        }
    });

    // About Page
    const aboutContent = {
        hero: {
            badge: "L Benna Production • 40 Ans d'Excellence",
            title: "Notre Héritage, Votre Histoire",
            subtitle: "Depuis 1988, nous transformons vos moments précieux en œuvres d'art intemporelles."
        },
        story: {
            title: "Plus qu'un studio, une passion familiale.",
            text1: "Fondé en 1988, L Benna Production est né d'une volonté simple : capturer l'essence de l'émotion humaine à travers l'objectif. Ce qui a commencé comme un petit studio de quartier s'est transformé en une référence nationale dans la production audiovisuelle.",
            text2: "Aujourd'hui, nous allions tradition et technologie de pointe. Avec un parc matériel de dernière génération (capteurs 100MP, drones 5.4K) et une équipe de passionnés, nous continuons de sublimer vos mariages, vos événements d'entreprise et vos portraits de famille.",
            highlights: [
                {
                    title: "Expertise Reconnue",
                    text: "Plus de 2000 mariages couverts et des centaines de films corporate.",
                    icon_name: "Award"
                },
                {
                    title: "Innovation",
                    text: "Toujours à l'avant-garde des techniques de prise de vue et de montage.",
                    icon_name: "Sparkles"
                }
            ]
        },
        values: [
            {
                title: "Équipe Dédiée",
                text: "Chaque projet est unique. Notre équipe s'immerge dans votre univers pour un résultat qui vous ressemble.",
                icon_name: "Users"
            },
            {
                title: "Qualité Sans Compromis",
                text: "De la prise de vue au tirage final, nous ne faisons aucune concession sur la qualité technique et artistique.",
                icon_name: "ShieldCheck"
            },
            {
                title: "Matériel de Pointe",
                text: "Nous investissons constamment dans le meilleur matériel pour garantir des images d'une netteté exceptionnelle.",
                icon_name: "Camera"
            }
        ]
    };

    await prisma.page.upsert({
        where: { slug: 'about' },
        update: { content: aboutContent as any },
        create: {
            title: 'À Propos',
            slug: 'about',
            content: aboutContent as any,
            isPublished: true,
            showInMenu: true,
            menuOrder: 1,
            template: 'default'
        }
    });

    console.log('Pages seeded successfully.');
}

if (require.main === module) {
    seedPages()
        .catch(e => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
