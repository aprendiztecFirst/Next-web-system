import Database from 'better-sqlite3';

const db = new Database('database.sqlite');

function sql(strings, ...values) {
  let query = strings.join('?');
  const isInsert = query.trim().toUpperCase().startsWith('INSERT');
  const isSelect = query.trim().toUpperCase().startsWith('SELECT');
  const hasReturning = query.toUpperCase().includes('RETURNING');

  // If it's an insert and missing ID column, inject one
  if (isInsert && !query.toLowerCase().includes('(id,') && !query.toLowerCase().includes(' id,')) {
    // Matches "INSERT INTO table_name ("
    const insertMatch = query.match(/INSERT INTO (\w+)\s*\(/i);
    if (insertMatch) {
      const tableName = insertMatch[1];
      // Only inject if it's one of our tables that usually uses UUIDs
      const authTables = ['auth_users', 'auth_accounts', 'auth_sessions', 'user_profiles', 'students', 'classes', 'pre_enrollments'];
      if (authTables.includes(tableName.toLowerCase())) {
        query = query.replace(/INSERT INTO (\w+)\s*\(/i, 'INSERT INTO $1 (id, ');
        query = query.replace(/VALUES\s*\(/i, `VALUES ('${crypto.randomUUID()}', `);
      }
    }
  }

  // Basic boolean handling for SQLite
  const finalValues = values.map(v => v === true ? 1 : v === false ? 0 : v);

  const stmt = db.prepare(query);

  if (isSelect) {
    return stmt.all(...finalValues);
  } else if (hasReturning) {
    return stmt.all(...finalValues);
  } else {
    const result = stmt.run(...finalValues);
    return result;
  }
}

sql.transaction = (cb) => {
  return db.transaction(cb)();
};

export default sql;