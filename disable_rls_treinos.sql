-- Desativar RLS temporariamente na tabela treinos
-- Isso permite que o Personal (login local) possa inserir treinos

ALTER TABLE treinos DISABLE ROW LEVEL SECURITY;

-- Verificar se o RLS está desativado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'treinos';

-- Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'treinos' 
ORDER BY ordinal_position;
