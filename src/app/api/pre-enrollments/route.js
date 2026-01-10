import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query;
    if (status) {
      query = sql`
        SELECT id, full_name, email, phone, preferred_language, preferred_level, 
               preferred_schedule, status, notes, created_at
        FROM pre_enrollments
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else {
      query = sql`
        SELECT id, full_name, email, phone, preferred_language, preferred_level, 
               preferred_schedule, status, notes, created_at
        FROM pre_enrollments
        ORDER BY created_at DESC
      `;
    }

    const preEnrollments = await query;
    return Response.json({ preEnrollments });
  } catch (err) {
    console.error("GET /api/pre-enrollments error", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      preferred_language,
      preferred_level,
      preferred_schedule,
      notes,
    } = body;

    if (!full_name || !email || !phone) {
      return Response.json(
        { error: "Nome, email e telefone são obrigatórios" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO pre_enrollments (full_name, email, phone, preferred_language, preferred_level, preferred_schedule, notes, status)
      VALUES (${full_name}, ${email}, ${phone}, ${preferred_language || null}, ${preferred_level || null}, ${preferred_schedule || null}, ${notes || null}, 'pending')
      RETURNING id, full_name, email, phone, preferred_language, preferred_level, preferred_schedule, status, notes, created_at
    `;

    return Response.json({ preEnrollment: result[0] });
  } catch (err) {
    console.error("POST /api/pre-enrollments error", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
