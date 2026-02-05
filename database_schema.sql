-- Criar tabela de perfis
CREATE TABLE perfis (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('aluno', 'personal')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar função para automaticamente criar perfil quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfis (id, nome, tipo)
    VALUES (new.id, new.raw_user_meta_data->>'nome', 'aluno');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que dispara a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Configurar Row Level Security (RLS)
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

-- Política para permitir usuários verem próprio perfil
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
