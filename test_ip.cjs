const { Pool } = require('pg');

const DATABASE_URL = "postgresql://postgres.iwcazugeqmwrprpfzlid:4065Madara%40%26%24@18.228.163.245:6543/postgres";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConn() {
    console.log('Testing connection with IP 18.228.163.245...');
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful with IP:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed with IP:', err);
    } finally {
        await pool.end();
    }
}

testConn();
