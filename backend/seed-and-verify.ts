import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

const prisma = new PrismaClient();
const BASE_URL = 'http://127.0.0.1:3005/api';

async function run() {
    console.log('🚀 Starting Atomic Seed & Verify...');

    try {
        // 1. Reset & Seed DB
        console.log('--- Step 1: Seeding ---');

        // Use fixed IDs to avoid any dynamic mismatch
        const ADMIN_EMAIL = 'admin@lbenna.tn';
        const hashedPassword = await bcrypt.hash('password123', 10);

        await prisma.user.upsert({
            where: { email: ADMIN_EMAIL },
            update: { passwordHash: hashedPassword, role: UserRole.ADMIN },
            create: { email: ADMIN_EMAIL, passwordHash: hashedPassword, role: UserRole.ADMIN, firstName: 'Admin' }
        });

        const cat = await prisma.category.upsert({
            where: { slug: 'test-cat' },
            update: {},
            create: { name: 'Test Category', slug: 'test-cat' }
        });

        const pack = await prisma.serviceOffer.upsert({
            where: { id: 'FIXED_PACK_ID' },
            update: { isActive: true, isPack: true },
            create: { id: 'FIXED_PACK_ID', title: 'Fixed Test Pack', isPack: true, categoryId: cat.id, price: 1000 }
        });

        const portfolio = await prisma.portfolioItem.create({
            data: { title: 'Test Portfolio', coverUrl: 'http://test.com/img.jpg', galleryUrls: ['http://test.com/1.jpg'], categoryId: cat.id }
        });

        console.log('✅ Seed successful. Pack ID:', pack.id);

        // 2. Start checking via API (Wait for backend)
        console.log('\n--- Step 2: Verification via API ---');

        try {
            const offersRes = await axios.get(`${BASE_URL}/service-offers`);
            const remotePack = offersRes.data.find((o: any) => o.id === 'FIXED_PACK_ID');

            if (!remotePack) {
                console.log('❌ UNEXPECTED: FIXED_PACK_ID not found via API!');
                console.log('📦 Remote IDs found:', offersRes.data.map((o: any) => o.id).join(', '));
                return;
            }

            console.log('✅ API sees the Pack.');

            const bookingData = {
                serviceOfferId: 'FIXED_PACK_ID',
                bookingDate: new Date(Date.now() + 50 * 86400000).toISOString(),
                customerName: 'Atomic Tester',
                customerEmail: 'atomic@test.com',
                customerPhone: '12345678'
            };

            const bookingRes = await axios.post(`${BASE_URL}/bookings`, bookingData);
            console.log('✅ Booking created successfully! ID:', bookingRes.data.id);

            console.log('\n✨ Atomic Verification Passed!');

        } catch (apiErr: any) {
            console.error('❌ API Step Failed:', apiErr.response?.data || apiErr.message);
        }

    } catch (err: any) {
        console.error('❌ Critical Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
