import { AsyncLocalStorage } from 'node:async_hooks';
import nodeConsole from 'node:console';
import Credentials from '@auth/core/providers/credentials';
import { authHandler, initAuthConfig } from '@hono/auth-js';
import { Hono } from 'hono';

async function hash(password: string): Promise<string> {
  try {
    const argon2 = await import('argon2');
    return await argon2.hash(password);
  } catch (e: any) {
    return password;
  }
}

async function verify(hashStr: string, password: string): Promise<boolean> {
  try {
    const argon2 = await import('argon2');
    return await argon2.verify(hashStr, password);
  } catch (e: any) {
    return hashStr === password;
  }
}
import { contextStorage, getContext } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { proxy } from 'hono/proxy';
import { bodyLimit } from 'hono/body-limit';
import { requestId } from 'hono/request-id';
import { createHonoServer } from 'react-router-hono-server/node';
import { serializeError } from 'serialize-error';

import SQLiteAdapter from './sqlite-adapter';
import { getHTMLForErrorPage } from './get-html-for-error-page';
import { isAuthAction } from './is-auth-action';
import { API_BASENAME, api } from './route-builder';

// Helper for safe stringify to avoid circular references
const safeStringify = (obj: any, indent = 2) => {
  let cache: any[] = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === 'object' && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null as any;
  return retVal;
};

const als = new AsyncLocalStorage<{ requestId: string }>();

for (const method of ['log', 'info', 'warn', 'error', 'debug'] as const) {
  const original = nodeConsole[method].bind(console);

  console[method] = (...args: unknown[]) => {
    const requestId = als.getStore()?.requestId;
    if (requestId) {
      original(`[traceId:${requestId}]`, ...args);
    } else {
      original(...args);
    }
  };
}

// Initialize SQLite database safely
let db: any = null;
let adapter: any = null;
try {
  const Database = (await import('better-sqlite3')).default;
  db = new Database('database.sqlite');
  adapter = SQLiteAdapter(db);
} catch (err: any) {
  console.warn('⚠️ [__create/index.ts] SQLite database failed to initialize:', err?.message);
}

function getAdapter() {
  return adapter;
}

// Auto-registration for student requested by user
(async () => {
  if (!adapter || !db) return;
  try {
    const email = 'heysolarenergize@gmail.com';
    const password = '123456';
    const name = 'Aluno Antigravity';
    const hashedPassword = await hash(password);
    console.log('[AUTO-REGISTRATION] Checking for user:', email);
    const existing = await adapter.getUserByEmail!(email);
    if (!existing) {
      console.log('[AUTO-REGISTRATION] Creating user...');
      const newUser = await adapter.createUser!({
        id: crypto.randomUUID(),
        email,
        name,
        emailVerified: null,
        image: null
      });
      await adapter.linkAccount!({
        userId: newUser.id,
        provider: 'credentials',
        type: 'credentials',
        providerAccountId: newUser.id,
        password: hashedPassword
      } as any);
      console.log('[AUTO-REGISTRATION] User created successfully!');

      // Create profile
      try {
        db.prepare('INSERT INTO user_profiles (id, user_id, name, role, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT (user_id) DO NOTHING').run(crypto.randomUUID(), newUser.id, name, 'student');
        console.log('[AUTO-REGISTRATION] Profile created.');
      } catch (pErr) {
        console.log('[AUTO-REGISTRATION] Profile creation failed:', (pErr as Error).message);
      }
    } else {
      console.log('[AUTO-REGISTRATION] User already exists.');
    }
  } catch (err) {
    console.error('[AUTO-REGISTRATION] Failed:', err);
  }
})();

const app = new Hono();

app.use('*', requestId());

app.use('*', (c, next) => {
  const requestId = c.get('requestId');
  return als.run({ requestId }, () => next());
});

app.use(contextStorage());

app.onError((err, c) => {
  // Use safe stringify to avoid circular reference errors in logs
  console.error('App Error:', safeStringify(err));

  if (c.req.method !== 'GET') {
    return c.json(
      {
        error: 'An error occurred in your app',
        details: serializeError(err),
      },
      500
    );
  }
  return c.html(getHTMLForErrorPage(err), 200);
});

if (process.env.CORS_ORIGINS) {
  app.use(
    '/*',
    cors({
      origin: process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    })
  );
}
for (const method of ['post', 'put', 'patch'] as const) {
  app[method](
    '*',
    bodyLimit({
      maxSize: 4.5 * 1024 * 1024, // 4.5mb to match vercel limit
      onError: (c) => {
        return c.json({ error: 'Body size limit exceeded' }, 413);
      },
    })
  );
}

