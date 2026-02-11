import sql from './src/app/api/utils/sql.js';
import crypto from 'crypto';

// Polyfill crypto if needed for older node, but randomUUID is usually there in v20
if (!global.crypto) {
    global.crypto = crypto;
}

async function test() {
    try {
        const id = 'test-user-' + Date.now();
        const email = `test-${Date.now()}@example.com`;

        console.log('1. Creating test user in auth_users...');
        // Note: sql utility will inject ID if missing for auth_users
        await sql`
      INSERT INTO auth_users (id, name, email)
      VALUES (${id}, 'Test User', ${email})
    `;
        console.log('✅ User created.');

        console.log('2. Creating profile in user_profiles...');
        const result = await sql`
      INSERT INTO user_profiles (user_id, name, role, photo_url, active)
      VALUES (${id}, 'Test User', 'teacher', ${null}, true)
      RETURNING *
    `;

        console.log('Result:', JSON.stringify(result, null, 2));

        if (result && result.length > 0 && result[0].id) {
            console.log('\n✅ SUCCESS: Profile created with ID:', result[0].id);
            console.log('✅ Role:', result[0].role);
        } else {
            console.log('\n❌ FAILURE: Profile not created or ID missing');
            process.exit(1);
        }
    } catch (err) {
        console.error('\n❌ ERROR during test:', err);
        process.exit(1);
    }
}

test();
