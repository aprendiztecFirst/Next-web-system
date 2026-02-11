const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

console.log('--- Auth Users ---');
const users = db.prepare('SELECT * FROM auth_users').all();
console.table(users);

console.log('\n--- Auth Accounts ---');
const accounts = db.prepare('SELECT * FROM auth_accounts').all();
console.table(accounts);

console.log('\n--- User Profiles ---');
const profiles = db.prepare('SELECT * FROM user_profiles').all();
console.table(profiles);

db.close();
