
import sql from './src/app/api/utils/sql.js';

async function debug() {
    console.log("🧪 Starting registration debug...");

    const body = {
        full_name: "Usuario Teste Debug",
        email: "nextidiomas@live.com", // From the user's screenshot
        phone: "91982380033",
        birth_date: "2008-07-31",
        address: "Rua Castelo Branco",
        parent_name: "Nome do Pai/Mãe",
        cpf: "123.456.789-00",
        rg: "1234567-8",
        specific_needs: "NÃO",
        notes: "Teste de debug"
    };

    try {
        console.log("Attempting INSERT...");
        const result = await sql`
            INSERT INTO students (full_name, email, phone, birth_date, address, parent_name, cpf, rg, specific_needs, notes, active)
            VALUES (${body.full_name}, ${body.email}, ${body.phone}, ${body.birth_date}, ${body.address}, ${body.parent_name}, ${body.cpf}, ${body.rg}, ${body.specific_needs}, ${body.notes}, true)
            RETURNING *
        `;
        console.log("✅ SUCCESS!", result);
    } catch (err) {
        console.error("❌ FAILED!");
        console.error("Error Message:", err.message);
        console.error("Error Code:", err.code);

        if (err.message.includes('UNIQUE constraint failed')) {
            console.log("💡 The email or another unique field already exists.");
        }
    }
}

debug();