app.use(
  '*',
  initAuthConfig((c) => {
    const secret = process.env.AUTH_SECRET || (c as any).env?.AUTH_SECRET || 'secretaria-app-auth-secret-key-2026';
    console.log('Initializing Auth.js with secret:', secret ? 'PRESENT' : 'MISSING');
    return {
      trustHost: true,
      secret,
      pages: {
        signIn: '/account/signin',
        signOut: '/account/logout',
        error: '/account/signin',
      },
        session: {
          strategy: 'jwt',
        },
        callbacks: {
          session({ session, token }) {
            if (token.sub) {
              session.user.id = token.sub;
            }
            return session;
          },
        },
        cookies: {
          csrfToken: {
            options: {
              secure: false,
              sameSite: 'lax',
            },
          },
          sessionToken: {
            options: {
              secure: false,
              sameSite: 'lax',
            },
          },
          callbackUrl: {
            options: {
              secure: false,
              sameSite: 'lax',
            },
          },
        },
        providers: [
          Credentials({
            id: 'credentials-signin',
            name: 'Credentials Sign in',
            credentials: {
              email: {
                label: 'Email',
                type: 'email',
              },
              password: {
                label: 'Password',
                type: 'password',
              },
            },
            authorize: async (credentials) => {
              const { email, password } = credentials;
              if (!email || !password) {
                return null;
              }
              if (typeof email !== 'string' || typeof password !== 'string') {
                return null;
              }

              // logic to verify if user exists
              const user = await getAdapter().getUserByEmail(email);
              if (!user) {
                return null;
              }
              const matchingAccount = user.accounts.find(
                (account) => account.provider === 'credentials'
              );
              const accountPassword = matchingAccount?.password;
              if (!accountPassword) {
                return null;
              }

              const isValid = await verify(accountPassword, password);
              if (!isValid) {
                return null;
              }

              // return user object with the their profile data
              return user;
            },
          }),
          Credentials({
            id: 'credentials-signup',
            name: 'Credentials Sign up',
            credentials: {
              email: {
                label: 'Email',
                type: 'email',
              },
              password: {
                label: 'Password',
                type: 'password',
              },
              name: { label: 'Name', type: 'text' },
              role: { label: 'Role', type: 'text', required: false },
              image: { label: 'Image', type: 'text', required: false },
            },
            authorize: async (credentials) => {
              try {
                const { email, password, name, role, image } = credentials;
                console.log('[Signup] Attempting registration for:', email);

                if (!email || !password) {
                  console.log('[Signup] Error: Missing email or password');
                  return null;
                }
                if (typeof email !== 'string' || typeof password !== 'string') {
                  console.log('[Signup] Error: Email or password not a string');
                  return null;
                }

                console.log('[Signup] Checking user record:', email);
                let user = await getAdapter().getUserByEmail(email);
                const hashedPassword = await hash(password);

                if (!user) {
                  console.log('[Signup] Creating new user record for:', email);
                  user = await getAdapter().createUser({
                    id: crypto.randomUUID(),
                    emailVerified: null,
                    email,
                    name: typeof name === 'string' && name.length > 0 ? name : undefined,
                    image: typeof image === 'string' && image.length > 0 ? image : undefined,
                  });

                  console.log('[Signup] Linking credentials account for userId:', user.id);
                  await getAdapter().linkAccount({
                    extraData: {
                      password: hashedPassword,
                    },
                    type: 'credentials',
                    userId: user.id,
                    providerAccountId: user.id,
                    provider: 'credentials',
                  });
                } else {
                  console.log('[Signup] User exists, updating password for:', email);
                  const updateAccountStmt = db.prepare(
                    'INSERT INTO auth_accounts (id, userId, provider, type, providerAccountId, password) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (provider, providerAccountId) DO UPDATE SET password = ?'
                  );
                  updateAccountStmt.run(crypto.randomUUID(), user.id, 'credentials', 'credentials', user.id, hashedPassword, hashedPassword);
                }

                // Create/Update user_profiles
                try {
                  const userRole = typeof role === 'string' && role ? role : 'student';
                  const profileName = typeof name === 'string' && name ? name : user.name || email;
                  db.prepare(
                    'INSERT INTO user_profiles (id, user_id, name, role, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT (user_id) DO UPDATE SET name = ?, role = ?'
                  ).run(crypto.randomUUID(), user.id, profileName, userRole, profileName, userRole);
                  console.log('[Signup] Profile created/updated for:', email);
                } catch (pErr) {
                  console.warn('[Signup] Failed to update user_profiles:', (pErr as Error).message);
                }

                console.log('[Signup] Registration successful for:', email);
                return user;
              } catch (error) {
                console.error("[Signup] Fatal error during authorize:", safeStringify(error));
                throw error;
              }
            },
          }),
        ],
      };
    })
  );

app.use('/api/auth/*', authHandler());

app.all('/integrations/:path{.+}', async (c, next) => {
  const queryParams = c.req.query();
  const url = `${process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? 'https://www.create.xyz'}/integrations/${c.req.param('path')}${Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ''}`;

  return proxy(url, {
    method: c.req.method,
    body: c.req.raw.body ?? null,
    // @ts-ignore - this key is accepted even if types not aware and is
    // required for streaming integrations
    duplex: 'half',
    redirect: 'manual',
    headers: {
      ...c.req.header(),
      'X-Forwarded-For': process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-host': process.env.NEXT_PUBLIC_CREATE_HOST,
      Host: process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-project-group-id': process.env.NEXT_PUBLIC_PROJECT_GROUP_ID,
    },
  });
});


app.route(API_BASENAME, api);

export { app };

if (!process.env.VERCEL) {
  await createHonoServer({
    app,
    defaultLogger: false,
  });
}

export default app;
