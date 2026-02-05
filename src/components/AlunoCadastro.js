import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AlunoCadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return false;
    }
    
    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Criar usuário no Supabase Auth sem confirmação de e-mail
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Este e-mail já está cadastrado');
        } else {
          setError('Erro ao criar conta: ' + error.message);
        }
      } else {
        console.log('Usuário criado com sucesso:', data.user);
        console.log('ID do usuário:', data.user.id);
        console.log('Nome do aluno:', formData.nome);
        
        // Inserir dados na tabela perfis (o trigger também fará isso automaticamente)
        const perfilData = {
          id: data.user.id,
          nome: formData.nome,
          tipo: 'aluno'
        };
        
        console.log('Inserindo perfil:', perfilData);
        
        const { data: perfilInsert, error: perfilError } = await supabase
          .from('perfis')
          .insert([perfilData])
          .select();

        console.log('Resultado da inserção:', perfilInsert);
        console.log('Erro na inserção:', perfilError);

        if (perfilError) {
          console.error('Erro ao criar perfil:', perfilError);
          setError('Erro ao salvar perfil: ' + perfilError.message);
        } else {
          console.log('Perfil criado com sucesso!');
          setSuccess(true);
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            navigate('/aluno/dashboard');
          }, 2000);
        }
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/aluno/login');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800 text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Conta Criada com Sucesso!
            </h2>
            <p className="text-gray-400 mb-6">
              Bem-vindo ao app, {formData.nome}!
            </p>
            <p className="text-gray-500 text-sm">
              Redirecionando para seu dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft 
            size={20} 
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span>Voltar</span>
        </button>

        {/* Formulário de Cadastro */}
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Cadastro de Aluno
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            {/* Campo E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite sua senha (mínimo 6 caracteres)"
                required
                minLength={6}
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirme sua senha"
                required
                minLength={6}
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <UserPlus 
                size={20} 
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{loading ? 'Cadastrando...' : 'Cadastrar'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlunoCadastro;
