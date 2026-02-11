const { Pool } = require('pg');
const argon2 = require('argon2');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATABASE_URL = "postgresql://postgres.iwcazugeqmwrprpfzlid:4065Madara%40%26%24@aws-1-sa-east-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function registerStudent() {
  const email = 'heysolarenergize@gmail.com';
  const password = '123456';
  const name = 'Estudante Teste';
  const role = 'student';

  console.log(`Starting registration for ${email}...`);

  try {
    const hashedPassword = await argon2.hash(password);
    console.log('Password hashed.');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Check if user already exists
      const userRes = await client.query('SELECT id FROM auth_users WHERE email = $1', [email]);
      let userId;

      if (userRes.rowCount > 0) {
        console.log('User already exists. Updating...');
        userId = userRes.rows[0].id;
      } else {
        // 2. Insert into auth_users
        const insertUserRes = await client.query(
          'INSERT INTO auth_users (name, email) VALUES ($1, $2) RETURNING id',
          [name, email]
        );
        userId = insertUserRes.rows[0].id;
        console.log(`Created user with ID: ${userId}`);
      }

      // 3. Insert/Update auth_accounts
      await client.query(`
        INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
        VALUES ($1, 'credentials', 'credentials', $2, $3)
        ON CONFLICT (provider, "providerAccountId") DO UPDATE SET password = $3
      `, [userId, userId, hashedPassword]);
      console.log('Account linked.');

      // 4. Create profile if user_profiles exists
      // Check if table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'user_profiles'
        )
      `);

      if (tableCheck.rows[0].exists) {
        await client.query(`
          INSERT INTO user_profiles (user_id, name, role, active)
          VALUES ($1, $2, $3, true)
          ON CONFLICT (user_id) DO UPDATE SET role = $3
        `, [userId, name, role]);
        console.log('Profile created/updated.');
      } else {
        console.log('user_profiles table not found, skipping profile creation.');
      }

      await client.query('COMMIT');
      console.log('Registration completed successfully!');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error during registration:', error);
  } finally {
    await pool.end();
  }
}

registerStudent();
