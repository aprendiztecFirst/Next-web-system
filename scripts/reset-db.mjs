import { Pool } from '@neondatabase/serverless';

// Hardcoded URL from verification to avoid encoding issues
const DATABASE_URL = "postgresql://postgres:4065Madara%40%26%24@db.iwcazugeqmwrprpfzlid.supabase.co:5432/postgres";

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing!');
    process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function resetDb() {
    try {
        console.log('🔄 Connecting to DB...');
        // Log masked URL
        console.log(`📍 URL: ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);

        const sql = `
      -- DROP EVERYTHING
      DROP TABLE IF EXISTS auth_sessions CASCADE;
      DROP TABLE IF EXISTS auth_accounts CASCADE;
      DROP TABLE IF EXISTS auth_verification_token CASCADE;
      DROP TABLE IF EXISTS auth_users CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS accounts CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;

      -- CREATE TABLES WITH CORRECT SCHEMA (Quoted identifiers)
      CREATE TABLE auth_users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE auth_accounts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(provider, "providerAccountId")
      );

      CREATE TABLE auth_sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE auth_verification_token (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );

      -- INDEXES
      CREATE INDEX idx_accounts_user_id ON auth_accounts("userId");
      CREATE INDEX idx_sessions_user_id ON auth_sessions("userId");
      CREATE INDEX idx_sessions_session_token ON auth_sessions("sessionToken");
    `;

        console.log('🛠️ Recreating tables...');
        await pool.query(sql);
        console.log('✅ Tables created!');

        // Insert test user
        console.log('👤 Inserting test user...');
        await pool.query(`
      INSERT INTO auth_users (name, email, "emailVerified")
      VALUES ('Test User', 'teste@gmail.com', NOW())
    `);
        console.log('✅ Test user inserted: teste@gmail.com');

        console.log('🎉 SUCCESS! Database is finally ready.');
    } catch (err) {
        console.error('❌ FATAL ERROR:', err);
    } finally {
        await pool.end();
    }
}

resetDb();
