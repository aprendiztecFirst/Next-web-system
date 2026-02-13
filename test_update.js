
async function testUpdate() {
    const id = "9572840b-c1a1-47a0-8148-7055f4990e47";
    const body = {
        full_name: "Kamilly da Silva Magalhães",
        email: "nextidiomas@live.com",
        phone: "9199181-8795",
        birth_date: "",
        address: "",
        parent_name: "",
        cpf: "019.237.502-40",
        rg: "9154866",
        specific_needs: "NÃO",
        notes: "Notas atualizadas por Antigravity (Teste 2)",
        active: true
    };

    console.log(`🧪 Testing PUT /api/students/${id}...`);
    try {
        const res = await fetch(`http://localhost:4000/api/students/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log("Response:", res.status, data);
    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}

testUpdate();
