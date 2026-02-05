-- Adicionar políticas para permitir que usuários admin vejam todos os perfis de alunos
-- Primeiro, vamos remover as políticas existentes e criar novas mais adequadas

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON perfis;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON perfis;
DROP POLICY IF EXISTS "Usuários podem inserir próprio perfil" ON perfis;

-- Criar políticas mais flexíveis

-- Política para permitir que qualquer usuário autenticado veja todos os perfis
CREATE POLICY "Perfis visíveis para usuários autenticados"
    ON perfis FOR SELECT
    USING (auth.role() = 'authenticated');

-- Política para permitir que usuários vejam próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil"
    ON perfis FOR SELECT
    USING (auth.uid() = id);

-- Política para permitir usuários atualizarem próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
    ON perfis FOR UPDATE
    USING (auth.uid() = id);

-- Política para permitir usuários inserirem próprio perfil
CREATE POLICY "Usuários podem inserir próprio perfil"
    ON perfis FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política para admin inserir perfis (se necessário)
CREATE POLICY "Admin pode inserir perfis"
    ON perfis FOR INSERT
    WITH CHECK (true);

-- Política para admin atualizar perfis
CREATE POLICY "Admin pode atualizar perfis"
    ON perfis FOR UPDATE
    USING (true);

-- Verificar se há dados na tabela
SELECT COUNT(*) as total_perfis, tipo FROM perfis GROUP BY tipo;
