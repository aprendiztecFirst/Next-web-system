import Database from 'better-sqlite3';
const db = new Database('database.sqlite');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

tables.forEach(table => {
    console.log(`\nSchema for ${table.name}:`);
    const schema = db.prepare(`PRAGMA table_info(${table.name})`).all();
    console.table(schema);
});
