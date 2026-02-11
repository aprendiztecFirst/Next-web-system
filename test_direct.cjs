const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        let cleanValue = value.join('=').trim();
        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
            cleanValue = cleanValue.slice(1, -1);
        }
        acc[key.trim()] = cleanValue;
    }
    return acc;
}, {});

// Direct connection string
const project_id = 'iwcazugeqmwrprpfzlid';
const db_url = `postgresql://postgres:${encodeURIComponent('4065Madara@&$')}@db.${project_id}.supabase.co:5432/postgres`;

const pool = new Pool({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false }
});

async function testConn() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Direct connection successful:', res.rows[0]);
    } catch (err) {
        console.error('Direct connection failed:', err);
    } finally {
        await pool.end();
    }
}

testConn();
