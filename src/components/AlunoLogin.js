import React, { useState } from 'react';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AlunoLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      if (error) {
        setError('E-mail ou senha incorretos');
      } else {
        // Verificar se é um aluno
        const { data: perfil } = await supabase
          .from('perfis')
          .select('tipo')
          .eq('id', data.user.id)
          .single();

        if (perfil?.tipo === 'aluno') {
          navigate('/aluno/dashboard');
        } else {
          setError('Este não é um acesso de aluno');
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

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

        {/* Formulário de Login */}
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Login do Aluno
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Digite sua senha"
                required
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <LogIn 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
              <span>{loading ? 'Entrando...' : 'Entrar'}</span>
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Não tem conta?{' '}
              <button
                onClick={() => navigate('/aluno/cadastro')}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex items-center justify-center space-x-1 group"
              >
                <UserPlus size={16} className="group-hover:scale-110 transition-transform duration-200" />
                <span>Cadastre-se aqui</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlunoLogin;
