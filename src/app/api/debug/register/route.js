import sql from "@/app/api/utils/sql";
import { hash } from 'argon2';

export async function GET() {
    const email = 'heysolarenergize@gmail.com';
    const password = '123456';
    const name = 'Aluno Antigravity';

    try {
        const hashedPassword = await hash(password);

        console.log(`[DEBUG REGISTRATION] Registering ${email}...`);

        const userRes = await sql`
      INSERT INTO auth_users (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) DO UPDATE SET name = ${name}
      RETURNING id
    `;
        const userId = userRes[0].id;

        await sql`
      INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
      VALUES (${userId}, 'credentials', 'credentials', ${userId}, ${hashedPassword})
      ON CONFLICT (provider, "providerAccountId") DO UPDATE SET password = ${hashedPassword}
    `;

        // Check if user_profiles exists
        try {
            await sql`
        INSERT INTO user_profiles (user_id, name, role, active)
        VALUES (${userId}, ${name}, 'student', true)
        ON CONFLICT (user_id) DO UPDATE SET role = 'student'
      `;
        } catch (profileErr) {
            console.warn('[DEBUG REGISTRATION] user_profiles check failed, might not exist:', profileErr.message);
        }

        return Response.json({ success: true, userId });
    } catch (err) {
        console.error('[DEBUG REGISTRATION] Error:', err);
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
}
