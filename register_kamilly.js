
import sql from './src/app/api/utils/sql.js';

async function registerKamilly() {
    console.log("🚀 Starting registration for Kamilly da Silva Magalhães...");

    const body = {
        full_name: "Kamilly da Silva Magalhães",
        email: "nextidiomas@live.com",
        phone: "9199181-8795",
        birth_date: "", // Not provided by user, leaving empty
        address: "", // Not provided by user, leaving empty
        parent_name: "", // Not provided by user, leaving empty
        cpf: "019.237.502-40",
        rg: "9154866",
        specific_needs: "NÃO",
        notes: "Cadastrado via script de automação"
    };

    try {
        console.log("Attempting INSERT into students table...");
        const result = await sql`
            INSERT INTO students (full_name, email, phone, birth_date, address, parent_name, cpf, rg, specific_needs, notes, active)
            VALUES (${body.full_name}, ${body.email}, ${body.phone}, ${body.birth_date}, ${body.address}, ${body.parent_name}, ${body.cpf}, ${body.rg}, ${body.specific_needs}, ${body.notes}, true)
            RETURNING *
        `;
        console.log("✅ SUCCESS! Kamilly registered.");
        console.log("Details:", JSON.stringify(result[0], null, 2));
    } catch (err) {
        console.error("❌ FAILED!");
        console.error("Error Message:", err.message);

        if (err.message.includes('UNIQUE constraint failed')) {
            console.log("💡 This student (email or CPF/RG) might already be registered.");

            // Try to find the existing record to confirm
            try {
                const existing = await sql`SELECT * FROM students WHERE email = ${body.email} OR cpf = ${body.cpf}`;
                console.log("Existing record found:", JSON.stringify(existing, null, 2));
            } catch (searchErr) {
                console.error("Error searching for existing record:", searchErr.message);
            }
        }
    }
}

registerKamilly();
