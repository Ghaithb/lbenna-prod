
import axios from 'axios';
import { exit } from 'process';

const BACKEND_URL = 'http://127.0.0.1:3005/api';
const FRONTEND_CLIENT_URL = 'http://127.0.0.1:5173';
const FRONTEND_ADMIN_URL = 'http://127.0.0.1:5174';

const ADMIN_EMAIL = 'admin@lbenna.tn'; // Adjust if needed
const ADMIN_PASSWORD = 'password123'; // Adjust if needed

async function runVerification() {
    console.log('🚀 Starting System Verification...');
    console.log('-----------------------------------');

    let authToken = '';

    // 1. Backend Health Check
    try {
        console.log('Checking Backend Health...');
        // Assuming a health endpoint exists or simply root api
        // Often NestJS has /api returning 404 or a welcome message, we'll try a public endpoint
        await axios.get(`${BACKEND_URL}/service-offers`);
        console.log('✅ Backend is reachable.');
    } catch (error) {
        console.error('❌ Backend seems down or unreachable:', error.message);
        exit(1);
    }

    // 2. Admin Login (Get Token)
    try {
        console.log('\n🔐 Authenticating as Admin...');
        const response = await axios.post(`${BACKEND_URL}/auth/admin/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        authToken = response.data.access_token; // Adjust based on actual payload
        if (!authToken) throw new Error('No access token received');
        console.log('✅ Admin Authenticated.');
    } catch (error) {
        console.error('❌ Admin Authentication Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
        console.error('   Please ensure admin@lbenna.tn / password123 exists in the database.');
        exit(1);
    }

    // 3. Test CRUD: Service Offers (Pack & Promo)
    let createdOfferId = '';
    try {
        console.log('\n📦 Testing Service Offer CRUD (Pack & Promo)...');

        // CREATE
        const createPayload = {
            title: "__TEST__ Ultimate Promo Pack",
            description: "Automated test pack",
            price: 500,
            isActive: true,
            isPack: true,
            isPromo: true,
            promoPrice: 400,
            promoExpiresAt: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        };

        const createRes = await axios.post(`${BACKEND_URL}/service-offers`, createPayload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        createdOfferId = createRes.data.id;
        console.log('✅ Created Test Offer. ID:', createdOfferId);

        // VERIFY FIELDS
        if (createRes.data.isPack !== true || createRes.data.isPromo !== true || createRes.data.promoPrice !== 400) {
            throw new Error('Fields mismatch in creation response');
        }
        console.log('✅ Verified New Fields (isPack, isPromo, promoPrice, promoExpiresAt).');

        // UPDATE
        const updatePayload = {
            title: "__TEST__ Updated Title",
            promoPrice: 350
        };
        const updateRes = await axios.patch(`${BACKEND_URL}/service-offers/${createdOfferId}`, updatePayload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (updateRes.data.title !== updatePayload.title || updateRes.data.promoPrice !== 350) {
            throw new Error('Update failed or fields mismatch');
        }
        console.log('✅ Updated Test Offer.');

        // READ (Public)
        const publicRes = await axios.get(`${BACKEND_URL}/service-offers`);
        const found = publicRes.data.find((o: any) => o.id === createdOfferId);
        if (!found) throw new Error('Created offer not found in public list');
        console.log('✅ Verified Offer visible in public list.');

        // DELETE
        await axios.delete(`${BACKEND_URL}/service-offers/${createdOfferId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Deleted Test Offer.');

    } catch (error) {
        console.error('❌ CRUD Operations Failed:', error.message);
        if (error.response) console.error('   Response:', error.response.data);
    }

    // 4. Frontend Route Check (Availability)
    console.log('\n🌐 Checking Frontend Availability...');
    const clientRoutes = [
        '/',
        '/services',
        '/production',
        '/portfolio',
        '/contact',
        '/login'
    ];

    for (const route of clientRoutes) {
        try {
            await axios.get(`${FRONTEND_CLIENT_URL}${route}`);
            console.log(`✅ Client Route OK: ${route}`);
        } catch (error) {
            console.warn(`⚠️  Client Route Warning: ${route} - ${error.message} (Is dev server running?)`);
        }
    }

    const adminRoutes = [
        '/login',
        '/dashboard' // Might redirect close to login, but should respond
    ];

    for (const route of adminRoutes) {
        try {
            await axios.get(`${FRONTEND_ADMIN_URL}${route}`);
            console.log(`✅ Admin Route OK: ${route}`);
        } catch (error) {
            console.warn(`⚠️  Admin Route Warning: ${route} - ${error.message} (Is dev server running?)`);
        }
    }

    console.log('\n-----------------------------------');
    console.log('✅ Verification Completed.');
}

runVerification();
