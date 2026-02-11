import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

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

const sql = postgres(DATABASE_URL, {
    ssl: 'require'
});

async function testConn() {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('Connection successful:', result[0]);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await sql.end();
    }
}

testConn();
