import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Fetch teacher
        const teacherResult = await sql`
      SELECT * FROM teachers WHERE id = ${id}
    `;

        if (!teacherResult || teacherResult.length === 0) {
            return Response.json({ error: "Professor não encontrado" }, { status: 404 });
        }

        const teacher = teacherResult[0];

        // Fetch assigned classes
        const classes = await sql`
      SELECT id, name, level FROM classes WHERE teacher_id = ${id}
    `;

        return Response.json({ teacher, classes });
    } catch (err) {
        console.error("GET /api/teachers/[id] error:", err);
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { full_name, email, phone, active, classIds } = body;

        const result = sql.transaction(() => {
            // 1. Update teacher
            const teacherResult = sql`
        UPDATE teachers 
        SET full_name = ${full_name}, email = ${email}, phone = ${phone}, active = ${active ? 1 : 0}
        WHERE id = ${id}
        RETURNING *
      `;

            if (!teacherResult || teacherResult.length === 0) {
                throw new Error("Professor não encontrado");
            }

            // 2. Clear old assignments for this teacher
            sql`
        UPDATE classes SET teacher_id = NULL WHERE teacher_id = ${id}
      `;

            // 3. Assign new classes
            if (classIds && classIds.length > 0) {
                for (const classId of classIds) {
                    sql`
            UPDATE classes SET teacher_id = ${id} WHERE id = ${classId}
          `;
                }
            }

            return teacherResult[0];
        });

        return Response.json({ teacher: result });
    } catch (err) {
        console.error("PUT /api/teachers/[id] error:", err);
        if (err.message === "Professor não encontrado") {
            return Response.json({ error: err.message }, { status: 404 });
        }
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}
