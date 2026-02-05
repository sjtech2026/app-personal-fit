import React, { useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar se é primeiro acesso
    const isFirstAccess = localStorage.getItem('is_first_access') !== 'false';
    
    if (isFirstAccess) {
      // Se for primeiro acesso, verificar credenciais padrão
      if (formData.usuario === 'admin' && formData.senha === 'admin') {
        localStorage.setItem('is_admin', 'true');
        navigate('/admin/first-access');
      } else {
        setError('Use as credenciais padrão (admin/admin) para o primeiro acesso');
      }
    } else {
      // Se não for primeiro acesso, usar credenciais salvas
      const savedUser = localStorage.getItem('admin_user');
      const savedPassword = localStorage.getItem('admin_password');
      
      if (formData.usuario === savedUser && formData.senha === savedPassword) {
        localStorage.setItem('is_admin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Usuário ou senha incorretos');
      }
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
            Acesso Personal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Usuário */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-300 mb-2">
                Usuário
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu usuário"
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
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
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
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <LogIn 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
              <span>Entrar</span>
            </button>
          </form>

          {/* Dica de acesso */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {localStorage.getItem('is_first_access') !== 'false' 
                ? 'Use as credenciais padrão para primeiro acesso'
                : 'Use suas credenciais personalizadas'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
