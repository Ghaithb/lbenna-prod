const { Client } = require('pg');

async function main() {
    // Hardcoded connection for the specific environment
    const connectionString = "postgresql://lbenna:password123@127.0.0.1:5434/lbenna_prod?schema=public";

    const client = new Client({
        connectionString: connectionString
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL successfully');

        const checkQuery = "SELECT id, email, role FROM users WHERE email = 'admin@lbenna.com'";
        const checkRes = await client.query(checkQuery);

        if (checkRes.rows.length === 0) {
            console.log('Admin not found, inserting...');
            // Note: id is 'admin_manual_prod' to avoid cuid dependency
            const insertQuery = `
        INSERT INTO users (
          id, 
          email, 
          "passwordHash", 
          role, 
          "firstName", 
          "lastName", 
          "updatedAt",
          "isB2B",
          "emailVerified",
          "createdAt"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), false, true, NOW())
      `;
            const values = [
                'admin_manual_prod',
                'admin@lbenna.com',
                '$2b$10$.LHJ5lCPOuaIchphr36kEtfivGYt0s2NO17iE5B5XEioUC9tWt', // Pass: admin123
                'ADMIN',
                'Admin',
                'Lbenna'
            ];
            await client.query(insertQuery, values);
            console.log('Admin user inserted successfully via direct PG');
        } else {
            console.log('Admin already exists:', checkRes.rows[0]);
            await client.query("UPDATE users SET role = 'ADMIN', \"emailVerified\" = true WHERE email = 'admin@lbenna.com'");
            console.log('Admin user updated (Role forced to ADMIN)');
        }

    } catch (err) {
        console.error('Database error details:', err.message);
    } finally {
        await client.end();
    }
}

main();
