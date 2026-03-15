const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.upsert({
            where: { email: 'admin@lbenna.com' },
            update: {},
            create: {
                email: 'admin@lbenna.com',
                passwordHash: '$2b$10$.LHJ5lCPOuaIchphr36kEtfivGYt0s2NO17iE5B5XEioUC9tWt',
                firstName: 'Admin',
                lastName: 'Lbenna',
                role: 'ADMIN'
            }
        });
        console.log('Admin user status check:', user.email);
    } catch (e) {
        console.error('Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
