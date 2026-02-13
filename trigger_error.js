
async function triggerError() {
    console.log("🧪 Triggering registration error via fetch...");
    try {
        const res = await fetch("http://localhost:4000/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                full_name: "Erro de Teste",
                email: "erro@test.com",
                phone: "000",
                birth_date: "",
                address: "",
                parent_name: "",
                cpf: "",
                rg: "",
                specific_needs: "NÃO",
                notes: ""
            })
        });
        const data = await res.json();
        console.log("Response:", res.status, data);
    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}

triggerError();
