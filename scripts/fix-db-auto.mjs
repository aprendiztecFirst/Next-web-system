import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load env vars
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function fixDatabase() {
    try {
        console.log('🔄 Conectando ao banco de dados...');

        // Commands to drop and recreate tables with CORRECT structure
        const sqlCommands = [
            // 1. Drop old tables
            `DROP TABLE IF EXISTS auth_sessions CASCADE;`,
            `DROP TABLE IF EXISTS auth_accounts CASCADE;`,
            `DROP TABLE IF EXISTS auth_verification_token CASCADE;`,
            `DROP TABLE IF EXISTS auth_users CASCADE;`,
            `DROP TABLE IF EXISTS "users" CASCADE;`,
            `DROP TABLE IF EXISTS "accounts" CASCADE;`,
            `DROP TABLE IF EXISTS "sessions" CASCADE;`,

            // 2. Create auth_users
            `CREATE TABLE auth_users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );`,

            // 3. Create auth_accounts
            `CREATE TABLE auth_accounts (
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
      );`,

            // 4. Create auth_sessions
            `CREATE TABLE auth_sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`,

            // 5. Create auth_verification_token
            `CREATE TABLE auth_verification_token (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );`,

            // 6. Create Indexes
            `CREATE INDEX idx_accounts_user_id ON auth_accounts("userId");`,
            `CREATE INDEX idx_sessions_user_id ON auth_sessions("userId");`,
            `CREATE INDEX idx_sessions_session_token ON auth_sessions("sessionToken");`
        ];

        console.log('🛠️ Iniciando correção das tabelas...');

        for (const sql of sqlCommands) {
            // Clean up newlines for cleaner logging
            const shortSql = sql.replace(/\n/g, ' ').substring(0, 50) + '...';
            console.log(`⏳ Executando: ${shortSql}`);
            await pool.query(sql);
        }

        console.log('\n✅ SUCESSO! Banco de dados corrigido automaticamente.');
        console.log('Agora o sistema de login deve funcionar.');

    } catch (error) {
        console.error('\n❌ Falha ao executar correção automática:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

fixDatabase();
