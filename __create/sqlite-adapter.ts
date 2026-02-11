import type {
    AdapterUser,
    VerificationToken,
    Adapter,
    AdapterSession,
} from '@auth/core/adapters';
import type { ProviderType } from '@auth/core/providers';
import type { Database } from 'better-sqlite3';

interface SQLiteUser extends AdapterUser {
    accounts: {
        provider: string;
        providerAccountId: string;
        password?: string;
    }[];
}

export default function SQLiteAdapter(db: Database): Adapter {
    return {
        async createVerificationToken(
            verificationToken: VerificationToken
        ): Promise<VerificationToken> {
            const { identifier, expires, token } = verificationToken;
            const stmt = db.prepare(`
        INSERT INTO auth_verification_token ( identifier, expires, token )
        VALUES (?, ?, ?)
      `);
            stmt.run(identifier, expires instanceof Date ? expires.toISOString() : expires, token);
            return verificationToken;
        },
        async useVerificationToken({
            identifier,
            token,
        }: {
            identifier: string;
            token: string;
        }): Promise<VerificationToken | null> {
            const stmt = db.prepare(`
        DELETE FROM auth_verification_token
        WHERE identifier = ? AND token = ?
        RETURNING identifier, expires, token
      `);
            const result = stmt.get(identifier, token) as any;
            if (!result) return null;
            return {
                ...result,
                expires: new Date(result.expires)
            };
        },

        async createUser(user: Omit<AdapterUser, 'id'>) {
            const id = crypto.randomUUID();
            const { name, email, emailVerified, image } = user;
            const stmt = db.prepare(`
        INSERT INTO auth_users (id, name, email, emailVerified, image)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id, name, email, emailVerified, image`);
            const result = stmt.get(
                id,
                name,
                email,
                emailVerified instanceof Date ? emailVerified.toISOString() : emailVerified,
                image
            ) as any;
            return {
                ...result,
                emailVerified: result.emailVerified ? new Date(result.emailVerified) : null
            };
        },
        async getUser(id: string) {
            const stmt = db.prepare('SELECT * FROM auth_users WHERE id = ?');
            const result = stmt.get(id) as any;
            if (!result) return null;
            return {
                ...result,
                emailVerified: result.emailVerified ? new Date(result.emailVerified) : null
            };
        },
        async getUserByEmail(email) {
            const stmt = db.prepare('SELECT * FROM auth_users WHERE email = ?');
            const userData = stmt.get(email) as any;
            if (!userData) {
                return null;
            }
            const accountsStmt = db.prepare('SELECT * FROM auth_accounts WHERE userId = ?');
            const accountsData = accountsStmt.all(userData.id) as any[];
            return {
                ...userData,
                emailVerified: userData.emailVerified ? new Date(userData.emailVerified) : null,
                accounts: accountsData,
            };
        },
        async getUserByAccount({
            providerAccountId,
            provider,
        }) {
            const stmt = db.prepare(`
        SELECT u.* FROM auth_users u JOIN auth_accounts a ON u.id = a.userId
        WHERE a.provider = ? AND a.providerAccountId = ?
      `);
            const result = stmt.get(provider, providerAccountId) as any;
            if (!result) return null;
            return {
                ...result,
                emailVerified: result.emailVerified ? new Date(result.emailVerified) : null
            };
        },
        async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
            const oldUserStmt = db.prepare('SELECT * FROM auth_users WHERE id = ?');
            const oldUser = oldUserStmt.get(user.id) as any;

            const newUser = {
                ...oldUser,
                ...user,
            };

            const { id, name, email, emailVerified, image } = newUser;
            const updateStmt = db.prepare(`
        UPDATE auth_users SET
        name = ?, email = ?, emailVerified = ?, image = ?
        WHERE id = ?
        RETURNING name, id, email, emailVerified, image
      `);
            const result = updateStmt.get(
                name,
                email,
                emailVerified instanceof Date ? emailVerified.toISOString() : emailVerified,
                image,
                id
            ) as any;
            return {
                ...result,
                emailVerified: result.emailVerified ? new Date(result.emailVerified) : null
            };
        },
        async linkAccount(account) {
            const id = crypto.randomUUID();
            const stmt = db.prepare(`
        INSERT INTO auth_accounts
        (
          id,
          userId,
          provider,
          type,
          providerAccountId,
          access_token,
          expires_at,
          refresh_token,
          id_token,
          scope,
          session_state,
          token_type,
          password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `);

            const params = [
                id,
                account.userId,
                account.provider,
                account.type,
                account.providerAccountId,
                account.access_token,
                account.expires_at,
                account.refresh_token,
                account.id_token,
                account.scope,
                account.session_state,
                account.token_type,
                (account as any).extraData?.password || (account as any).password,
            ];

            const result = stmt.get(...params) as any;
            return result;
        },
        async createSession({ sessionToken, userId, expires }) {
            const id = crypto.randomUUID();
            const stmt = db.prepare(`
        INSERT INTO auth_sessions (id, userId, expires, sessionToken)
        VALUES (?, ?, ?, ?)
        RETURNING id, sessionToken, userId, expires
      `);

            const result = stmt.get(
                id,
                userId,
                expires instanceof Date ? expires.toISOString() : expires,
                sessionToken
            ) as any;
            return {
                ...result,
                expires: new Date(result.expires)
            };
        },

        async getSessionAndUser(sessionToken: string | undefined) {
            if (sessionToken === undefined) {
                return null;
            }
            const sessionStmt = db.prepare('SELECT * FROM auth_sessions WHERE sessionToken = ?');
            const session = sessionStmt.get(sessionToken) as any;
            if (!session) {
                return null;
            }

            const userStmt = db.prepare('SELECT * FROM auth_users WHERE id = ?');
            const user = userStmt.get(session.userId) as any;
            if (!user) {
                return null;
            }
            return {
                session: {
                    ...session,
                    expires: new Date(session.expires)
                },
                user: {
                    ...user,
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null
                },
            };
        },
        async updateSession(
            session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
        ) {
            const { sessionToken } = session;
            const updateStmt = db.prepare(`
        UPDATE auth_sessions SET
        expires = ?
        WHERE sessionToken = ?
        RETURNING *
      `);
            const result = updateStmt.get(
                session.expires instanceof Date ? session.expires.toISOString() : session.expires,
                sessionToken
            ) as any;
            if (!result) return null;
            return {
                ...result,
                expires: new Date(result.expires)
            };
        },
        async deleteSession(sessionToken) {
            const stmt = db.prepare('DELETE FROM auth_sessions WHERE sessionToken = ?');
            stmt.run(sessionToken);
        },
        async unlinkAccount(partialAccount) {
            const { provider, providerAccountId } = partialAccount;
            const stmt = db.prepare('DELETE FROM auth_accounts WHERE providerAccountId = ? AND provider = ?');
            stmt.run(providerAccountId, provider);
        },
        async deleteUser(userId: string) {
            const deleteUserStmt = db.prepare('DELETE FROM auth_users WHERE id = ?');
            deleteUserStmt.run(userId);
            // Cascading delete should handle sessions and accounts if foreign keys are enabled
            // But let's be explicit if needed or just rely on cascades if we enabled them.
        },
    };
}
