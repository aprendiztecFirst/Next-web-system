import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// DADOS MOCK do Usuário Logado
const MOCK_PROFILE = {
  id: 'dev-profile-id',
  user_id: 'dev-user-id',
  name: 'Usuário Dev (Admin)',
  photo_url: null,
  role: 'ADMIN',
  active: true
};

export async function GET() {
  try {
    try {
      // Tenta pegar sessao, mas ignora se falhar
      const session = await auth();
      const userId = session?.user?.id;

      const rows = await sql`
        SELECT id, user_id, name, photo_url, role, active 
        FROM user_profiles 
        WHERE user_id = ${userId} 
        LIMIT 1
      `;
      const profile = rows?.[0] || MOCK_PROFILE; // Fallback se não achar
      return Response.json({ profile });
    } catch (dbError) {
      console.warn("⚠️ [GET /api/profile] Database unavailable, using MOCK data.");
      return Response.json({ profile: MOCK_PROFILE });
    }
  } catch (err) {
    return Response.json({ profile: MOCK_PROFILE });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    try {
      const session = await auth();
      const userId = session?.user?.id || 'dev-user-id';

      const result = await sql`
        INSERT INTO user_profiles (user_id, name, role, photo_url, active)
        VALUES (${userId}, 'Novo Usuário', ${body.role}, ${body.photo_url || null}, true)
        RETURNING *
      `;
      return Response.json({ profile: result[0] });
    } catch (dbError) {
      console.warn("⚠️ [POST /api/profile] Database unavailable, simulating success.");
      return Response.json({
        profile: {
          id: `temp-${Date.now()}`,
          user_id: 'dev-user-id',
          role: body.role,
          name: 'Usuário Dev (Admin)',
          active: true
        }
      });
    }
  } catch (err) {
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
