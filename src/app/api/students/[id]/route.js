import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const result = await sql`
      SELECT * FROM students WHERE id = ${id}
    `;

        if (!result || result.length === 0) {
            return Response.json({ error: "Aluno não encontrado" }, { status: 404 });
        }

        return Response.json({ student: result[0] });
    } catch (err) {
        console.error("GET /api/students/[id] error:", err);
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        const result = await sql`
      UPDATE students 
      SET 
        full_name = ${body.full_name},
        email = ${body.email},
        phone = ${body.phone},
        birth_date = ${body.birth_date},
        address = ${body.address},
        parent_name = ${body.parent_name},
        cpf = ${body.cpf},
        rg = ${body.rg},
        specific_needs = ${body.specific_needs},
        notes = ${body.notes},
        active = ${body.active ? 1 : 0}
      WHERE id = ${id}
      RETURNING *
    `;

        if (!result || result.length === 0) {
            return Response.json({ error: "Aluno não encontrado ou não atualizado" }, { status: 404 });
        }

        return Response.json({ student: result[0] });
    } catch (err) {
        console.error("PUT /api/students/[id] error:", err);
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}
