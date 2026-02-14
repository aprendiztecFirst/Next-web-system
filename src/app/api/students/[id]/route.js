import sql from "@/app/api/utils/sql";
import crypto from "node:crypto";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const studentResult = await sql`
      SELECT * FROM students WHERE id = ${id}
    `;

        if (!studentResult || studentResult.length === 0) {
            return Response.json({ error: "Aluno não encontrado" }, { status: 404 });
        }

        const student = studentResult[0];

        // Fetch enrollments
        const enrollments = await sql`
      SELECT class_id FROM class_enrollments WHERE student_id = ${id}
    `;
        const classIds = enrollments.map(e => e.class_id);

        return Response.json({ student, classIds });
    } catch (err) {
        console.error("GET /api/students/[id] error:", err);
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { classIds, ...studentData } = body;

        const result = sql.transaction(() => {
            // 1. Update student
            const studentResult = sql`
        UPDATE students 
        SET 
          full_name = ${studentData.full_name},
          email = ${studentData.email},
          phone = ${studentData.phone},
          birth_date = ${studentData.birth_date},
          address = ${studentData.address},
          parent_name = ${studentData.parent_name},
          cpf = ${studentData.cpf},
          rg = ${studentData.rg},
          specific_needs = ${studentData.specific_needs},
          notes = ${studentData.notes},
          active = ${studentData.active ? 1 : 0}
        WHERE id = ${id}
        RETURNING *
      `;

            if (!studentResult || studentResult.length === 0) {
                throw new Error("Aluno não encontrado");
            }

            // 2. Clear old enrollments
            sql`
        DELETE FROM class_enrollments WHERE student_id = ${id}
      `;

            // 3. Insert new enrollments
            if (classIds && classIds.length > 0) {
                for (const classId of classIds) {
                    const enrollmentId = crypto.randomUUID();
                    sql`
            INSERT INTO class_enrollments (id, student_id, class_id)
            VALUES (${enrollmentId}, ${id}, ${classId})
          `;
                }
            }

            return studentResult[0];
        });

        return Response.json({ student: result });
    } catch (err) {
        console.error("PUT /api/students/[id] error:", err);
        if (err.message === "Aluno não encontrado") {
            return Response.json({ error: err.message }, { status: 404 });
        }
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const result = await sql`
      DELETE FROM students WHERE id = ${id}
      RETURNING *
    `;

        if (!result || result.length === 0) {
            return Response.json({ error: "Aluno não encontrado" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Aluno excluído com sucesso" });
    } catch (err) {
        console.error("DELETE /api/students/[id] error:", err);
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}
