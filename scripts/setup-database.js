// Script para criar tabelas de autenticação no PostgreSQL
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function createTables() {
    try {
        console.log('🔄 Conectando ao banco de dados...');

        const sql = readFileSync(join(__dirname, 'create-auth-tables.sql'), 'utf-8');

        console.log('📊 Executando script SQL...');
        const result = await pool.query(sql);

        console.log('✅ Tabelas criadas com sucesso!');
        console.log(result);

    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

createTables();
