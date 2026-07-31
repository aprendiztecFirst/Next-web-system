const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

try {
    const users = db.prepare('SELECT id, name, email FROM auth_users').all();
    const accounts = db.prepare('SELECT userId, provider, password FROM auth_accounts').all();
    const profiles = db.prepare('SELECT user_id, name, role FROM user_profiles').all();

    console.log('--- AUTH USERS ---');
    console.log(users);
    console.log('--- AUTH ACCOUNTS ---');
    console.log(accounts);
    console.log('--- USER PROFILES ---');
    console.log(profiles);

} catch (e) {
    console.error('Error:', e.message);
} finally {
    db.close();
}
