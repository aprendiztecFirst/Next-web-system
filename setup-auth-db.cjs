// Script para criar tabelas de autenticação no PostgreSQL usando pg
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function createTables() {
    try {
        console.log('🔄 Conectando ao banco de dados Supabase...\n');

        // Criar tabela users
        console.log('📊 Criando tabela users...');
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
        console.log('✅ Tabela users criada\n');

        // Criar tabela accounts
        console.log('📊 Criando tabela accounts...');
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
        console.log('✅ Tabela accounts criada\n');

        // Criar tabela sessions
        console.log('📊 Criando tabela sessions...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        session_token TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
        console.log('✅ Tabela sessions criada\n');

        // Criar tabela verification_tokens  
        console.log('📊 Criando tabela verification_tokens...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `);
        console.log('✅ Tabela verification_tokens criada\n');

        // Criar índices
        console.log('📊 Criando índices para performance...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token)');
        console.log('✅ Índices criados\n');

        console.log('════════════════════════════════════════════');
        console.log('🎉🎉🎉 SUCESSO! 🎉🎉🎉');
        console.log('════════════════════════════════════════════');
        console.log('\n✅ Todas as tabelas foram criadas!');
        console.log('✅ O sistema de autenticação está pronto!');
        console.log('\n📝 Você pode agora:');
        console.log('   1. Fazer cadastro de novos usuários');
        console.log('   2. Fazer login no sistema');
        console.log('   3. Usar todas as funcionalidades protegidas\n');

    } catch (error) {
        console.error('\n❌ Erro ao criar tabelas:', error.message);
        if (error.detail) console.error('Detalhes:', error.detail);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('🔌 Conexão com banco de dados fechada\n');
    }
}

createTables();
