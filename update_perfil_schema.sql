-- Adicionar colunas de dados biométricos à tabela perfis
ALTER TABLE perfis 
ADD COLUMN IF NOT EXISTS peso FLOAT,
ADD COLUMN IF NOT EXISTS altura FLOAT,
ADD COLUMN IF NOT EXISTS idade INTEGER;

-- Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'perfis' 
ORDER BY ordinal_position;

-- Verificar dados existentes
SELECT * FROM perfis LIMIT 5;
