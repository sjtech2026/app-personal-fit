-- Adicionar coluna dia_semana à tabela treinos
ALTER TABLE treinos 
ADD COLUMN IF NOT EXISTS dia_semana VARCHAR(20) NOT NULL DEFAULT 'Segunda';

-- Criar índice composto para performance
CREATE INDEX IF NOT EXISTS idx_treinos_aluno_dia ON treinos(aluno_id, dia_semana);

-- Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'treinos' 
ORDER BY ordinal_position;

-- Verificar dados existentes
SELECT * FROM treinos ORDER BY data_criacao DESC LIMIT 5;
