-- Criar tabela para treinos salvos
CREATE TABLE IF NOT EXISTS treinos_salvos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aluno_id UUID REFERENCES perfis(id) ON DELETE CASCADE,
    personal_id VARCHAR(255),
    nome_treino VARCHAR(255) NOT NULL,
    exercicios JSONB NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'ativo' -- ativo, concluido, cancelado
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_treinos_aluno_id ON treinos_salvos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_treinos_personal_id ON treinos_salvos(personal_id);
CREATE INDEX IF NOT EXISTS idx_treinos_status ON treinos_salvos(status);
CREATE INDEX IF NOT EXISTS idx_treinos_data_criacao ON treinos_salvos(data_criacao);

-- Habilitar RLS
ALTER TABLE treinos_salvos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura para usuários autenticados"
    ON treinos_salvos FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados"
    ON treinos_salvos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados"
    ON treinos_salvos FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados"
    ON treinos_salvos FOR DELETE
    USING (auth.role() = 'authenticated');

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'treinos_salvos' 
ORDER BY ordinal_position;
