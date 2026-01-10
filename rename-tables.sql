-- Script para renomear tabelas adicionando prefixo auth_
-- Execute este script no Supabase SQL Editor

-- Renomear tabelas
ALTER TABLE IF EXISTS users RENAME TO auth_users;
ALTER TABLE IF EXISTS accounts RENAME TO auth_accounts;
ALTER TABLE IF EXISTS sessions RENAME TO auth_sessions;
ALTER TABLE IF EXISTS verification_tokens RENAME TO auth_verification_token;

-- Confirmar
SELECT 'Tabelas renomeadas com sucesso!' as status;

-- Listar todas as tabelas auth_*
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'auth_%'
ORDER BY table_name;
