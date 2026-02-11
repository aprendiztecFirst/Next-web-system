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

const DATABASE_URL = envVars.DATABASE_URL;

async function testConn() {
    console.log('Testing connection with manually parsed URL...');
    try {
        const url = new URL(DATABASE_URL);
        const config = {
            user: url.username,
            password: decodeURIComponent(url.password),
            host: url.hostname,
            port: url.port,
            database: url.pathname.slice(1),
            ssl: { rejectUnauthorized: false }
        };

        console.log(`Host: ${config.host}, Port: ${config.port}, User: ${config.user}, DB: ${config.database}`);

        const pool = new Pool(config);
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful:', res.rows[0]);
        await pool.end();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConn();
