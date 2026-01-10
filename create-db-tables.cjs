// Script para criar tabelas de autenticação no PostgreSQL
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function createTables() {
    try {
        console.log('🔄 Conectando ao banco de dados...');
        console.log('📍 Database URL:', process.env.DATABASE_URL ? 'Presente' : 'Ausente');

        // Criar tabela users
        console.log('\n📊 Criando tabela users...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        email_verified TIMESTAMPTZ,
        image TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
        console.log('✅ Tabela users criada');

        // Criar tabela accounts
        console.log('\n📊 Criando tabela accounts...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
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
        UNIQUE(provider, provider_account_id)
      )
    `);
        console.log('✅ Tabela accounts criada');

        // Criar tabela sessions
        console.log('\n📊 Criando tabela sessions...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        session_token TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
        console.log('✅ Tabela sessions criada');

        // Criar tabela verification_tokens
        console.log('\n📊 Criando tabela verification_tokens...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `);
        console.log('✅ Tabela verification_tokens criada');

        // Criar índices
        console.log('\n📊 Criando índices...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token)');
        console.log('✅ Índices criados');

        console.log('\n🎉🎉🎉 TODAS AS TABELAS FORAM CRIADAS COM SUCESSO! 🎉🎉🎉\n');
        console.log('Agora você pode usar o sistema de login e cadastro!\n');

    } catch (error) {
        console.error('\n❌ Erro ao criar tabelas:', error.message);
        console.error('Detalhes completos:', error);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('🔌 Conexão fechada');
    }
}

createTables();
