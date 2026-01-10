import pg from 'pg';
const { Pool } = pg;
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    let cleanValue = value.join('=').trim();
    if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
      cleanValue = cleanValue.slice(1, -1);
    }
    acc[key.trim()] = cleanValue;
  }
  return acc;
}, {});

const DATABASE_URL = envVars.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function initDb() {
  console.log('Initializing database tables...');
  const client = await pool.connect();

  try {
    // 1. auth_users
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        email TEXT UNIQUE,
        "emailVerified" TIMESTAMP,
        image TEXT
      );
    `);
    console.log('Created auth_users table');

    // 2. auth_accounts
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES auth_users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        password TEXT,
        UNIQUE("provider", "providerAccountId")
      );
    `);
    console.log('Created auth_accounts table');

    // 3. auth_sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES auth_users(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL,
        "sessionToken" TEXT UNIQUE NOT NULL
      );
    `);
    console.log('Created auth_sessions table');

    // 4. auth_verification_token
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_verification_token (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    console.log('Created auth_verification_token table');

    // Optional: Create user_profiles table if the app uses it separately from auth_users (based on api/admin/profiles/route.js check)
    // Checking api/admin/profiles/route.js, it queried 'user_profiles'. 
    // It's possible the app expects a separate profile table or 'user_profiles' is a view or the main table.
    // Given the adapter writes to 'auth_users', we should ensure that works first. 
    // If user_profiles is legacy or expected to be synced, we might need it. 
    // For now, let's create the auth tables which are causing the immediate crash.

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
