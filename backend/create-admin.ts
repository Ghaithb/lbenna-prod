
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);
    const email = 'admin@lbenna.tn';

    console.log(`Creating/Updating admin: ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: { passwordHash, role: UserRole.ADMIN },
        create: {
            email,
            passwordHash,
            firstName: 'Admin',
            lastName: 'User',
            role: UserRole.ADMIN,
            emailVerified: true,
        },
    });
    console.log('✅ Admin created/updated:', user.email);
}

main()
    .catch(e => {
        console.error('❌ Error creating admin:', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
