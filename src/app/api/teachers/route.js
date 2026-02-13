import sql from "@/app/api/utils/sql";

export async function GET(request) {
    try {
        const teachers = await sql`
      SELECT * FROM teachers ORDER BY full_name ASC
    `;
        return Response.json({ teachers });
    } catch (err) {
        console.error("GET /api/teachers error:", err);
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { full_name, email, phone, classIds } = body;

        // Use transaction for consistency
        const result = sql.transaction(() => {
            // 1. Create teacher
            const teacherResult = sql`
        INSERT INTO teachers (full_name, email, phone)
        VALUES (${full_name}, ${email}, ${phone})
        RETURNING *
      `;
            const teacher = teacherResult[0];

            // 2. Assign classes
            if (classIds && classIds.length > 0) {
                for (const classId of classIds) {
                    sql`
            UPDATE classes SET teacher_id = ${teacher.id} WHERE id = ${classId}
          `;
                }
            }

            return teacher;
        });

        return Response.json({ teacher: result });
    } catch (err) {
        console.error("POST /api/teachers error details:", err);
        if (err.message && err.message.includes("UNIQUE constraint failed: teachers.email")) {
            return Response.json({ error: "E-mail já cadastrado" }, { status: 400 });
        }
        return Response.json({ error: "Erro interno", message: err.message }, { status: 500 });
    }
}
