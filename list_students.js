import Database from 'better-sqlite3';
const db = new Database('database.sqlite');
const students = db.prepare('SELECT id, full_name, email FROM students').all();
console.log(JSON.stringify(students, null, 2));
db.close();
