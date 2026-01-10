-- Script para ajustar estrutura das tabelas auth_*
-- Execute no Supabase SQL Editor

-- Primeiro, deletar as tabelas antigas se existirem
DROP TABLE IF EXISTS auth_sessions CASCADE;
DROP TABLE IF EXISTS auth_accounts CASCADE;
DROP TABLE IF EXISTS auth_verification_token CASCADE;
DROP TABLE IF EXISTS auth_users CASCADE;

-- Criar tabela auth_users com ID auto-gerado
CREATE TABLE auth_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela auth_accounts
CREATE TABLE auth_accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, "providerAccountId")
);

-- Criar tabela auth_sessions
CREATE TABLE auth_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela auth_verification_token
CREATE TABLE auth_verification_token (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Criar índices
CREATE INDEX idx_accounts_user_id ON auth_accounts("userId");
CREATE INDEX idx_sessions_user_id ON auth_sessions("userId");
CREATE INDEX idx_sessions_session_token ON auth_sessions("sessionToken");

-- Confirmar
SELECT 'Tabelas criadas com sucesso com a estrutura correta!' as status;
