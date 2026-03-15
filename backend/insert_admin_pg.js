const { Client } = require('pg');

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        const checkQuery = "SELECT id, email, role FROM users WHERE email = 'admin@lbenna.com'";
        const checkRes = await client.query(checkQuery);

        if (checkRes.rows.length === 0) {
            console.log('Admin not found, inserting...');
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
          "emailVerified"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), false, true)
      `;
            const values = [
                'admin_manual_prod',
                'admin@lbenna.com',
                '$2b$10$.LHJ5lCPOuaIchphr36kEtfivGYt0s2NO17iE5B5XEioUC9tWt',
                'ADMIN',
                'Admin',
                'Lbenna'
            ];
            await client.query(insertQuery, values);
            console.log('Admin user inserted successfully');
        } else {
            console.log('Admin already exists:', checkRes.rows[0]);
            // Update role anyway to be sure
            await client.query("UPDATE users SET role = 'ADMIN' WHERE email = 'admin@lbenna.com'");
            console.log('Role updated to ADMIN');
        }

    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        await client.end();
    }
}

main();
