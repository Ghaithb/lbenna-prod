const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const products = await prisma.product.findMany({
        where: {
            createdAt: {
                gte: today
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${products.length} products created today.`);
    console.log(JSON.stringify(products, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
