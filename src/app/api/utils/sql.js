import crypto from 'node:crypto';
import path from 'node:path';

let db = null;
try {
  const Database = (await import('better-sqlite3')).default;
  const DB_PATH = path.join(process.cwd(), 'database.sqlite');
  db = new Database(DB_PATH);
} catch (e) {
  console.warn("⚠️ SQLite database unavailable in this environment:", e.message);
}

function sql(strings, ...values) {
  if (!db) {
    throw new Error("SQLite database is not initialized in this environment.");
  }

  let query = strings.join('?');
  const isInsert = query.trim().toUpperCase().startsWith('INSERT');
  const isSelect = query.trim().toUpperCase().startsWith('SELECT');
  const hasReturning = query.toUpperCase().includes('RETURNING');

  const finalValues = values.map(v => v === true ? 1 : v === false ? 0 : v);

  // If it's an insert and missing ID column, inject one using a placeholder
  if (isInsert && !query.toLowerCase().includes('(id,') && !query.toLowerCase().includes(' id,')) {
    const insertMatch = query.match(/INSERT INTO (\w+)\s*\(/i);
    if (insertMatch) {
      const tableName = insertMatch[1];
      const targetTables = ['auth_users', 'auth_accounts', 'auth_sessions', 'user_profiles', 'students', 'classes', 'pre_enrollments', 'teachers', 'class_enrollments'];
      if (targetTables.includes(tableName.toLowerCase())) {
        query = query.replace(/INSERT INTO (\w+)\s*\(/i, 'INSERT INTO $1 (id, ');
        query = query.replace(/VALUES\s*\(/i, `VALUES (?, `);
        finalValues.unshift(crypto.randomUUID());
      }
    }
  }

  try {
    const stmt = db.prepare(query);

    if (isSelect) {
      return stmt.all(...finalValues);
    } else if (hasReturning) {
      return stmt.all(...finalValues);
    } else {
      return stmt.run(...finalValues);
    }
  } catch (err) {
    console.error(`❌ [SQL ERROR] Query: ${query}`);
    console.error(`❌ [SQL ERROR] Values:`, finalValues);
    console.error(`❌ [SQL ERROR] Message: ${err.message}`);
    throw err;
  }
}

sql.transaction = (cb) => {
  if (!db) {
    throw new Error("SQLite database is not initialized in this environment.");
  }
  return db.transaction(cb)();
};

export default sql;