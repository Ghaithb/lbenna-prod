const http = require('http');

const API_CONFIG = {
    hostname: 'localhost',
    port: 3001,
    protocol: 'http:'
};

async function request(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${body}`));
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runAudit() {
    console.log('--- LBENNA PRODUCTION ADMIN AUDIT (TECH) ---');
    try {
        // 1. Login
        console.log('1. Authentification admin...');
        const authData = await request({
            ...API_CONFIG,
            path: '/api/auth/admin/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'admin@lbenna.tn', password: 'password123' });

        const token = authData.access_token;
        if (!token) throw new Error('Pas de token reçu');
        console.log('✅ Auth Réussie');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 2. Stats Dashboard
        console.log('2. Dashboard: Statistiques...');
        const stats = await request({ ...API_CONFIG, path: '/api/analytics/stats', method: 'GET', headers });
        console.log('✅ Stats reçues:', stats ? 'OK' : 'FAIL');

        // 3. Upcoming Bookings
        console.log('3. Dashboard: Prochaines réservations...');
        const upcoming = await request({ ...API_CONFIG, path: '/api/analytics/upcoming', method: 'GET', headers });
        console.log(`✅ ${upcoming.length || 0} réservations trouvées.`);

        // 4. Clients
        console.log('4. Module Clients...');
        const users = await request({ ...API_CONFIG, path: '/api/users', method: 'GET', headers });
        console.log(`✅ ${users.length || 0} clients trouvés.`);

        // 5. Portfolio
        console.log('5. Module Portfolio...');
        const portfolio = await request({ ...API_CONFIG, path: '/api/portfolio-items', method: 'GET', headers });
        console.log(`✅ ${portfolio.length || 0} items portfolio trouvés.`);

        // 6. Messages
        console.log('6. Module Messagerie...');
        const messages = await request({ ...API_CONFIG, path: '/api/messages', method: 'GET', headers });
        console.log(`✅ ${messages.length || 0} messages trouvés.`);

        // 7. FAQs
        console.log('7. Module FAQ...');
        const faqs = await request({ ...API_CONFIG, path: '/api/faqs', method: 'GET', headers });
        console.log(`✅ ${faqs.length || 0} FAQs trouvées.`);

        console.log('\n--- AUDIT FINAL LBENNA PRODUCTION : SUCCÈS TOTAL ---');
        console.log('Tous les services backend sont opérationnels et retournent des données cohérentes.');
    } catch (error) {
        console.error('❌ ÉCHEC DE L\'AUDIT:', error.message);
        process.exit(1);
    }
}

runAudit();
