import sql from "@/app/api/utils/sql";
import crypto from "node:crypto";
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
      const status = searchParams.get("status") || "all";
      const level = searchParams.get("level");
      const classId = searchParams.get("class_id");

      let students;

      if (level) {
        if (status === "active") {
          students = await sql`
            SELECT s.* FROM students s
            JOIN class_enrollments ce ON s.id = ce.student_id
            JOIN classes c ON ce.class_id = c.id
            WHERE c.level = ${level} AND s.active = 1
            ORDER BY s.full_name ASC
          `;
        } else if (status === "inactive") {
          students = await sql`
            SELECT s.* FROM students s
            JOIN class_enrollments ce ON s.id = ce.student_id
            JOIN classes c ON ce.class_id = c.id
            WHERE c.level = ${level} AND s.active = 0
            ORDER BY s.full_name ASC
          `;
        } else {
          students = await sql`
            SELECT s.* FROM students s
            JOIN class_enrollments ce ON s.id = ce.student_id
            JOIN classes c ON ce.class_id = c.id
            WHERE c.level = ${level}
            ORDER BY s.full_name ASC
          `;
        }
      } else if (classId) {
        if (status === "active") {
          students = await sql`
            SELECT s.* FROM students s
            JOIN class_enrollments ce ON s.id = ce.student_id
            WHERE ce.class_id = ${classId} AND s.active = 1
            ORDER BY s.full_name ASC
          `;
        } else if (status === "inactive") {
          students = await sql`
            SELECT s.* FROM students s
            JOIN class_enrollments ce ON s.id = ce.student_id
            WHERE ce.class_id = ${classId} AND s.active = 0
            ORDER BY s.full_name ASC
          `;
        } else {
          students = await sql`
            SELECT s.* FROM students s
            JOIN class_enrollments ce ON s.id = ce.student_id
            WHERE ce.class_id = ${classId}
            ORDER BY s.full_name ASC
          `;
        }
      } else {
        if (status === "active") {
          students = await sql`
            SELECT id, full_name, email, phone, birth_date, address, active, enrollment_date, notes
            FROM students WHERE active = 1
            ORDER BY full_name ASC
          `;
        } else if (status === "inactive") {
          students = await sql`
            SELECT id, full_name, email, phone, birth_date, address, active, enrollment_date, notes
            FROM students WHERE active = 0
            ORDER BY full_name ASC
          `;
        } else {
          students = await sql`
            SELECT id, full_name, email, phone, birth_date, address, active, enrollment_date, notes
            FROM students
            ORDER BY full_name ASC
          `;
        }
      }
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
    const { classIds, ...studentData } = body;

    try {
      const result = sql.transaction(() => {
        // 1. Insert student
        const studentResult = sql`
          INSERT INTO students (full_name, email, phone, birth_date, address, parent_name, cpf, rg, specific_needs, notes, active)
          VALUES (${studentData.full_name}, ${studentData.email}, ${studentData.phone}, ${studentData.birth_date}, ${studentData.address}, ${studentData.parent_name}, ${studentData.cpf}, ${studentData.rg}, ${studentData.specific_needs}, ${studentData.notes}, 1)
          RETURNING *
        `;
        const student = studentResult[0];

        // 2. Insert enrollments
        if (classIds && classIds.length > 0) {
          for (const classId of classIds) {
            const enrollmentId = crypto.randomUUID();
            sql`
              INSERT INTO class_enrollments (id, student_id, class_id)
              VALUES (${enrollmentId}, ${student.id}, ${classId})
            `;
          }
        }

        return student;
      });

      return Response.json({ student: result });
    } catch (dbError) {
      console.warn("⚠️ [POST /api/students] error:", dbError.message);
      return Response.json({ error: "Erro ao cadastrar aluno", message: dbError.message }, { status: 500 });
    }
  } catch (err) {
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
