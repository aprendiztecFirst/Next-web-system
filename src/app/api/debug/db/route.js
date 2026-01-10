import sql from "@/app/api/utils/sql";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        console.log("🛠️ Starting DB Fix via API...");

        try { await sql`DROP TABLE IF EXISTS auth_sessions CASCADE`; } catch (e) { console.log("Drop error:", e.message); }
        try { await sql`DROP TABLE IF EXISTS auth_accounts CASCADE`; } catch (e) { console.log("Drop error:", e.message); }
        try { await sql`DROP TABLE IF EXISTS auth_verification_token CASCADE`; } catch (e) { console.log("Drop error:", e.message); }
        try { await sql`DROP TABLE IF EXISTS auth_users CASCADE`; } catch (e) { console.log("Drop error:", e.message); }

        try { await sql`DROP TABLE IF EXISTS users CASCADE`; } catch (e) { console.log("Drop legacy error:", e.message); }
        try { await sql`DROP TABLE IF EXISTS accounts CASCADE`; } catch (e) { console.log("Drop legacy error:", e.message); }
        try { await sql`DROP TABLE IF EXISTS sessions CASCADE`; } catch (e) { console.log("Drop legacy error:", e.message); }

        await sql`
      CREATE TABLE auth_users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE auth_accounts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        password TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(provider, "providerAccountId")
      )
    `;

        await sql`
      CREATE TABLE auth_sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE auth_verification_token (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `;

        await sql`CREATE INDEX idx_accounts_user_id ON auth_accounts("userId")`;
        await sql`CREATE INDEX idx_sessions_user_id ON auth_sessions("userId")`;
        await sql`CREATE INDEX idx_sessions_session_token ON auth_sessions("sessionToken")`;

        console.log("✅ DB Fixed Successfully!");
        return Response.json({ status: "Database Fixed Successfully! You can now login." });
    } catch (err) {
        console.error("DB Fix Error:", err);
        return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}
