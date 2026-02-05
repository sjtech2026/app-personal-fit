-- Desativar RLS temporariamente para permitir acesso do Personal
ALTER TABLE perfis DISABLE ROW LEVEL SECURITY;

-- Verificar dados existentes
SELECT * FROM perfis WHERE tipo = 'aluno';

-- Contar alunos
SELECT COUNT(*) as total_alunos FROM perfis WHERE tipo = 'aluno';
