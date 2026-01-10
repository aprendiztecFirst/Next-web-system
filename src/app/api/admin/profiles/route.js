import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const profiles = await sql`
      SELECT id, user_id, name, photo_url, role, active, created_at
      FROM user_profiles
      ORDER BY created_at DESC
    `;

    return Response.json({ profiles });
  } catch (err) {
    console.error("GET /api/admin/profiles error", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
