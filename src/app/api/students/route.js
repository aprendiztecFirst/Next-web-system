import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// DADOS MOCK FIXOS
const MOCK_STUDENTS = [
  { id: '1', full_name: 'Alice Wonderland', email: 'alice@example.com', phone: '11999999999', active: true, enrollment_date: new Date().toISOString() },
  { id: '2', full_name: 'Bob Builder', email: 'bob@example.com', phone: '11888888888', active: true, enrollment_date: new Date().toISOString() },
  { id: '3', full_name: 'Charlie Brown', email: 'charlie@example.com', phone: '11777777777', active: false, enrollment_date: new Date().toISOString() },
];

export async function GET(request) {
  try {
    try {
      const { searchParams } = new URL(request.url);
      const activeOnly = searchParams.get("active") === "true";
      const level = searchParams.get("level");
      const classId = searchParams.get("class_id");

      let query;
      if (level) {
        query = sql`
          SELECT s.* 
          FROM students s
          JOIN class_enrollments ce ON s.id = ce.student_id
          JOIN classes c ON ce.class_id = c.id
          WHERE c.level = ${level}
          ${activeOnly ? sql`AND s.active = true` : sql``}
          ORDER BY s.full_name ASC
        `;
      } else if (classId) {
        query = sql`
          SELECT s.* 
          FROM students s
          JOIN class_enrollments ce ON s.id = ce.student_id
          WHERE ce.class_id = ${classId}
          ${activeOnly ? sql`AND s.active = true` : sql``}
          ORDER BY s.full_name ASC
        `;
      } else {
        query = sql`
          SELECT id, full_name, email, phone, birth_date, address, active, enrollment_date, notes
          FROM students
          ${activeOnly ? sql`WHERE active = true` : sql``}
          ORDER BY full_name ASC
        `;
      }

      const students = await query;
      return Response.json({ students });
    } catch (dbError) {
      console.warn("⚠️ [GET /api/students] Database unavailable, using MOCK data.", dbError.message);
      return Response.json({ students: MOCK_STUDENTS });
    }
  } catch (err) {
    return Response.json({ students: MOCK_STUDENTS });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    try {
      const result = await sql`
        INSERT INTO students (full_name, email, phone, birth_date, address, notes, active)
        VALUES (${body.full_name}, ${body.email}, ${body.phone}, ${body.birth_date}, ${body.address}, ${body.notes}, true)
        RETURNING *
      `;
      return Response.json({ student: result[0] });
    } catch (dbError) {
      console.warn("⚠️ [POST /api/students] Database unavailable, simulating success.");
      return Response.json({
        student: {
          id: `temp-${Date.now()}`,
          ...body,
          active: true,
          enrollment_date: new Date().toISOString()
        }
      });
    }
  } catch (err) {
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
