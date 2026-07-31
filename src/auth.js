/**
 * WARNING: This file connects this app to Anythings's internal auth system. Do
 * not attempt to edit it. Modifying it will have no effect on your project as it is controlled by our system.
 * Do not import @auth/create or @auth/create anywhere else or it may break. This is an internal package.
 */
import CreateAuth from "@auth/create"
import Credentials from "@auth/core/providers/credentials"
import { Pool } from "@neondatabase/serverless"
import NeonAdapter from "../__create/adapter"

let pool = null;
let adapter = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    adapter = NeonAdapter(pool);
  } catch (err) {
    console.warn("⚠️ [auth.js] Failed to connect to Neon Postgres:", err.message);
  }
}

async function safeVerify(hashPassword, password) {
  try {
    const { verify } = await import('argon2');
    return await verify(hashPassword, password);
  } catch (e) {
    console.warn("⚠️ [auth.js] Argon2 verify fallback:", e.message);
    return hashPassword === password;
  }
}

async function safeHash(password) {
  try {
    const { hash } = await import('argon2');
    return await hash(password);
  } catch (e) {
    console.warn("⚠️ [auth.js] Argon2 hash fallback:", e.message);
    return password;
  }
}

export const { auth } = CreateAuth({
  providers: [Credentials({
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
      if (!adapter) {
        console.warn("⚠️ [auth.js] Auth unavailable because DATABASE_URL is not set");
        return null;
      }
      const { email, password } = credentials;
      if (!email || !password) {
        return null;
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
      }

      // logic to verify if user exists
      const user = await adapter.getUserByEmail(email);
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

      const isValid = await safeVerify(accountPassword, password);
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
      name: { label: 'Name', type: 'text', required: false },
      image: { label: 'Image', type: 'text', required: false },
    },
    authorize: async (credentials) => {
      if (!adapter) {
        console.warn("⚠️ [auth.js] Auth unavailable because DATABASE_URL is not set");
        return null;
      }
      const { email, password } = credentials;
      if (!email || !password) {
        return null;
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
      }

      // logic to verify if user exists
      const user = await adapter.getUserByEmail(email);
      if (!user) {
        const newUser = await adapter.createUser({
          id: crypto.randomUUID(),
          emailVerified: null,
          email,
          name:
            typeof credentials.name === 'string' &&
              credentials.name.trim().length > 0
              ? credentials.name
              : undefined,
          image:
            typeof credentials.image === 'string'
              ? credentials.image
              : undefined,
        });
        await adapter.linkAccount({
          extraData: {
            password: await safeHash(password),
          },
          type: 'credentials',
          userId: newUser.id,
          providerAccountId: newUser.id,
          provider: 'credentials',
        });
        return newUser;
      }
      return null;
    },
  })],
  pages: {
    signIn: '/account/signin',
    signOut: '/account/logout',
  },
});