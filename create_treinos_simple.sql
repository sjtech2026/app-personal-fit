-- Criar tabela simplificada para treinos
CREATE TABLE IF NOT EXISTS treinos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aluno_id UUID REFERENCES perfis(id) ON DELETE CASCADE,
    nome_treino TEXT NOT NULL,
    exercicios JSONB NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_treinos_aluno_id ON treinos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_treinos_data_criacao ON treinos(data_criacao);

-- Habilitar RLS
ALTER TABLE treinos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura para usuários autenticados"
    ON treinos FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados"
    ON treinos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados"
    ON treinos FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados"
    ON treinos FOR DELETE
    USING (auth.role() = 'authenticated');

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'treinos' 
ORDER BY ordinal_position;
