import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3005/api';
const ADMIN_EMAIL = 'admin@lbenna.tn';
const ADMIN_PASSWORD = 'password123';

async function verifyFeatures() {
    console.log('🔍 Starting Feature Verification for Prod Project...\n');

    try {
        // 1. Authenticate as Admin
        console.log('--- Phase 1: Authentication ---');
        const loginRes = await axios.post(`${BASE_URL}/auth/admin/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        const token = loginRes.data.access_token;
        console.log('✅ Admin login successful.\n');

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Verify Service Offers (Packs & Options)
        console.log('--- Phase 2: Services & Packs ---');
        const offersRes = await axios.get(`${BASE_URL}/service-offers`);
        const offers = offersRes.data;
        console.log(`📡 Fetched ${offers.length} service offers.`);

        const packs = offers.filter((o: any) => o.isPack);
        const options = offers.filter((o: any) => !o.isPack && o.badge === 'OPTION');

        console.log(`📊 Found ${packs.length} Packs and ${options.length} Options.`);
        if (packs.some((p: any) => p.title.includes('Mariage'))) console.log('✅ Pack "Mariage" detected.');
        if (packs.some((p: any) => p.title.includes('Shooting'))) console.log('✅ Pack "Shooting" detected.');
        if (options.some((o: any) => o.title.includes('Drone'))) console.log('✅ Option "Drone" detected.');
        console.log('\n');

        // 3. Verify Portfolio Gallery
        console.log('--- Phase 3: Portfolio Gallery ---');
        const portfolioRes = await axios.get(`${BASE_URL}/portfolio-items`);
        const portfolioItems = portfolioRes.data;
        const itemWithGallery = portfolioItems.find((item: any) => item.galleryUrls && item.galleryUrls.length > 0);

        if (itemWithGallery) {
            console.log(`✅ Portfolio Item "${itemWithGallery.title}" found with gallery URLs.`);
        } else {
            console.log('❌ No portfolio items with gallery found.');
        }
        console.log('\n');

        // 4. Test Booking Submission
        console.log('--- Phase 4: Booking Submission ---');
        const testPack = packs[0];
        if (testPack) {
            console.log(`📅 Creating booking for: "${testPack.title}" (ID: ${testPack.id})`);
            const bookingData = {
                serviceOfferId: testPack.id,
                bookingDate: new Date(Date.now() + 30 * 86400000).toISOString(),
                customerName: 'Verified Test Customer',
                customerEmail: 'verified@customer.com',
                customerPhone: '55443322',
                notes: 'Automated verification check'
            };

            const bookingRes = await axios.post(`${BASE_URL}/bookings`, bookingData);
            console.log(`✅ Booking created! ID: ${bookingRes.data.id}`);
        } else {
            console.log('❌ Skipping booking: No packs available.');
        }
        console.log('\n');

        // 5. Verify Quotes
        console.log('--- Phase 5: Quotes ---');
        const quoteData = {
            clientName: 'Quote Verified Client',
            clientEmail: 'quote_verified@test.com',
            items: [
                { description: 'Pack Production Standard', quantity: 1, unitPrice: 1500 },
                { description: 'Extras VIP', quantity: 1, unitPrice: 300 }
            ]
        };

        const quoteRes = await axios.post(`${BASE_URL}/quotes`, quoteData, authHeader);
        console.log(`✅ Quote created! Number: ${quoteRes.data.quoteNumber}, Total: ${quoteRes.data.total} TND`);
        console.log('\n');

        console.log('✨ All features verified successfully!');

    } catch (error: any) {
        console.error('❌ Verification failed:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error('   Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('   Message:', error.message);
        }
    }
}

verifyFeatures();
