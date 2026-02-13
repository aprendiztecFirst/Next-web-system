
import sql from './src/app/api/utils/sql.js';

async function testDuplicateEmail() {
    console.log("🧪 Testing registration with DUPLICATE email...");

    const body = {
        full_name: "Teste Duplicado",
        email: "nextidiomas@live.com", // This email is already in the DB for Kamilly
        phone: "000000000",
        birth_date: "",
        address: "",
        parent_name: "",
        cpf: "000.000.000-00",
        rg: "0000000",
        specific_needs: "NÃO",
        notes: "Teste de duplicidade"
    };

    try {
        const result = await sql`
            INSERT INTO students (full_name, email, phone, birth_date, address, parent_name, cpf, rg, specific_needs, notes, active)
            VALUES (${body.full_name}, ${body.email}, ${body.phone}, ${body.birth_date}, ${body.address}, ${body.parent_name}, ${body.cpf}, ${body.rg}, ${body.specific_needs}, ${body.notes}, true)
            RETURNING *
        `;
        console.log("✅ SUCCESS (Unexpected):", result);
    } catch (err) {
        console.error("❌ FAILED properly!");
        console.error("Error Message:", err.message);
    }
}

testDuplicateEmail();
