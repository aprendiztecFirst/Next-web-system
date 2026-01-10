import postgres from 'postgres';

// URL do Supabase direta
const connectionString = "postgresql://postgres:4065Madara%40%26%24@db.iwcazugeqmwrprpfzlid.supabase.co:5432/postgres";

// Configuração forçada de SSL
const sql = postgres(connectionString, {
    ssl: 'require', // Força SSL
    max: 1 // Apenas 1 conexão para testar
});

async function testConnection() {
    try {
        console.log('🔌 Tentando conectar ao Supabase (SSL Real)...');

        // 1. Teste básico
        const version = await sql`SELECT version()`;
        console.log('✅ Conectado!', version[0].version);

        // 2. Verificar se tabelas existem
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
        console.log('📊 Tabelas encontradas:', tables.map(t => t.table_name));

        console.log('🎉 SUCESSO COMPLETO NA CONEXÃO!');
    } catch (error) {
        console.error('❌ ERRO NA CONEXÃO:', error);
    } finally {
        await sql.end();
    }
}

testConnection();
