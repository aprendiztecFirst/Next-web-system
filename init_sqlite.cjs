const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

db.exec(`
  CREATE TABLE IF NOT EXISTS auth_users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified INTEGER,
    image TEXT,
    created_at INTEGER DEFAULT (stride_timestamp()),
    updated_at INTEGER DEFAULT (stride_timestamp())
  );

  CREATE TABLE IF NOT EXISTS auth_accounts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    password TEXT,
    created_at INTEGER DEFAULT (stride_timestamp()),
    updated_at INTEGER DEFAULT (stride_timestamp()),
    UNIQUE(provider, providerAccountId)
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    expires INTEGER NOT NULL,
    created_at INTEGER DEFAULT (stride_timestamp())
  );

  CREATE TABLE IF NOT EXISTS auth_verification_token (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires INTEGER NOT NULL,
    PRIMARY KEY (identifier, token)
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    name TEXT,
    role TEXT,
    photo_url TEXT,
    active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (stride_timestamp())
  );
`);

function stride_timestamp() {
    return Math.floor(Date.now() / 1000);
}

// Better-sqlite3 doesn't support custom functions in DEFAULT directly easily without triggers, 
// so let's just use CURRENT_TIMESTAMP or update the schema to use simpler defaults if needed.
// Actually, let's just use simpler schema for now.

db.exec(`
  DROP TABLE IF EXISTS auth_users;
  DROP TABLE IF EXISTS auth_accounts;
  DROP TABLE IF EXISTS auth_sessions;
  DROP TABLE IF EXISTS auth_verification_token;
  DROP TABLE IF EXISTS user_profiles;

  CREATE TABLE auth_users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE auth_accounts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, providerAccountId)
  );

  CREATE TABLE auth_sessions (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    expires DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE auth_verification_token (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
  );

  CREATE TABLE user_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    name TEXT,
    role TEXT,
    photo_url TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('SQLite database initialized at database.sqlite');
db.close();
