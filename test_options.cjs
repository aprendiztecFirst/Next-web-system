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

const project_id = 'iwcazugeqmwrprpfzlid';
const pass = '4065Madara@&$';
const db_url = `postgresql://postgres:${encodeURIComponent(pass)}@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?options=project%3D${project_id}`;

const pool = new Pool({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false }
});

async function testConn() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful with options:', res.rows[0]);

        // Check for user
        const userRes = await pool.query('SELECT * FROM auth_users WHERE email = $1', ['heysolarenergize@gmail.com']);
        console.log('User check:', userRes.rows);
    } catch (err) {
        console.error('Connection failed with options:', err);
    } finally {
        await pool.end();
    }
}

testConn();
