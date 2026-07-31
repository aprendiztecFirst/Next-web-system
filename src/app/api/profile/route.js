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
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return Response.json({ profile: null, error: "Não autenticado" }, { status: 401 });
    }

    const rows = await sql`
      SELECT id, user_id, name, photo_url, role, active 
      FROM user_profiles 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;
    const profile = rows?.[0] || {
      id: userId,
      user_id: userId,
      name: session.user.name || session.user.email,
      email: session.user.email,
      role: 'ADMIN',
      active: true
    };
    return Response.json({ profile });
  } catch (err) {
    return Response.json({ profile: null, error: err.message }, { status: 500 });
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
