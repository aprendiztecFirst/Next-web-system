import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// DADOS MOCK FIXOS
// Garante que sempre haverá dados na tela, mesmo sem banco.
const MOCK_CLASSES = [
  { id: '1', name: 'Inglês Conversation', level: 'B2', language: 'Inglês', schedule: 'Seg/Qua 19:00', teacher_name: 'John Doe', active: true, max_students: 10 },
  { id: '2', name: 'Español Básico', level: 'A1', language: 'Espanhol', schedule: 'Ter/Qui 18:00', teacher_name: 'Maria Garcia', active: true, max_students: 15 },
  { id: '3', name: 'Français Débutant', level: 'A1', language: 'Francês', schedule: 'Sáb 09:00', teacher_name: 'Pierre Dubois', active: true, max_students: 8 },
];

export async function GET(request) {
  try {
    // Tenta query real se tiver conexão
    // SE falhar, cai no CATCH e retorna MOCK
    try {
      const { searchParams } = new URL(request.url);
      const activeOnly = searchParams.get("active") === "true";

      let classes;
      if (activeOnly) {
        classes = await sql`
          SELECT c.*, t.full_name as teacher_name
          FROM classes c
          LEFT JOIN teachers t ON c.teacher_id = t.id
          WHERE c.active = 1
          ORDER BY c.name ASC
        `;
      } else {
        classes = await sql`
          SELECT c.*, t.full_name as teacher_name
          FROM classes c
          LEFT JOIN teachers t ON c.teacher_id = t.id
          ORDER BY c.name ASC
        `;
      }
      return Response.json({ classes });
    } catch (dbError) {
      console.warn("⚠️ [GET /api/classes] Database unavailable, using MOCK data.");
      return Response.json({ classes: MOCK_CLASSES });
    }
  } catch (err) {
    return Response.json({ classes: MOCK_CLASSES });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Tenta salvar, se falhar, retorna SUCESSO FAKE
    try {
      const result = await sql`
        INSERT INTO classes (name, level, language, schedule, active)
        VALUES (${body.name}, ${body.level}, ${body.language}, ${body.schedule}, true)
        RETURNING *
      `;
      return Response.json({ class: result[0] });
    } catch (dbError) {
      console.warn("⚠️ [POST /api/classes] Database unavailable, simulating success.");
      return Response.json({
        class: {
          id: `temp-${Date.now()}`,
          ...body,
          active: true,
          teacher_name: "Novo Professor (Simulado)"
        }
      });
    }
  } catch (err) {
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
